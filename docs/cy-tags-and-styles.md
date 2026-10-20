# Cypress tags and styles catalog

Extracted from the current `neocom-front/src` implementation. Update this file when tags or shared style classes change.

Related: colour palette lives in `src/styles/_palette.scss`; geometry in `src/styles/geometry.scss`; panel frames in `src/styles/panel-styles.scss`.

---

## 1. Cypress attribute conventions

| Attribute | Purpose |
| --- | --- |
| `cy-section-name` | Names a layout region, panel shell, or render block |
| `cy-field-value` | Names the displayed value for a field |
| `cy-field-label` | Names a field caption (label text) |
| `cy-name` | Names an interactive control (button, link) |

Selectors in tests: `[cy-section-name="…"]`, `[cy-field-value="…"]`, `[cy-name="…"]`.

---

## 2. `cy-section-name` register

| Value | Description | Where defined |
| --- | --- | --- |
| `header` | Shared page header row (`app-page-header`) | `modules/header/page-header` |
| `app-info` | Application identity block (name / version / copyright) | `v1-application-info-render`, legacy `app-info-panel` |
| `server-info` | EVE / NeoCom server status block | `v1-server-status-render`, legacy `server-info-panel` |
| `login` | Login page main panel (title + validate / EVE button) | `pages/login-page` |
| `login-progress` | SSO callback progress panel | `panels/login-validation-progress` |
| `exception` | Exception region (dashboard or login-callback) | `pages/dashboard-home-page`, `panels/login-validation-exception` |
| `pilot-dashboard` | Dashboard row hosting the pilot panel | `pages/dashboard-home-page` |
| `pilot` | Pilot public data panel | `modules/header/v1-pilot-panel` |
| `industry-home` | Industry feature home section | `modules/industry/.../industry-home-page` |
| `manufacture-home` | Manufacture feature home section | `modules/industry/manufacture/.../manufacture-home-page` |
| `available-blueprints` | Available blueprints listing panel | `.../available-blueprints-panel` |
| `blueprint-detailed` | Blueprint render detailed layout (`-AVAILABLE-BLUEPRINTS-`) | `v1-blueprint-render` |
| `blueprint-short` | Blueprint render short layout | `v1-blueprint-render` |
| `viewer-downloading` | Viewer downloading placeholder | `modules/shared/viewer-panel` |

---

## 3. `cy-field-value` register

| Value | Description | Typical host section |
| --- | --- | --- |
| `app-name` | Application name (uppercase) | `app-info` |
| `app-version` | Application version | `app-info` |
| `app-copyright` | Copyright line | `app-info` |
| `server-name` | EVE server name | `server-info` |
| `server-online` | ONLINE / OFFLINE label | `server-info` |
| `players-count` | Capsuleer count | `server-info` |
| `backend-version` | NeoCom backend version | `server-info` |
| `sde-version` | SDE version | `server-info` |
| `next-downtime` | Next downtime hint | `server-info` |
| `title-message` | Login title (`NeoCom / SSO EVE Online`) | `login` |
| `validation-message` | Login session-check message | `login` |
| `progress-label` | Callback waiting message | `login-progress` |
| `progress-code` | Authorization code or `-AWAITING-CODE-` | `login-progress` |
| `exceptionTitle` | Exception title | `exception` |
| `exceptionMessage` | Exception message | `exception` |
| `pilot-id` | Pilot character id | `pilot` |
| `pilot-name` | Pilot name | `pilot` |
| `pilot-birthday` | Birthday | `pilot` |
| `pilot-gender` | Gender | `pilot` |
| `pilot-security` | Security status | `pilot` |
| `pilot-corporation` | Corporation name / ticker | `pilot` |
| `pilot-alliance` | Alliance name | `pilot` |
| `pilot-race` | Race name | `pilot` |
| `pilot-bloodline` | Bloodline name | `pilot` |
| `pilot-ancestry` | Ancestry name | `pilot` |
| `pilot-description` | Description (when present) | `pilot` |
| `pilot-error` | Pilot load error message | `pilot` |
| `blueprint-name` | Blueprint display name | `blueprint-*` |
| `blueprint-id` | Blueprint type id | `blueprint-detailed` |
| `manufacture-index` | Manufacture cost index label | `blueprint-detailed` |

