# AbeAmm Node Runtime

Small authenticated Node.js runtime intended to provide a real backend health/status endpoint for ABEAMM PANEL.

## Endpoints
- `GET /health` — public health check for Render.
- `GET /api/status` — protected runtime and host metrics.
- `POST /api/echo` — protected connectivity test.

Protected endpoints require:
`Authorization: Bearer YOUR_ABEAMM_RUNTIME_TOKEN`

## Deploy
1. Push this repository to GitHub.
2. In Render, create a Web Service from the repository.
3. Select the Singapore region and Free plan for initial testing.
4. Set `ABEAMM_RUNTIME_TOKEN` to a long random secret in Render Environment.
5. Deploy and confirm `/health` returns `{ "ok": true }`.
6. Configure the same token securely in the ABEAMM PANEL server-side environment. Never put it in browser-side `NEXT_PUBLIC_` variables.

## Important limits
The Free plan is for connectivity testing only. It does not provide the 6 GB RAM / 200% CPU / 6 GB persistent disk requested for the Abe Amm server. The status endpoint reports the actual runtime host capacity; it does not claim those requested limits are allocated. A persistent disk and larger plan require a paid service and explicit cost review.
