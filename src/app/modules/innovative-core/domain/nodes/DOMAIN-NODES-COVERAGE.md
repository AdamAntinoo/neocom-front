# Front domain NeoCom node unit-test review (CICD-F-050)

Reviewed 2026-11-11 under `front-cicd` apply.

| Node | Spec | Status |
| --- | --- | --- |
| `PublicPilotV1Node` / `PilotV2Node` | `pilot-nodes.spec.ts` | covered |
| `ApplicationInfoV1Node` | `domain-nodes.spec.ts` | covered |
| `ServerStatusV1Node` | `domain-nodes.spec.ts` | covered |
| `PublicCorporationV1Node` | `domain-nodes.spec.ts` | covered |
| `FeatureV1Node` | `domain-nodes.spec.ts` | covered |
| `SpaceLocationNodeV1` | `domain-nodes.spec.ts` | covered |
| `BlueprintV1Node` | `domain-nodes.spec.ts` | covered |
| `RegionV1Node` | `domain-nodes.spec.ts` | covered |
| `SolarSystemV1Node` | `domain-nodes.spec.ts` | covered |
| `EveAssetV1Node` | `domain-nodes.spec.ts` | covered |
| `LocatedAssetContainerV1Node` | `domain-nodes.spec.ts` | covered |
| `UnidentifiedLocationV1Node` | `domain-nodes.spec.ts` | covered |

Policy (CICD-F-052 / F-053): new nodes ship with co-located `*.spec.ts` (or this folder’s shared suite) in the same delivery; standard `npm run test:tdd` / CI unit job runs them.
