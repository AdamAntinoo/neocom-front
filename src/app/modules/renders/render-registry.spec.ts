import { describe, expect, it, beforeEach } from 'vitest';
import { clearRenderRegistry, lookupRender, registerRender } from './render-registry';
import { V1BlueprintRenderComponent } from './v1-blueprint-render/v1-blueprint-render.component';

describe('render registry', () => {
  beforeEach(() => {
    clearRenderRegistry();
    V1BlueprintRenderComponent.registered = false;
    V1BlueprintRenderComponent.ensureRegistered();
  });

  it('resolves ProcessedBlueprint without ngIf maps', () => {
    expect(lookupRender('ProcessedBlueprint')).toBe(V1BlueprintRenderComponent);
    expect(lookupRender('ProcessedBlueprintSummary')).toBe(V1BlueprintRenderComponent);
  });

  it('allows registering shared renders for multiple jsonClass values', () => {
    class Shared {}
    registerRender('A', Shared);
    registerRender('B', Shared);
    expect(lookupRender('A')).toBe(Shared);
    expect(lookupRender('B')).toBe(Shared);
  });
});
