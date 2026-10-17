# Front async SSE adapter

Source: OpenSpec `front-async-sse` (FASSE-001 … FASSE-010).

| Step | Behavior |
| --- | --- |
| Cache hit | Return session/localStorage list immediately; still open SSE |
| Cache miss | HTTP GET Nest list → `completeDowload` → viewer paint |
| SSE | Authenticated fetch stream → merge into cache + `dataModelRoot` → `notifyDataChanged` |
| Delayed rows | `NeoComDelayed.isReady()` / not-ready styling until enrichment |

SSE base path: `environment.sseBasePath` (default `/v1`).