---

## 4. `cy-field-label` register

| Value | Description | Where |
| --- | --- | --- |
| `exceptionTitle` | Caption for exception title (dashboard also reuses for “EXCEPTION” / “TITLE”) | `dashboard-home-page` exception region |
| `exceptionMessage` | Caption for exception message | `dashboard-home-page` exception region |

---

## 5. `cy-name` register

| Value | Description | Where |
| --- | --- | --- |
| `EVE-login-button` | EVE SSO login image link (`getLoginLink()` href) | `login-page` |

---

## 6. Global styles (`src/styles/`)

Loaded from `src/styles.scss` via `@use` (Sass modules). `angular.json` sets `includePaths: ["src/styles"]` so components can `@use 'palette'`.

| File | Role | Classes / tokens |
| --- | --- | --- |
| `_palette.scss` | Colour table `$neo-colors` + Sass aliases | `color()`, `color-var()`, `$panel-*`, `$page-*`, … |
| `_theme.scss` | Emits `--neo-color-*` on `:root`; page shell defaults | `html`, `body` background/foreground |
| `_tokens.scss` | Spacing / type / panel metrics | `$panel-padding`, `$neocom-line-height`, … |
| `_scss_variables.scss` | Compat `@forward` of palette + tokens | Prefer `@use 'palette'` / `@use 'tokens'` |
| `geometry.scss` | Page geometry (zero margin/padding/border/gap) | `.neo-page`, `.section`, `.column`, `.row`, modifiers |
| `neocom.scss` | Shared panel flex helper | `.neocom-panel` |
| `panel-styles.scss` | Panel colour frames | `.panel-red` … `.panel-white`, `*-expanded`, `*-selected`, `*-draggable`, `.panel-inset`, `.selected-green` |
| `fonts.scss` | `@font-face` + face helper classes | `.opensans-ff`, `.elemental-ff`, `.proxima-ff`, … |

### Geometry classes (global)

| Class | Use |
| --- | --- |
| `neo-page` | Page host — set via `host: { class: 'neo-page' }` |
| `section` / `neo-section` | Flush page band |
| `column` / `neo-column` | Vertical flex |
| `row` / `neo-row` | Horizontal flex |
| `row--wrap` | Opt-in wrap |
| `section--grow` / `column--grow` / `row--grow` | Opt-in flex grow |
| `section--fill` / `column--fill` | Opt-in fill |

### Panel colour classes (global)

`panel-red`, `panel-pink`, `panel-orange`, `panel-yellow`, `panel-lime`, `panel-green`, `panel-lightblue`, `panel-blue`, `panel-violet`, `panel-white` — plus `-expanded`, `-selected`, `-draggable` suffixes where defined. Base fill uses `--neo-color-panel-background`.

### CSS custom properties (global)

Pattern: `--neo-color-<palette-key>` from `$neo-colors` (e.g. `--neo-color-panel-blue`, `--neo-color-page-background`). Also `--neo-panel-*` metrics from `_theme.scss`.

---

## 7. Styles outside global styles (component / local)

These SCSS files are **not** in `src/styles/`; they style a single component or page. Prefer `@use 'palette'` for colours and rely on global geometry/panel classes when possible.

