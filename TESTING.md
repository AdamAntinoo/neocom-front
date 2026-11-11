# Front testing command catalog (CICD-F-040…044)

Shared short names. Intent aligns with `neocom-back` (implementations may differ).

| Command | Layer | Setup | What it runs |
| --- | --- | --- | --- |
| `npm run test:tdd` | TDD | `nvm use`; `npm install` | Vitest unit tests (`ng test`, non-watch) |
| `npm run test:coverage` | TDD + coverage | same | Unit tests with coverage + thresholds |
| `npm run test:bdd` | BDD | Starts WireMock + `ng serve` (or reuse if already up); then Cypress | Cypress + Cucumber acceptance |
| `npm run test:bdd:run` | BDD | App + WireMock **already** running | Cypress only (CI after server start) |
| `npm run test:sdd` | SDD | Development deployment reachable (full integration) | Placeholder until SDD feature files exist (`CICD-F-045…047`) |
| `npm run test:all` | All | Union of the above setups | `test:tdd` → `test:bdd` → `test:sdd` |

Environment notes:

- Automated Gherkin uses WireMock fixtures under `support/wiremock` — **not** for development user testing (CICD-F-014).
- Front-only CI does not require a live `neocom-back` (CICD-F-075).
- Acceptance features live under `cypress/e2e/features/` — **one feature file per product page** (login, dashboard, character-selection, industry blueprints-by-location, pilot assets-by-location). **Skipped:** `model-strip` and `color-table`.
- Authenticated scenarios use catalog steps that mock `neocom_access` (and stub `/v1/pilots*` APIs) so flows run like the real app without SSO.
- Cypress `baseUrl` is `http://localhost:6001` (same host as `ng serve` / SSO redirectUri).
