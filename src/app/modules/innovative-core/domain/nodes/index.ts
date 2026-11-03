export { ApplicationInfoV1Node } from './application-info-v1.node';
export { BlueprintV1Node } from './blueprint-v1.node';
export { PilotV2Node } from './pilot-v2.node';
export { PublicCorporationV1Node } from './public-corporation-v1.node';
export { FeatureV1Node } from './feature-v1.node';
export type { FeatureV1Wire } from './feature-v1.node';
export { PublicPilotV1Node } from './public-pilot-v1.node';
export { ServerStatusV1Node } from './server-status-v1.node';

import { PilotV2, PublicPilotV1 } from 'neocom-domain';
import { PilotV2Node } from './pilot-v2.node';
import { PublicPilotV1Node } from './public-pilot-v1.node';

/** Map a back pilot JSON / Record into the matching NeoCom render node. */
export function pilotNodeFromWire(raw: object): PublicPilotV1Node | PilotV2Node {
  const jsonClass = (raw as { jsonClass?: string }).jsonClass;
  if (jsonClass === 'PilotV2' || raw instanceof PilotV2) {
    return PilotV2Node.from(raw instanceof PilotV2 ? raw : new PilotV2(raw));
  }
  return PublicPilotV1Node.from(raw instanceof PublicPilotV1 ? raw : new PublicPilotV1(raw));
}
