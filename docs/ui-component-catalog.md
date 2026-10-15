# UI component catalog

Cypress catalog attributes mark pages, panels, and fields so acceptance tests and this registry can find the same elements. When a component is added or its tags change, update this file in the same change.

## Attributes

| Attribute | Use |
| --- | --- |
| `cy-section-name` | Names a layout region or an empty component shell |
| `cy-field-label` | Names a field caption |
| `cy-field-value` | Names the value shown for a field |

Pages live in `src/app/pages`. Panels live in `src/app/panels`.

## Start page

`DashboardHomePageComponent` (`dashboard-home-page`) is the application start page.

| URL | Behaviour |
| --- | --- |
| `/` | Redirects to `/dashboard` |
| `/dashboard` | Renders the dashboard home page |

| Region | `cy-section-name` | Hosted components |
| --- | --- | --- |
| Header row | `header` | `app-info-panel` (`#appinfo-panel`), `server-info-panel` (`#server-info-panel`) |
| Exception | `exception` | Shown only when the page has an exception |
| Pilot dashboard | `pilot-dashboard` | `v1-pilot-panel` |

Exception fields, present on the exception region:

| `cy-field-label` | `cy-field-value` |
| --- | --- |
| `exceptionTitle` | `exceptionTitle` |
| `exceptionMessage` | `exceptionMessage` |

## Panels

`app-info-panel` shows the application name, version, and copyright from `environment`. `server-info-panel` lists a sample line for each font the application names. `v1-pilot-panel` shows the public character name when a `character` value is set.

| Component | Selector | Path | Catalog tag |
| --- | --- | --- | --- |
| `AppInfoPanelComponent` | `app-info-panel` | `src/app/panels/app-info-panel` | `cy-section-name="app-info"` |
| `ServerInfoPanelComponent` | `server-info-panel` | `src/app/panels/server-info-panel` | `cy-section-name="server-info"` |
| `V1PilotPanelComponent` | `v1-pilot-panel` | `src/app/panels/v1-pilot-panel` | `cy-section-name="pilot"` |

Application identity fields on `app-info-panel`:

| `cy-field-value` | Source | Font |
| --- | --- | --- |
| `app-name` | `environment.appName`, shown in uppercase | Elemental |
| `app-version` | `environment.appVersion` | Elemental |
| `app-copyright` | `environment.copyright` | Open Sans |

Font samples on `server-info-panel` use `cy-field-value` set to the font id (`open-sans`, `open-sans-condensed`, `proxima-nova`, `proxima-nova-black`, `elemental`, `conthrax`, `tesla`, `mons-olympia`, `imaki`, `din-1451`, `zekton`, `prototype`, `the-expanse`). Faces are self-hosted in `public/assets/fonts` and declared in `src/styles/fonts.scss`. Proxima Nova and Proxima Nova Black both use `ProximaNovaAltBlack.ttf`, which is preloaded at startup. The regular, thin, semibold, and bold Proxima cuts are not in the asset folder. Open Sans and Open Sans Condensed are the local Open Sans files. [Elemental End](https://www.fontspace.com/elementalend-font-f10197) (regular and italic) is also local. The app name panel (`app-name-panel`) and the version (`.app-version`) use Elemental End. That face is [CC BY-NC-ND 3.0](https://creativecommons.org/licenses/by-nc-nd/3.0/) by Zdeněk Gromnica: non-commercial use, with attribution, and no modifications.

`v1-pilot-panel` accepts an `identifier` input and a `character` input typed as `GetCharactersCharacterIdOk` from `neocom-domain`. The start page binds `getPilotId()`, which is unset until a session exists. When `character` is set, its name is shown as `cy-field-value="pilot-name"`.
