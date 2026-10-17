# Node / render MVC

Source: OpenSpec `front-node-render` (NODE-001 … NODE-017).

| Role | Responsibility |
| --- | --- |
| **Business object / node** | Model — `NeoCom` / `NeoComDelayed`; exposes getters for the UI |
| **Render** | View — Angular component template registered by `jsonClass` |
| **Part** | Controller — chooses the render (registry) and calls node methods |

Hierarchy flattens via `collaborate2View` → `AppPanelComponent.notifyDataChanged` → `nodes2render`. The viewer iterates that list only; the container resolves renders from the registry (`NgComponentOutlet`), not `*ngIf` class maps.
