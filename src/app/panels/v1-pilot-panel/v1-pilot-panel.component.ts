import { Component, input } from '@angular/core';

@Component({
  selector: 'v1-pilot-panel',
  templateUrl: './v1-pilot-panel.component.html',
  styleUrl: './v1-pilot-panel.component.scss',
})
export class V1PilotPanelComponent {
  readonly identifier = input<number | undefined>();
}
