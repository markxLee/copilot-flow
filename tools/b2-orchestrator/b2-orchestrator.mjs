#!/usr/bin/env node

/**
 * B2 Orchestrator - Deep Dive CLI for External LLM Execution
 * 
 * Supports:
 * - Single role execution (--role)
 * - Parallel multi-role execution (--roles)
 * - Append to existing session (--append-to)
 * - Per-role model selection (--model role:model)
 * - Synthesis of all turns (--synthesize)
 * - Legacy full pipeline (--phase)
 */

import fs from "node:fs";
import path from "node:path";

// ============================================================
// UTILITIES
// ============================================================

function pad2(value) {
  return String(value).padStart(2, "0");
}

function formatTimestamp(date = new Date()) {
  const y = date.getFullYear();
  const m = pad2(date.getMonth() + 1);
  const d = pad2(date.getDate());
  const hh = pad2(date.getHours());
  const mm = pad2(date.getMinutes());
  const ss = pad2(date.getSeconds());
  return `${y}${m}${d}-${hh}${mm}${ss}`;
}

function formatISOTimestamp(date = new Date()) {
  return date.toISOString();
}

function hasTimestampSuffix(fileName) {
  return /-\d{8}-\d{6}$/.test(fileName);
}

function resolveOutPath(outArg) {
  const ts = formatTimestamp();

  if (outArg.includes("<YYYYMMDD-HHMMSS>")) {
    return outArg.replaceAll("<YYYYMMDD-HHMMSS>", ts);
  }

  if (outArg.includes("%TIMESTAMP%")) {
    return outArg.replaceAll("%TIMESTAMP%", ts);
  }

  const parsed = path.parse(outArg);

  if (!parsed.ext) {
    const base = parsed.base;
    if (hasTimestampSuffix(base)) {
      return outArg;
    }
    return path.join(parsed.dir, `${base}-${ts}.md`);
  }

  if (hasTimestampSuffix(parsed.name)) {
    return outArg;
  }

  return path.join(parsed.dir, `${parsed.name}-${ts}${parsed.ext}`);
}

