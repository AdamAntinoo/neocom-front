# Front programme logging sections (CICD-F-115)

Stable section identifiers for `LoggingService` calls:

| Section | Use |
| --- | --- |
| `app` | Bootstrap, shell, routing |
| `auth` | Login / session |
| `pilot` | Pilot panel and data |
| `industry` | Blueprints / industry |
| `assets` | Assets by location |
| `http` | HTTP adapters |
| `sse` | SSE enrichment |
| `universe` | Universe ESI reference data |

Levels: `DEBUG`, `INFO`, `PRODUCTION` (call sites). Configuration may set a section to `NONE` to suppress `DEBUG`/`INFO`. `PRODUCTION` is never filtered by environment floor.
