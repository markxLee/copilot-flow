# B2 Orchestrator — Deep Dive Option B (Optional)

## IMPORTANT / QUAN TRỌNG

EN: B2 is a local helper that calls an external LLM API (OpenAI, or OpenAI-compatible if configured). It does **not** use the VS Code GitHub Copilot backend/subscription. You must provide your own API credentials, and billing/data-sharing follow your chosen provider.

VI: B2 là helper chạy local và gọi tới API của một LLM bên ngoài (OpenAI, hoặc OpenAI-compatible nếu cấu hình). Nó **không** dùng backend/subscription GitHub Copilot trong VS Code. Bạn cần tự cung cấp API credentials, và chi phí/việc chia sẻ dữ liệu sẽ theo provider bạn chọn.

If you do not want to use an external API, use **Option A** via `/deep-dive` (Copilot-only deep dive) instead.
Nếu bạn không muốn dùng external API, hãy dùng **Option A** qua `/deep-dive` (deep dive chỉ bằng Copilot) thay vì B2.

This is the implementation behind **Deep Dive Option B**.

B2 is an **optional** enhancement for hard work:
- system analysis
- complex bugs
- complex solutions and tradeoffs

It does not replace the existing Copilot governed workflow.

## Philosophy
- Default path stays simple.
- B2 is a "turbo button" used only when needed.

## How to use
- Use `/deep-dive option:B` to run the external deep dive (Option B).
- Run the local script in `tools/b2-orchestrator/` to generate a consensus report.

## Multi-model support
If you wire B2 to an API that supports model selection, each worker can use a different model via env vars:
- `B2_MODEL_ARCHITECT`
- `B2_MODEL_CRITIC`
- `B2_MODEL_SECURITY`
- `B2_MODEL_STRICT`
- `B2_MODEL_CONSENSUS`