function readTextFile(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function ensureDirForFile(filePath) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

// ============================================================
// ARGUMENT PARSING
// ============================================================

function parseArgs(argv) {
  const args = {
    // New session-based args
    role: null,              // Single role to run
    roles: [],               // Multiple roles (parallel)
    appendTo: null,          // Append to existing session file
    synthesize: null,        // Synthesize a session file
    context: [],             // Context files/dirs to load
    model: {},               // role:model mappings
    
    // Legacy args (full pipeline)
    phase: null,
    title: "",
    input: [],
    out: null,
    
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    // New args
    if (token === "--role") {
      args.role = argv[++i];
      continue;
    }

    if (token === "--roles") {
      args.roles = argv[++i].split(",").map(r => r.trim());
      continue;
    }

    if (token === "--append-to") {
      args.appendTo = argv[++i];
      continue;
    }

    if (token === "--synthesize") {
      args.synthesize = argv[++i];
      continue;
    }

    if (token === "--context") {
      args.context.push(argv[++i]);
      continue;
    }

    if (token === "--model") {
      // Format: role:model or just model (default)
      const val = argv[++i];
      if (val.includes(":")) {
        const [role, model] = val.split(":");
        args.model[role] = model;
      } else {
        args.model.default = val;
      }
      continue;
    }

    // Legacy args
    if (token === "--phase") {
      args.phase = argv[++i];
      continue;
    }

    if (token === "--title") {
      args.title = argv[++i];
      continue;
    }

    if (token === "--input") {
      args.input.push(argv[++i]);
      continue;
    }

    if (token === "--out") {
      args.out = argv[++i];
      continue;
    }

    if (token === "-h" || token === "--help") {
      args.help = true;
      continue;
    }
  }

  return args;
}

// ============================================================
// MODEL & API
// ============================================================

function getModelForRole(role, modelOverrides = {}) {
  // Check explicit override first
  if (modelOverrides[role]) {
    return modelOverrides[role];
  }
  
  // Check env var for this role
  const envKey = `B2_MODEL_${role.toUpperCase()}`;
  if (process.env[envKey]) {
    return process.env[envKey];
  }
  
  // Check default override
  if (modelOverrides.default) {
    return modelOverrides.default;
  }
  
  // Fall back to env default
  return process.env.OPENAI_MODEL_DEFAULT || "gpt-4.1";
}

function baseUrl() {
  return process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
}

async function callOpenAI({ model, system, user }) {
  const apiKey = requireEnv("OPENAI_API_KEY");

  const resp = await fetch(`${baseUrl()}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`OpenAI error ${resp.status}: ${text}`);
  }

  const data = await resp.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("No content in OpenAI response");
  }

  return content;
}

// ============================================================
// ROLE DEFINITIONS
// ============================================================

const ROLE_PROMPTS = {
  architect: {
    system: "You are a Senior Software Architect. Be pragmatic, structured, and decisive.",
    user: (context) => `Analyze the following problem and propose 2-3 viable approaches.
Include tradeoffs and recommend ONE approach.

## Output Format
- Proposed approaches (2-3)
- Recommended approach (pick one)
- Key design decisions
- Interfaces/contracts
- Migration/rollout notes (if any)

## Context
${context}`,
  },
  
  critic: {
    system: "You are a Devil's Advocate / Senior Reviewer. Be skeptical, thorough, and constructive.",
    user: (context) => `Find flaws, missing assumptions, and edge cases in the proposed solution.

## Output Format
- Top risks/concerns (prioritized)
- Missing assumptions / clarifying questions
- Edge cases likely to be missed
- Suggested simplifications

## Context
${context}`,
  },
  
  security: {
    system: "You are a Security Engineer / Threat Modeler. Be risk-aware, specific, and actionable.",
    user: (context) => `Identify security, privacy, and operational risks with concrete mitigations.

## Output Format
- Threats (top 5)
- Mitigations (concrete)
- Non-functional requirements to add to spec
- Security-related open questions

## Context
${context}`,
  },
  
  strict: {
    system: "You are a Quality Gate / Release Manager. Be uncompromising, evidence-based, and decisive.",
    user: (context) => `Evaluate readiness with a PASS/FAIL verdict. Be strict - prefer FAIL over vague advice.

## Output Format
- PASS/FAIL verdict (and why)
- Required fixes before proceeding
- Missing evidence
- Scope cuts / guardrails

## Context
${context}`,
  },
  
  consensus: {
    system: "You are the Tech Lead making the final call. Be decisive, balanced, and action-oriented.",
    user: (context) => `Merge all previous perspectives into ONE decision.

## Output Format
- Decision (1-3 bullets)
- Rationale (tradeoffs)
- Risks & mitigations (top 3-5)
- Open questions
- Next steps / action items

## Context
${context}`,
  },
};

// ============================================================
// SESSION MANAGEMENT
// ============================================================

function loadContextFiles(paths) {
  const parts = [];
  
  for (const p of paths) {
    const abs = path.resolve(p);
    const stat = fs.statSync(abs);
    
    if (stat.isDirectory()) {
      // Load all .md files in directory
      const files = fs.readdirSync(abs).filter(f => f.endsWith(".md"));
      for (const file of files) {
        const content = readTextFile(path.join(abs, file));
        parts.push(`# File: ${file}\n\n${content}`);
      }
    } else {
      const content = readTextFile(abs);
      parts.push(`# File: ${p}\n\n${content}`);
    }
  }
  
  return parts.join("\n\n---\n\n");
}

