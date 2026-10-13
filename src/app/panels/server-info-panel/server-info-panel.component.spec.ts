import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServerInfoPanelComponent } from './server-info-panel.component';

describe('ServerInfoPanelComponent', () => {
  let fixture: ComponentFixture<ServerInfoPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServerInfoPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ServerInfoPanelComponent);
    fixture.detectChanges();
  });

  it('should show a sample line for each known font', () => {
    const root = fixture.nativeElement as HTMLElement;
    const samples = [...root.querySelectorAll('.font-sample')];
    expect(root.querySelector('[cy-section-name="server-info"]')).toBeTruthy();
    expect(samples.map((sample) => sample.getAttribute('cy-field-value'))).toEqual([
      'open-sans',
      'open-sans-condensed',
      'proxima-nova',
      'proxima-nova-black',
      'elemental',
      'conthrax',
      'tesla',
      'mons-olympia',
      'imaki',
      'din-1451',
      'zekton',
      'prototype',
      'the-expanse',
    ]);
    expect(samples[0]?.textContent).toContain('Open Sans — NeoCom 0123456789');
    expect(samples[4]?.textContent).toContain('Elemental — NeoCom 0123456789');
  });
});
