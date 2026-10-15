# neocom-front

Angular **22** (current stable at scaffold) frontend for the Neocom ecosystem.

- Language: **TypeScript**
- Unit tests: **Vitest** (`ng test`)
- Acceptance tests: **Cypress** + **Cucumber** (`npm run e2e`)
- Local **dev** API: **WireMock** (no `neocom-back`)

## Node / nvm

Use the Node version required by Angular 22 (`^22.22.3 || ^24.15.0 || >=26.0.0`). This repo pins **24.21.0** in `.nvmrc`.

On a machine with nvm, the NEOCOM environment alias is **`neocom`**:

```bash
nvm install        # reads .nvmrc
nvm alias neocom 24.21.0   # once per machine (or after upgrading Node)
nvm use neocom
```

## Install

From the parent `neocom` checkout (see also parent README Part 1):

```bash
cd neocom-front
nvm use neocom
npm install
```

Copy `.env.example` to `.env` if you need local overrides (`NEOCOM_PROFILE`, `PORT`, `WIREMOCK_URL`, …).

## Backend routing (shared config)

`config/backends.json` is the **single source of truth** for API proxy routes. Both modes consume it:

| Mode | How |
| --- | --- |
| `ng serve` | `proxy.conf.js` → `config/load-backends.cjs` |
| Node Express | `server.js` → same loader |

Default profile: **`wiremock`** — `/api`, `/nin/v1`, `/esi/v1` → `http://localhost:8080`.

Other profiles: `dev` (wiremock alias), `local` (split backend/nest hosts), `production` (env overrides via `BACKEND_URL` / `NEST_URL`).

## Start modes

### 1. Day-to-day Angular (`ng serve` + proxy)

1. Start **WireMock** on port 8080 with stub root `support/wiremock` (mocks backend HTTP — front `dev` does not use `neocom-back`).
2. Start the Angular app:

```bash
npm run start:dev
# or: npm start
```

Open the URL printed by the CLI (default `http://localhost:4200`). Browser calls stay same-origin (`/api`, `/nin/v1`, `/esi/v1`); the dev server proxies them per `config/backends.json`.

### 2. Node Express serving the build

Serves `dist/neocom-front/browser` with the same proxies (Infinity-style static + API gateway):

```bash
npm run build
npm run start:node    # or: npm run start:server
# or one shot:
npm run start:prod
```

Default listen port: **3000** (`PORT` / `config/backends.json`).

## Start page

`/` redirects to `/dashboard`, which renders the dashboard home page. Pages live in `src/app/pages`; panels live in `src/app/panels`. Cypress catalog tags for those components are listed in [docs/ui-component-catalog.md](docs/ui-component-catalog.md).

## Tests

```bash
npm test          # Vitest unit tests
npm run test:pilot # Pilot fixture: WireMock character 93813310, no live backend
npm run e2e       # Cypress + Cucumber (app should be running, or configure CI to start it)
npm run e2e:open  # interactive Cypress
```

Feature files: `cypress/e2e/features/`. Step definitions: `cypress/e2e/step_definitions/`.

## CI

GitHub Actions workflow [`.github/workflows/build.yml`](.github/workflows/build.yml) runs on push and pull request to `main`, `feature/**`, `feat/**`, `fix/**`, and `release/**`. It installs with `npm ci` (Node from `.nvmrc`), runs a production `npm run build`, and uploads `dist/neocom-front` as the `neocom-front-dist` artifact (7-day retention).
