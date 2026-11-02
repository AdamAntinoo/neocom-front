import { PilotV2, PublicPilotV1 } from 'neocom-domain';
import { PilotV2Node } from './pilot-v2.node';
import { PublicPilotV1Node, pilotNodeFromWire } from './index';

describe('Pilot NeoCom nodes (PILOT-007)', () => {
  it('wraps PublicPilotV1 wire fields for panel/render accessors', () => {
    const node = PublicPilotV1Node.from(
      new PublicPilotV1({
        pilotId: 93813310,
        name: 'Perico Tuerto',
        birthday: '2013-09-09T19:40:09Z',
        gender: 'male',
        securityStatus: 0,
        corporation: { corporationId: 1000077, name: 'Corp', ticker: 'CRP' },
        raceData: { name: 'Caldari' },
        ancestryData: { name: 'Merchandisers' },
        bloodlineData: { name: 'Deteis' },
      }),
    );

    expect(node).toBeInstanceOf(PublicPilotV1Node);
    expect(node.getJsonClass()).toBe('PublicPilotV1');
    expect(node.getPilotId()).toBe(93813310);
    expect(node.getName()).toBe('Perico Tuerto');
    expect(node.getBirthday()).toBe('2013-09-09T19:40:09Z');
    expect(node.getGenderDisplay()).toBe('MALE');
    expect(node.getAncestryLine()).toBe('Caldari - Merchandisers - Deteis');
    expect(node.getRecord()).toBeInstanceOf(PublicPilotV1);
  });

  it('maps PilotV2 wire JSON through pilotNodeFromWire', () => {
    const node = pilotNodeFromWire({
      jsonClass: 'PilotV2',
      pilotId: 93813310,
      name: 'Perico Tuerto',
      totalSkillpoints: 12,
      walletBalance: 34,
      currentShipName: 'Venture',
    });

    expect(node).toBeInstanceOf(PilotV2Node);
    expect(node.getJsonClass()).toBe('PilotV2');
    expect((node as PilotV2Node).getTotalSkillpoints()).toBe(12);
    expect((node as PilotV2Node).getWalletBalance()).toBe(34);
    expect((node as PilotV2Node).getRecord()).toBeInstanceOf(PilotV2);
  });
});
