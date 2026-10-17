import { describe, expect, it } from 'vitest';
import { NeoCom } from './NeoCom';

describe('NeoCom.collaborate2View', () => {
  it('omits invisible nodes', () => {
    const root = new NeoCom({ jsonClass: 'NeoCom' });
    root.setVisible(false);
    expect(root.collaborate2View()).toEqual([]);
  });

  it('returns self only when collapsed', () => {
    const root = new NeoCom({ jsonClass: 'Parent' });
    root.addChild(new NeoCom({ jsonClass: 'Child' }));
    expect(root.collaborate2View()).toHaveLength(1);
    expect(root.collaborate2View()[0]).toBe(root);
  });

  it('includes children when expanded', () => {
    const root = new NeoCom({ jsonClass: 'Parent' });
    const child = new NeoCom({ jsonClass: 'Child' });
    root.addChild(child);
    root.expand();
    const list = root.collaborate2View();
    expect(list).toHaveLength(2);
    expect(list[1]).toBe(child);
  });
});
