import type { Type } from '@angular/core';

/**
 * Maps jsonClass → render component Type.
 * Replaces hard-coded *ngIf class maps in the node container (NODE-002, NODE-010).
 */
const registry = new Map<string, Type<unknown>>();

export function registerRender(jsonClass: string, component: Type<unknown>): void {
  registry.set(jsonClass, component);
}

export function lookupRender(jsonClass: string): Type<unknown> | undefined {
  return registry.get(jsonClass);
}

export function clearRenderRegistry(): void {
  registry.clear();
}