function parseSessionLog(content) {
  const turns = [];
  const turnRegex = /## Turn (\d+): (\w+)\n\*\*Model\*\*: ([^\n]+)\n\*\*Timestamp\*\*: ([^\n]+)\n\n([\s\S]*?)(?=\n---\n|## Turn|## Synthesis|$)/g;
  
  let match;
  while ((match = turnRegex.exec(content)) !== null) {
    turns.push({
      turn: parseInt(match[1]),
      role: match[2].toLowerCase(),
      model: match[3],
      timestamp: match[4],
      content: match[5].trim(),
    });
  }
  
  // Extract problem/title from header
  const titleMatch = content.match(/# Deep Dive Session: ([^\n]+)/);
  const problemMatch = content.match(/Problem: ([^\n]+)/);
  
  return {
    title: titleMatch?.[1] || "(untitled)",
    problem: problemMatch?.[1] || "",
    turns,
    hasSynthesis: content.includes("## Synthesis"),
  };
}

function formatTurn(turnNum, role, model, content) {
  return `## Turn ${turnNum}: ${role.charAt(0).toUpperCase() + role.slice(1)}
**Model**: ${model}
**Timestamp**: ${formatISOTimestamp()}

${content}

---
`;
}

function formatSynthesis(content) {
  return `## Synthesis
**Generated**: ${formatISOTimestamp()}

${content}
`;
}

function createNewSessionLog(title, phase) {
  return `# Deep Dive Session: ${title}
Phase: ${phase}
Started: ${formatISOTimestamp()}
Problem: ${title}

---

`;
}

// ============================================================
// COMMANDS
// ============================================================

async function runSingleRole(args) {
  const role = args.role.toLowerCase();
  
  if (!ROLE_PROMPTS[role] && !role.startsWith("custom:")) {
    throw new Error(`Unknown role: ${role}. Available: architect, critic, security, strict, consensus, custom:<name>`);
  }
  
  // Load context
  let context = "";
  if (args.context.length > 0) {
    context = loadContextFiles(args.context);
  }
  
  // If appending, load existing session and add to context
  let sessionLog = "";
  let turnNum = 1;
  
  if (args.appendTo) {
    if (fs.existsSync(args.appendTo)) {
      sessionLog = readTextFile(args.appendTo);
      const parsed = parseSessionLog(sessionLog);
      turnNum = parsed.turns.length + 1;
      
      // Add previous turns to context
      if (parsed.turns.length > 0) {
        context += "\n\n## Previous Analysis Turns\n\n";
        for (const turn of parsed.turns) {
          context += `### ${turn.role}\n${turn.content}\n\n`;
        }
      }
    } else {
      // Create new session
      sessionLog = createNewSessionLog(args.title || "(untitled)", "0");
    }
  }
  
  // Get prompts
  let systemPrompt, userPrompt;
  
  if (role.startsWith("custom:")) {
    const customName = role.replace("custom:", "");
    systemPrompt = `You are a ${customName} expert. Provide focused analysis from this perspective.`;
    userPrompt = `Analyze the following from a ${customName} perspective.\n\n## Context\n${context}`;
  } else {
    systemPrompt = ROLE_PROMPTS[role].system;
    userPrompt = ROLE_PROMPTS[role].user(context);
  }
  
  // Call LLM
  const model = getModelForRole(role, args.model);
  console.log(`Running ${role} with model ${model}...`);
  
  const result = await callOpenAI({
    model,
    system: systemPrompt,
    user: userPrompt,
  });
  
  // Format turn
  const turnContent = formatTurn(turnNum, role, model, result);
  
  // Append to session or output
  if (args.appendTo) {
    const newContent = sessionLog + turnContent;
    ensureDirForFile(args.appendTo);
    fs.writeFileSync(args.appendTo, newContent, "utf8");
    console.log(`Turn ${turnNum} (${role}) appended to: ${args.appendTo}`);
  } else if (args.out) {
    const outPath = resolveOutPath(args.out);
    ensureDirForFile(outPath);
    fs.writeFileSync(outPath, turnContent, "utf8");
    console.log(`Wrote: ${outPath}`);
  } else {
    console.log("\n" + turnContent);
  }
}

async function runParallelRoles(args) {
  const roles = args.roles.map(r => r.toLowerCase());
  
  // Validate roles
  for (const role of roles) {
    if (!ROLE_PROMPTS[role] && !role.startsWith("custom:")) {
      throw new Error(`Unknown role: ${role}`);
    }
  }
  
  // Load context
  let context = "";
  if (args.context.length > 0) {
    context = loadContextFiles(args.context);
  }
  
  // Load existing session if appending
  let sessionLog = "";
  let turnNum = 1;
  
  if (args.appendTo) {
    if (fs.existsSync(args.appendTo)) {
      sessionLog = readTextFile(args.appendTo);
      const parsed = parseSessionLog(sessionLog);
      turnNum = parsed.turns.length + 1;
    } else {
      sessionLog = createNewSessionLog(args.title || "(untitled)", "0");
    }
  }
  
  console.log(`Running ${roles.length} roles in parallel: ${roles.join(", ")}...`);
  
  // Run all roles in parallel
  const results = await Promise.all(
    roles.map(async (role) => {
      const systemPrompt = ROLE_PROMPTS[role]?.system || `You are a ${role} expert.`;
      const userPrompt = ROLE_PROMPTS[role]?.user(context) || `Analyze from a ${role} perspective.\n\n${context}`;
      const model = getModelForRole(role, args.model);
      
      console.log(`  - ${role} (${model})`);
      
      const result = await callOpenAI({
        model,
        system: systemPrompt,
        user: userPrompt,
      });
      
      return { role, model, result };
    })
  );
  
  // Append all turns
  let newContent = sessionLog;
  for (const { role, model, result } of results) {
    newContent += formatTurn(turnNum++, role, model, result);
  }
  
  if (args.appendTo) {
    ensureDirForFile(args.appendTo);
    fs.writeFileSync(args.appendTo, newContent, "utf8");
    console.log(`${results.length} turns appended to: ${args.appendTo}`);
  } else if (args.out) {
    const outPath = resolveOutPath(args.out);
    ensureDirForFile(outPath);
    fs.writeFileSync(outPath, newContent, "utf8");
    console.log(`Wrote: ${outPath}`);
  }
}

async function runSynthesize(args) {
  const sessionPath = args.synthesize;
  
  if (!fs.existsSync(sessionPath)) {
    throw new Error(`Session file not found: ${sessionPath}`);
  }
  
  const sessionLog = readTextFile(sessionPath);
  const parsed = parseSessionLog(sessionLog);
  
  if (parsed.hasSynthesis) {
    console.log("Session already has synthesis. Skipping.");
    return;
  }
  
  if (parsed.turns.length === 0) {
    throw new Error("No turns to synthesize");
  }
  
  // Build context from all turns
  let context = `# Problem\n${parsed.problem}\n\n# Previous Analysis\n\n`;
  for (const turn of parsed.turns) {
    context += `## ${turn.role}\n${turn.content}\n\n`;
  }
  
  const model = getModelForRole("consensus", args.model);
  console.log(`Synthesizing ${parsed.turns.length} turns with ${model}...`);
  
  const result = await callOpenAI({
    model,
    system: ROLE_PROMPTS.consensus.system,
    user: ROLE_PROMPTS.consensus.user(context),
  });
  
  const synthesis = formatSynthesis(result);
  const newContent = sessionLog + synthesis;
  
  fs.writeFileSync(sessionPath, newContent, "utf8");
  console.log(`Synthesis added to: ${sessionPath}`);
}

// ============================================================
// LEGACY: FULL PIPELINE
// ============================================================

function buildLegacyPrompts({ phase, title, context }) {
  const common = `Context:\n${context}\n\nInstructions:\n- Output MUST be concise and actionable.\n- Use markdown.\n- Provide risks + questions if unclear.`;

  if (phase === "0") {
    return {
      architect: `You are a Solution Architect. Propose 2-3 viable approaches for: ${title}.\nInclude tradeoffs and a recommended approach.\n\n${common}`,
      critic: `You are a Skeptical Reviewer (Contrarian). Attack the proposed solution space for: ${title}.\nFind missing assumptions, failure modes, scope creep risks, and questions.\n\n${common}`,
      security: `You are a Security/Risk Engineer. For: ${title}, identify security/privacy/operational risks and mitigations.\n\n${common}`,
      strict: `You are a VERY STRICT delivery gatekeeper. For: ${title}, be uncompromising.\nReturn a PASS/FAIL verdict for proceeding, with required fixes and missing evidence.\nPrefer FAIL over vague advice when the context is insufficient.\n\n${common}`,
      consensus: `You are the Team Lead. Merge the workers into ONE consensus decision for: ${title}.\nYou MUST include: (1) chosen approach, (2) why, (3) non-goals, (4) risks+mitigations, (5) open questions.\n\n${common}`,
    };
  }

  if (phase === "1") {
    return {
      architect: `You are a Spec Writer. Convert the intent for: ${title} into atomic requirements with testable ACs.\n\n${common}`,
      critic: `You are a QA-minded Spec Critic. Find ambiguities and missing edge cases for: ${title}.\n\n${common}`,
      security: `You are a Risk Reviewer. Ensure the spec includes NFRs and safety constraints for: ${title}.\n\n${common}`,
      strict: `You are a VERY STRICT reviewer. For: ${title}, identify all spec defects that block implementation.\nReturn MUST-FIX items (no niceties), and a PASS/FAIL verdict for spec readiness.\n\n${common}`,
      consensus: `You are the Team Lead. Produce a single improved spec outline + a checklist of must-fix ambiguities for: ${title}.\n\n${common}`,
    };
  }

  if (phase === "5") {
    return {
      architect: `You are a Release Gatekeeper. For: ${title}, define a DoD checklist and evidence required.\n\n${common}`,
      critic: `You are a Regression Hunter. For: ${title}, list likely regressions and how to verify them.\n\n${common}`,
      security: `You are a Compliance/Audit Reviewer. For: ${title}, list required artifacts and evidence links.\n\n${common}`,
      strict: `You are a VERY STRICT release approver. For: ${title}, decide PASS/FAIL for release readiness.\nRequire concrete evidence; list missing proofs and required checks.\n\n${common}`,
      consensus: `You are the Team Lead. Produce a final Done Check report template + PASS/FAIL rules for: ${title}.\n\n${common}`,
    };
  }

  throw new Error(`Unsupported phase: ${phase}`);
}

function renderLegacyReport({ title, phase, inputs, workers, consensus }) {
  const phaseLabel = phase === "0" ? "Phase 0 (Analysis)" : phase === "1" ? "Phase 1 (Spec)" : "Phase 5 (Done)";

  return `# Deep Dive Log — Option B — ${phaseLabel}\n\n` +
    `> Generated by B2 orchestrator (external LLM API).\n\n` +
    `## Title\n${title}\n\n` +
    `## Inputs\n` + inputs.map((p) => `- ${p}`).join("\n") + "\n\n" +
    `---\n\n` +
    `## Worker Outputs\n\n` +
    `### Architect\n${workers.architect}\n\n` +
    `### Critic\n${workers.critic}\n\n` +
    `### Security\n${workers.security}\n\n` +
    `### Strict\n${workers.strict}\n\n` +
    `---\n\n` +
    `## Consensus\n${consensus}\n`;
}

async function runLegacyPipeline(args) {
  const title = args.title || "(untitled)";
  const phase = String(args.phase);

  const contextParts = args.input.map((p) => {
    const abs = path.resolve(p);
    const content = readTextFile(abs);
    return `# File: ${p}\n\n${content}`;
  });

  const context = contextParts.join("\n\n---\n\n");
  const prompts = buildLegacyPrompts({ phase, title, context });
  const system = "You are a specialized software delivery worker.";

  const architect = await callOpenAI({
    model: getModelForRole("architect", args.model),
    system,
    user: prompts.architect,
  });

  const critic = await callOpenAI({
    model: getModelForRole("critic", args.model),
    system,
    user: prompts.critic,
  });

  const security = await callOpenAI({
    model: getModelForRole("security", args.model),
    system,
    user: prompts.security,
  });

  const strict = await callOpenAI({
    model: getModelForRole("strict", args.model),
    system,
    user: prompts.strict,
  });

  const consensus = await callOpenAI({
    model: getModelForRole("consensus", args.model),
    system,
    user:
      `You will receive four worker outputs. Produce ONE consensus.\n\n` +
      `## Architect\n${architect}\n\n## Critic\n${critic}\n\n## Security\n${security}\n\n## Strict\n${strict}\n\n` +
      prompts.consensus,
  });

  const report = renderLegacyReport({
    title,
    phase,
    inputs: args.input,
    workers: { architect, critic, security, strict },
    consensus,
  });

  const resolvedOut = resolveOutPath(args.out);
  ensureDirForFile(resolvedOut);
  fs.writeFileSync(resolvedOut, report, "utf8");
  console.log(`Wrote: ${resolvedOut}`);
}

// ============================================================
// MAIN
// ============================================================

function printHelp() {
  console.log(`
B2 Orchestrator - Deep Dive CLI for External LLM Execution

USAGE:
  # Single role, append to session
  node b2-orchestrator.mjs --role architect --append-to session.md --context ./docs/

  # Multiple roles in parallel
  node b2-orchestrator.mjs --roles architect,critic,security --append-to session.md --context ./docs/

  # Custom model per role
  node b2-orchestrator.mjs --role architect --model architect:claude-sonnet --append-to session.md

  # Synthesize all turns
  node b2-orchestrator.mjs --synthesize session.md

  # Legacy: Full pipeline
  node b2-orchestrator.mjs --phase 0 --title "Feature X" --input file1.md --input file2.md --out output.md

OPTIONS:
  --role <name>         Run single role (architect, critic, security, strict, consensus, custom:<name>)
  --roles <list>        Run multiple roles in parallel (comma-separated)
  --append-to <file>    Append turn(s) to existing session file
  --context <path>      Load context from file or directory (can be repeated)
  --model <role:model>  Specify model for a role (e.g., architect:gpt-4o)
  --synthesize <file>   Synthesize all turns in a session file
  --title <string>      Title for new session (used with --append-to or --out)
  --out <file>          Output file (standalone, not appending)

  # Legacy options
  --phase <0|1|5>       Run full legacy pipeline
  --input <file>        Input file for legacy pipeline (can be repeated)

ENV VARS:
  OPENAI_API_KEY        (required) API key
  OPENAI_BASE_URL       (optional) Custom API endpoint
  OPENAI_MODEL_DEFAULT  (optional) Default model
  B2_MODEL_<ROLE>       (optional) Per-role model (e.g., B2_MODEL_ARCHITECT)

EXAMPLES:
  # Start a new session and run architect
  node b2-orchestrator.mjs --role architect --append-to ./session.md --context ./context/ --title "My Feature"

  # Add critic analysis
  node b2-orchestrator.mjs --role critic --append-to ./session.md

  # Run 3 roles in parallel with different models
  node b2-orchestrator.mjs --roles architect,critic,security \\
    --model architect:claude-sonnet --model critic:gpt-4o --model security:claude-sonnet \\
    --append-to ./session.md

  # Synthesize
  node b2-orchestrator.mjs --synthesize ./session.md
`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  // Determine which mode to run
  if (args.synthesize) {
    await runSynthesize(args);
  } else if (args.roles.length > 0) {
    await runParallelRoles(args);
  } else if (args.role) {
    await runSingleRole(args);
  } else if (args.phase) {
    // Legacy pipeline
    if (!args.out || args.input.length === 0) {
      console.error("Legacy mode requires --phase, --input, and --out");
      process.exit(1);
    }
    await runLegacyPipeline(args);
  } else {
    printHelp();
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err?.stack || String(err));
  process.exit(1);
});
