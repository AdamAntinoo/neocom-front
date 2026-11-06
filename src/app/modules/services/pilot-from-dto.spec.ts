import { PilotV2, PublicPilotV1 } from 'neocom-domain';
import {
  isAuthenticatedPilotDto,
  pilotFromDto,
  publicPilotFromDto,
  pilotV2FromDto,
  type PilotWire,
} from './pilot-from-dto';

const publicDto: PilotWire = {
  jsonClass: 'PublicPilotV1',
  pilotId: 93813310,
  name: 'Perico Tuerto',
};

const v2Dto: PilotWire = {
  jsonClass: 'PilotV2',
  pilotId: 93813310,
  name: 'Perico Tuerto',
  totalSkillpoints: 12,
  walletBalance: 34,
  currentShipName: 'Venture',
};

describe('pilot-from-dto (DOM-JSONCLASS-002)', () => {
  it('selects PilotV2 from jsonClass even without guessing from private fields alone', () => {
    expect(isAuthenticatedPilotDto(v2Dto)).toBe(true);
    const node = pilotFromDto(v2Dto);
    expect(node).toBeInstanceOf(PilotV2);
    expect(node.getJsonClass()).toBe('PilotV2');
  });

  it('selects PublicPilotV1 from jsonClass even when private fields are present', () => {
    const conflicting: PilotWire = { ...v2Dto, jsonClass: 'PublicPilotV1' };
    expect(isAuthenticatedPilotDto(conflicting)).toBe(false);
    const node = pilotFromDto(conflicting);
    expect(node).toBeInstanceOf(PublicPilotV1);
    expect(node.getJsonClass()).toBe('PublicPilotV1');
  });

  it('maps public and authenticated builders', () => {
    expect(publicPilotFromDto(publicDto)).toBeInstanceOf(PublicPilotV1);
    expect(pilotV2FromDto(v2Dto).getTotalSkillpoints()).toBe(12);
  });
});
