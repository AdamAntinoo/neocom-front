import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

/** Strip comparison specimen from infinity `v2-feature-render` (candidate A). */
export type FeatureSpecimen = {
  label: string;
  enabled?: boolean;
  active?: boolean;
  interaction?: 'PAGEROUTE' | 'DIALOG';
  modifier?: string;
  route?: string;
  imageRef?: string;
};

@Component({
  selector: 'legacy-v2-feature-render',
  imports: [NgClass],
  templateUrl: './legacy-v2-feature-render.component.html',
  styleUrl: './legacy-v2-feature-render.component.scss',
})
export class LegacyV2FeatureRenderComponent {
  @Input({ required: true }) node!: FeatureSpecimen;

  isMarkVisible(): boolean {
    if (this.node.interaction === 'DIALOG') return true;
    if (this.node.modifier === 'DROP') return true;
    return false;
  }
}