| Path | What it styles | Notes |
| --- | --- | --- |
| `app/app.scss` | App root | Empty |
| `pages/login-page/...scss` | Login page host + `.panel`, `.login-message`, `.validation-message`, `.eve-login-request`, `.footer` | Page colours via palette CSS vars; local margins/gaps for login chrome |
| `pages/login-callback-page/...scss` | Callback host + progress/exception text helpers | Palette page colours |
| `pages/dashboard-home-page/...scss` | Dashboard host only | Geometry from global classes |
| `modules/industry/.../industry-home-page.scss` | Industry page host | Palette page colours |
| `modules/industry/.../manufacture-home-page.scss` | Manufacture page host | Palette page colours |
| `modules/header/page-header/...scss` | Header facade | Minimal / empty comment |
| `modules/header/app-info-panel/...scss` | Legacy app-info layout (`.app-name`, `.app-version`, …) | Uses palette; prefer `v1-application-info-render` |
| `modules/renders/v1-application-info-render/...scss` | App-info render typography/colours | Uses palette CSS vars |
| `modules/renders/v1-server-status-render/...scss` | Server-status render layout (`.server-info-panel`, `.field`, `.label`) | Local layout; panel frame from global `panel-blue` |
| `modules/header/server-info-panel/...scss` | Legacy server-info layout | Transitional |
| `modules/header/v1-pilot-panel/...scss` | Pilot panel (`.pilot`, `.label`, host border) | Local colours (`rgba`), not yet palette |
| `modules/renders/v1-blueprint-render/...scss` | `.blueprint-detailed` / `.blueprint-short` flex gaps | Local |
| `modules/renders/v2-node-container/...scss` | Node container host | Local |
| `modules/shared/viewer-panel/...scss` | Viewer panel | Local |
| `modules/shared/standalone-node-panel/...scss` | Standalone node host | Local |
| `modules/industry/.../available-blueprints-panel.scss` | Blueprints panel | Local |
| `panels/login-validation-progress/...scss` | Progress panel | Local |
| `panels/login-validation-exception/...scss` | Exception panel | Local |

### Local utility / content classes (component templates)

Not defined in global geometry/panel sheets (or only partially):

| Class | Typical location | Role |
| --- | --- | --- |
| `page-header` | `app-page-header` | Header section marker |
| `app-name-panel`, `app-name`, `app-version`, `app-version-position`, `app-copyright` | App-info render / legacy panel | Identity typography |
| `server-info-panel`, `server-name`, `server-online` | Server-status render | Status layout |
| `field`, `label` | Pilot, server-status, dashboard exception | Field row helpers (local) |
| `panel` | Login page, dashboard pilot host | Local content stack (not `.panel-*` colour) |
| `login-message`, `validation-message`, `eve-login-request`, `footer` | Login page | Login chrome |
| `progress-label`, `progress-code`, `exception-label`, `exception-title`, `exception-message` | Callback / dashboard exception | Exception / progress text |
| `pilot` | `v1-pilot-panel` | Pilot column |
| `blueprint-detailed`, `blueprint-short` | `v1-blueprint-render` | Blueprint layouts |
| `unknown-render` | `v2-node-container` | Missing render fallback |
| Face helpers (`opensans-ff`, …) | Global `fonts.scss` | Font samples (legacy server-info) |

---

## 8. Host / geometry wiring in use

Pages that set `host: { class: 'neo-page' }`:

- `login-page`
- `login-callback-page`
- `dashboard-home-page`
- `industry-home-page`
- `manufacture-home-page`

Templates combine global geometry with panel colours, e.g. `class="row section page-header"`, `class="section column"`, `class="neocom-panel panel-white"`.

---

## 9. Variants (`NeoComVariant` enum)

Not Cypress tags. All variants are registered in `src/app/modules/innovative-core/domain/NeoComVariant.ts`. Use the enum constants — do not invent string literals.

Convention: start `-`, end `-`, uppercase, `-` between words.

| Constant | Value | Use |
| --- | --- | --- |
| `NeoComVariant.APP` | `-APP-` | `app-page-header` secured chrome (default) |
| `NeoComVariant.AUTH` | `-AUTH-` | `app-page-header` auth chrome |
| `NeoComVariant.HEADER` | `-HEADER-` | Standalone renders inside the header |
| `NeoComVariant.DEFAULT` | `-DEFAULT-` | Default render / panel variant |
| `NeoComVariant.AVAILABLE_BLUEPRINTS` | `-AVAILABLE-BLUEPRINTS-` | Detailed blueprint render layout |

---

*Generated from `src/` as of the header / palette / geometry work. Prefer editing tags and shared styles in code first, then refresh this catalog.*
