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

## Install and start (dev)

From the parent `neocom` checkout (see also parent README Part 1):

```bash
cd neocom-front
nvm use neocom
npm install
```

1. Start **WireMock** (mocks backend HTTP — front `dev` does not use `neocom-back`).
2. Start the Angular app:

```bash
npm run start:dev
# or: npm start
```

Open the URL printed by the CLI (default `http://localhost:4200`).

## Tests

```bash
npm test          # Vitest unit tests
npm run e2e       # Cypress + Cucumber (app should be running, or configure CI to start it)
npm run e2e:open  # interactive Cypress
```

Feature files: `cypress/e2e/features/`. Step definitions: `cypress/e2e/step_definitions/`.
