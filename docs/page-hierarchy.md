# Page hierarchy and flow

Map of routed pages: **URL path**, **component**, and **folder** under `src/app`. Update this file when a route or page folder is added or renamed.

Related: [angular-structure.md](./angular-structure.md) (placement rules).

## Table of contents

- [Page hierarchy and flow](#page-hierarchy-and-flow)
  - [Table of contents](#table-of-contents)
  - [Route → page → location](#route--page--location)
  - [Hierarchy (modules and folders)](#hierarchy-modules-and-folders)
  - [Navigation / page flow](#navigation--page-flow)
  - [Router load tree](#router-load-tree)
  - [Pages — panel diagrams](#pages--panel-diagrams)
    - [1. `/login` — `login-page`](#1-login--login-page)
    - [2. `/login-callback` — `login-callback-page`](#2-login-callback--login-callback-page)
    - [3. `/dashboard` — `dashboard-home-page`](#3-dashboard--dashboard-home-page)
    - [4. `/model-strip` — `model-strip-page`](#4-model-strip--model-strip-page)
    - [5. `/color-table` — `color-table-page`](#5-color-table--color-table-page)
    - [6. `/industry` — `industry-home-page`](#6-industry--industry-home-page)
    - [7. `/industry/manufacture` — `manufacture-home-page`](#7-industrymanufacture--manufacture-home-page)
    - [8. `/industry/manufacture/blueprints` — `v1-blueprint-by-location-page`](#8-industrymanufactureblueprints--v1-blueprint-by-location-page)

## Route → page → location

| URL | Guard | Page selector | Folder |
| --- | --- | --- | --- |
| `/` | — | → redirect `dashboard` | — |
| `/login` | — | `login-page` | `pages/login-page` |
| `/login-callback` | — | `login-callback-page` | `pages/login-callback-page` |
| `/dashboard` | `authGuard` | `dashboard-home-page` | `pages/dashboard-home-page` |
| `/model-strip` | — | `model-strip-page` | `pages/model-strip-page` |
| `/color-table` | — | `color-table-page` | `pages/color-table-page` |
| `/industry` | — | `industry-home-page` | `modules/industry/pages/industry-home-page` |
| `/industry/manufacture` | — | `manufacture-home-page` | `modules/industry/manufacture/pages/manufacture-home-page` |
| `/industry/manufacture/blueprints` | — | `v1-blueprint-by-location-page` | `modules/industry/manufacture/pages/v1-blueprint-by-location-page` |

## Hierarchy (modules and folders)

```mermaid
flowchart TB
  subgraph shell["Shell — app/pages"]
    login["login-page<br/>/login"]
    callback["login-callback-page<br/>/login-callback"]
    dash["dashboard-home-page<br/>/dashboard · authGuard"]
    strip["model-strip-page<br/>/model-strip"]
    colors["color-table-page<br/>/color-table"]
  end

  subgraph industry["Section — modules/industry"]
    indHome["industry-home-page<br/>/industry"]
    subgraph manufacture["Subsection — industry/manufacture"]
      mfgHome["manufacture-home-page<br/>/industry/manufacture"]
      bpList["v1-blueprint-by-location-page<br/>/industry/manufacture/blueprints"]
    end
  end

  industry --> indHome
  industry --> manufacture
  manufacture --> mfgHome
  manufacture --> bpList
```

## Navigation / page flow

Intended user flow (Feature panel targets and auth). Dashed edges are development-only or not yet wired from the UI.

```mermaid
flowchart LR
  login["/login"] -->|SSO success| callback["/login-callback"]
  callback -->|auth ok| dash["/dashboard"]
  empty["/"] -->|redirect| dash

  dash -->|Industry Feature<br/>when wired| ind["/industry"]
  ind --> mfg["/industry/manufacture"]
  mfg --> blueprints["/industry/manufacture/blueprints<br/>v1-blueprint-by-location"]

  dash -.->|dev catalog| strip["/model-strip"]
  strip -.->|no auth| blueprints
```

## Router load tree

```mermaid
flowchart TB
  root["app.routes.ts"]
  root --> shellPages["pages/* direct components"]
  root --> indLoad["loadChildren IndustryModule<br/>path: industry"]
  indLoad --> indRoutes["industry.module routes"]
  indRoutes --> indPage["'' → industry-home-page"]
  indRoutes --> mfgLoad["loadChildren ManufactureModule<br/>path: manufacture"]
  mfgLoad --> mfgRoutes["manufacture.module routes"]
  mfgRoutes --> mfgPage["'' → manufacture-home-page"]
  mfgRoutes --> bpPage["blueprints → v1-blueprint-by-location-page"]
```

## Pages — panel diagrams

Per-page layout: numbered **sections** (top → bottom) with **panel / section identifiers** (`cy-section-name` or selector). Nested boxes are panels or renders hosted inside a section. Update the matching subsection when a page’s panel stack changes.

### 1. `/login` — `login-page`

| # | Identifier | Kind | Notes |
| --- | --- | --- | --- |
| 1 | `header` | `app-page-header` | Variant `-AUTH-` → `v1-application-info-render` |
| 2 | `login` | login panel | Title + validation message **or** EVE SSO button |
| 3 | `footer` | footer | Copyright line |

```mermaid
flowchart TB
  page["login-page · /login"]
  page --> s1["§1 header<br/>app-page-header · -AUTH-"]
  s1 --> r1["v1-application-info-render<br/>panel-white"]
  page --> s2["§2 login<br/>cy-section-name=login"]
  s2 --> title["title-message"]
  s2 --> cta["validation-message XOR<br/>EVE-login-button"]
  page --> s3["§3 footer"]
```

### 2. `/login-callback` — `login-callback-page`

| # | Identifier | Kind | Notes |
| --- | --- | --- | --- |
| 1 | `header` | `app-page-header` | Variant `-AUTH-` |
| 2 | `login-validation-progress` | progress panel | Waiting message + auth code |
| 3 | `login-validation-exception` | exception panel | Only when exception present |

```mermaid
flowchart TB
  page["login-callback-page · /login-callback"]
  page --> s1["§1 header<br/>app-page-header · -AUTH-"]
  s1 --> r1["v1-application-info-render"]
  page --> s2["§2 login-validation-progress"]
  page --> s3["§3 login-validation-exception<br/>optional"]
```

### 3. `/dashboard` — `dashboard-home-page`

Secured landing page. **Target** layout (EPIC-006); current seed still has pilot only under `pilot-dashboard` (corporation / breadcrumb / feature list pending).

| # | Identifier | Kind | Notes |
| --- | --- | --- | --- |
| 1 | `header` | `app-page-header` | Variant `-APP-` → application-info + server-status |
| 2 | `exception` | exception region | Optional; under header when present |
| 3 | `pilot-dashboard` | pilot & corporation row | Left: `v1-pilot-panel` · Right: `v1-corporation-render` (target) |
| 4 | `breadcrumb` | breadcrumb row | Target — navigable trail from Dashboard |
| 5 | `feature-list` | feature listing panel | Target — provider + `v1-feature-button` |

```mermaid
flowchart TB
  page["dashboard-home-page · /dashboard · authGuard"]
  page --> s1["§1 header<br/>app-page-header · -APP-"]
  s1 --> app["v1-application-info-render<br/>panel-white"]
  s1 --> srv["v1-server-status-render<br/>panel-blue"]
  page --> s2["§2 exception<br/>cy-section-name=exception · optional"]
  page --> s3["§3 pilot-dashboard<br/>pilot & corporation row"]
  s3 --> pilot["v1-pilot-panel<br/>left"]
  s3 --> corp["v1-corporation-render<br/>right · target"]
  page --> s4["§4 breadcrumb<br/>target"]
  page --> s5["§5 feature-list<br/>listing panel · target"]
  s5 --> feat["v1-feature-button<br/>per FeatureV1"]
```

### 4. `/model-strip` — `model-strip-page`

Dev catalog (no `authGuard`). Body is a vertical **strip** of specimen rows; each row is visual + meta (`render-ref`). Identifiers use `data-specimen`.

| # | Identifier (`data-specimen`) | Kind |
| --- | --- | --- |
| 1 | `font-reference` | face sizing sample |
| 2 | `v1-corporation-render` | corporation HEADER card |
| 3 | `v1-system` | system hierarchy card |
| 4 | `v1-region` | region hierarchy card |
| 5 | `legacy-v2-feature-render` | historical Feature strip |
| 6 | `legacy-v1-feature-button` | Feature button candidate |
| 7 | `v1-public-pilot` | PublicPilot HEADER |
| 8 | `v2-pilot` | PilotV2 HEADER |
| 9 | `v1-blueprint` | BlueprintV1 identity |
| 10 | `v1-blueprint-short` | processed blueprint short |
| 11 | `v1-blueprint-detailed` | processed blueprint detailed |
| 12 | `v1-bomresource` | BOM resource |
| 13 | `v1-bomresource-action` | BOM resource + action |
| 14 | `v1-bomgroup` | BOM group |
| 15 | `v1-application-info-render` | application info |
| 16 | `v1-server-status-render` | server status |

```mermaid
flowchart TB
  page["model-strip-page · /model-strip"]
  page --> strip["strip section<br/>specimen rows top → bottom"]
  strip --> s1["§1 font-reference"]
  strip --> s2["§2 v1-corporation-render"]
  strip --> s3["§3 v1-system"]
  strip --> s4["§4 v1-region"]
  strip --> s5["§5–6 Feature specimens"]
  strip --> s6["§7–8 Pilot specimens"]
  strip --> s7["§9–11 Blueprint specimens"]
  strip --> s8["§12–14 BOM specimens"]
  strip --> s9["§15–16 header renders"]
```

### 5. `/color-table` — `color-table-page`

| # | Identifier | Kind | Notes |
| --- | --- | --- | --- |
| 1 | `header` | `app-page-header` | Variant `-APP-` |
| 2 | `color-table` | page body | Palette groups + swatch rows (`data-palette-key`) |

```mermaid
flowchart TB
  page["color-table-page · /color-table"]
  page --> s1["§1 header<br/>app-page-header · -APP-"]
  s1 --> app["v1-application-info-render"]
  s1 --> srv["v1-server-status-render"]
  page --> s2["§2 color-table<br/>cy-section-name=color-table"]
  s2 --> groups["palette groups → swatch-row"]
```

### 6. `/industry` — `industry-home-page`

| # | Identifier | Kind | Notes |
| --- | --- | --- | --- |
| 1 | `header` | `app-page-header` | Variant `-APP-` |
| 2 | `industry-home` | section body | Title + link to manufacture |

```mermaid
flowchart TB
  page["industry-home-page · /industry"]
  page --> s1["§1 header<br/>app-page-header · -APP-"]
  page --> s2["§2 industry-home<br/>cy-section-name=industry-home"]
  s2 --> link["routerLink → manufacture"]
```

### 7. `/industry/manufacture` — `manufacture-home-page`

| # | Identifier | Kind | Notes |
| --- | --- | --- | --- |
| 1 | `header` | `app-page-header` | Variant `-APP-` |
| 2 | `manufacture-home` | section body | Hosts available-blueprints panel |
| 3 | `available-blueprints-panel` | panel | Selector `available-blueprints-panel` |

```mermaid
flowchart TB
  page["manufacture-home-page · /industry/manufacture"]
  page --> s1["§1 header<br/>app-page-header · -APP-"]
  page --> s2["§2 manufacture-home<br/>cy-section-name=manufacture-home"]
  s2 --> p1["§3 available-blueprints-panel<br/>panel-white"]
```

### 8. `/industry/manufacture/blueprints` — `v1-blueprint-by-location-page`

| # | Identifier | Kind | Notes |
| --- | --- | --- | --- |
| 1 | `header` | `app-page-header` | Variant `-APP-` (no authGuard on this route) |
| 2 | `v1-blueprint-by-location` | page section | Title + lead |
| 3 | `blueprint-regions-panel` | host panel | Region → System → Blueprint hierarchy |

```mermaid
flowchart TB
  page["v1-blueprint-by-location-page<br/>/industry/manufacture/blueprints"]
  page --> s1["§1 header<br/>app-page-header · -APP-"]
  page --> s2["§2 v1-blueprint-by-location<br/>cy-section-name=v1-blueprint-by-location"]
  s2 --> p1["§3 blueprint-regions-panel"]
  p1 --> region["v1-region-render"]
  region --> system["v1-system-render"]
  system --> bp["v1-blueprint-render"]
```
