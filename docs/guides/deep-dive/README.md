# Deep Dive (Option A/B)

This guide defines the Deep Dive worker roles so outputs overlap less and each role leans into a distinct strength.

- **Option A**: Copilot-only (no external API). Copilot runs the roles in chat and writes a timestamped deep-dive log per phase.
- **Option B**: External CLI (LLM API). The runner produces a timestamped deep-dive log per phase.

## Where logs go
Store logs inside the relevant phase folder so they don't overwrite and remain reviewable:
- Phase 0: `00_analysis/deep-dive-<A|B>-<YYYYMMDD-HHMMSS>.md`
- Phase 1: `01_spec/deep-dive-<A|B>-<YYYYMMDD-HHMMSS>.md`
- Phase 5: `05_done/deep-dive-<A|B>-<YYYYMMDD-HHMMSS>.md`

Note (Option B): you can pass a stable output name like `deep-dive-B.md` to the runner; it will auto-append a timestamp and write `deep-dive-B-<YYYYMMDD-HHMMSS>.md` to avoid overwrites.

## Roles
See role definitions:
- [Architect](roles/architect.md)
- [Critic](roles/critic.md)
- [Security](roles/security.md)
- [Strict](roles/strict.md)
- [Consensus](roles/consensus.md)
