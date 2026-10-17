# Angular structure — placement rules

Source: OpenSpec `front-angular-structure` (STRUCT-001 … STRUCT-007).

## Definitions

| Term | Meaning |
| --- | --- |
| **Page** | Routed screen |
| **Panel** | Piece of a page; no route of its own |
| **Section** | Angular module under `app/modules` that owns that section’s pages and panels |

Root router loads a section with `loadChildren`. The section registers routes with `RouterModule.forChild`.

## Where to put new code

| Kind | Location |
| --- | --- |
| Core shell screen | `app/pages` |
| Panel used only by core pages | `app/panels` |
| Panel used on core **and** other pages | `modules/header` (declare + export) |
| Section screen | That section’s `pages/` folder |
| Section-specific panel | Beside it under that section’s `panels/` |

## Shell routes (`app/pages`)

| Path | Page | Guard |
| --- | --- | --- |
| `login` | `login-page` | — |
| `login-callback` | `login-callback-page` | — |
| `dashboard` | `dashboard-home-page` | `authGuard` |
| `` (empty) | redirect → `dashboard` | — |

## Sections in scope

| Section | Module | Root path |
| --- | --- | --- |
| Industry | `modules/industry` | `industry` |
| Manufacture | `modules/industry/manufacture` | `industry/manufacture` |

Planetary, loyalty, fittings, and later sections stay deferred.

## Support modules (no root route)

`header`, `shared`, `renders`, `common`, `innovative-core` supply pieces to pages. They are not application sections and must not own a root `loadChildren` route.
