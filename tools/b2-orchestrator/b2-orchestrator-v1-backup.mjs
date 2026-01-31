#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

function pad2(value) {
  return String(value).padStart(2, "0");
}

function formatTimestamp(date) {
  const y = date.getFullYear();
  const m = pad2(date.getMonth() + 1);
  const d = pad2(date.getDate());
  const hh = pad2(date.getHours());
  const mm = pad2(date.getMinutes());
  const ss = pad2(date.getSeconds());
  return `${y}${m}${d}-${hh}${mm}${ss}`;
}

function hasTimestampSuffix(fileName) {
  return /-\d{8}-\d{6}$/.test(fileName);
}

function resolveOutPath(outArg) {
  const ts = formatTimestamp(new Date());

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

function parseArgs(argv) {
  const args = {
    phase: null,
    title: "",
    input: [],
    out: null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

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

function modelForWorker(workerName) {
  const map = {
    architect: process.env.B2_MODEL_ARCHITECT,
    critic: process.env.B2_MODEL_CRITIC,
    security: process.env.B2_MODEL_SECURITY,
    strict: process.env.B2_MODEL_STRICT,
    consensus: process.env.B2_MODEL_CONSENSUS,
  };

  return map[workerName] || process.env.OPENAI_MODEL_DEFAULT || "gpt-4.1";
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

function buildWorkerPrompt({ phase, title, context }) {
  const common = `Context:\n${context}\n\nInstructions:\n- Output MUST be concise and actionable.\n- Use markdown.\n- Provide risks + questions if unclear.`;

  if (phase === "0") {
    return {
      architect:
        `You are a Solution Architect. Propose 2-3 viable approaches for: ${title}.\n` +
        `Include tradeoffs and a recommended approach.\n\n${common}`,
      critic:
        `You are a Skeptical Reviewer (Contrarian). Attack the proposed solution space for: ${title}.\n` +
        `Find missing assumptions, failure modes, scope creep risks, and questions.\n\n${common}`,
      security:
        `You are a Security/Risk Engineer. For: ${title}, identify security/privacy/operational risks and mitigations.\n\n${common}`,
      strict:
        `You are a VERY STRICT delivery gatekeeper. For: ${title}, be uncompromising.\n` +
        `Return a PASS/FAIL verdict for proceeding, with required fixes and missing evidence.\n` +
        `Prefer FAIL over vague advice when the context is insufficient.\n\n${common}`,
      consensus:
        `You are the Team Lead. Merge the workers into ONE consensus decision for: ${title}.\n` +
        `You MUST include: (1) chosen approach, (2) why, (3) non-goals, (4) risks+mitigations, (5) open questions.\n\n${common}`,
    };
  }

  if (phase === "1") {
    return {
      architect:
        `You are a Spec Writer. Convert the intent for: ${title} into atomic requirements with testable ACs.\n\n${common}`,
      critic:
        `You are a QA-minded Spec Critic. Find ambiguities and missing edge cases for: ${title}.\n\n${common}`,
      security:
        `You are a Risk Reviewer. Ensure the spec includes NFRs and safety constraints for: ${title}.\n\n${common}`,
      strict:
        `You are a VERY STRICT reviewer. For: ${title}, identify all spec defects that block implementation.\n` +
        `Return MUST-FIX items (no niceties), and a PASS/FAIL verdict for spec readiness.\n\n${common}`,
      consensus:
        `You are the Team Lead. Produce a single improved spec outline + a checklist of must-fix ambiguities for: ${title}.\n\n${common}`,
    };
  }

  if (phase === "5") {
    return {
      architect:
        `You are a Release Gatekeeper. For: ${title}, define a DoD checklist and evidence required.\n\n${common}`,
      critic:
        `You are a Regression Hunter. For: ${title}, list likely regressions and how to verify them.\n\n${common}`,
      security:
        `You are a Compliance/Audit Reviewer. For: ${title}, list required artifacts and evidence links.\n\n${common}`,
      strict:
        `You are a VERY STRICT release approver. For: ${title}, decide PASS/FAIL for release readiness.\n` +
        `Require concrete evidence; list missing proofs and required checks.\n\n${common}`,
      consensus:
        `You are the Team Lead. Produce a final Done Check report template + PASS/FAIL rules for: ${title}.\n\n${common}`,
    };
  }

  throw new Error(`Unsupported phase: ${phase}`);
}

function renderReport({ title, phase, inputs, workers, consensus }) {
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

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || !args.phase || !args.out || args.input.length === 0) {
    console.log(
      `Usage:\n  node tools/b2-orchestrator/b2-orchestrator.mjs --phase <0|1|5> --title <title> --input <file> [--input <file2> ...] --out <file>` +
        `\n\nOut file naming:` +
        `\n  - If --out contains <YYYYMMDD-HHMMSS> or %TIMESTAMP%, it will be replaced automatically.` +
        `\n  - Otherwise, a timestamp suffix is inserted before the extension to avoid overwrites.` +
        `\n    Example: --out 00_analysis/deep-dive-B.md  => 00_analysis/deep-dive-B-<timestamp>.md` +
        `\n\nEnv:` +
        `\n  OPENAI_API_KEY (required)` +
        `\n  OPENAI_BASE_URL (optional)` +
        `\n  OPENAI_MODEL_DEFAULT (optional)` +
        `\n  B2_MODEL_ARCHITECT / B2_MODEL_CRITIC / B2_MODEL_SECURITY / B2_MODEL_STRICT / B2_MODEL_CONSENSUS (optional)\n`,
    );
    process.exit(0);
  }

  const title = args.title || "(untitled)";
  const phase = String(args.phase);

  const contextParts = args.input.map((p) => {
    const abs = path.resolve(p);
    const content = readTextFile(abs);
    return `# File: ${p}\n\n${content}`;
  });

  const context = contextParts.join("\n\n---\n\n");
  const prompts = buildWorkerPrompt({ phase, title, context });

  const system = "You are a specialized software delivery worker.";

  const architect = await callOpenAI({
    model: modelForWorker("architect"),
    system,
    user: prompts.architect,
  });

  const critic = await callOpenAI({
    model: modelForWorker("critic"),
    system,
    user: prompts.critic,
  });

  const security = await callOpenAI({
    model: modelForWorker("security"),
    system,
    user: prompts.security,
  });

  const strict = await callOpenAI({
    model: modelForWorker("strict"),
    system,
    user: prompts.strict,
  });

  const consensus = await callOpenAI({
    model: modelForWorker("consensus"),
    system,
    user:
      `You will receive four worker outputs. Produce ONE consensus.\n\n` +
      `## Architect\n${architect}\n\n## Critic\n${critic}\n\n## Security\n${security}\n\n## Strict\n${strict}\n\n` +
      prompts.consensus,
  });

  const report = renderReport({
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

main().catch((err) => {
  console.error(err?.stack || String(err));
  process.exit(1);
});
