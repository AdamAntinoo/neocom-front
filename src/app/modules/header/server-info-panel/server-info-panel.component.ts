import { Component } from '@angular/core';

export interface AppFontSample {
  id: string;
  className: string;
  label: string;
}

@Component({
  selector: 'server-info-panel',
  templateUrl: './server-info-panel.component.html',
  styleUrl: './server-info-panel.component.scss',
})
export class ServerInfoPanelComponent {
  /** Faces named by the application, plus the families shipped in the font assets. */
  readonly fonts: AppFontSample[] = [
    { id: 'open-sans', className: 'opensans-ff', label: 'Open Sans' },
    { id: 'open-sans-condensed', className: 'opensans-condensed-ff', label: 'Open Sans Condensed' },
    { id: 'proxima-nova', className: 'proxima-ff', label: 'Proxima Nova' },
    { id: 'proxima-nova-black', className: 'proxima-black-ff', label: 'Proxima Nova Black' },
    { id: 'elemental', className: 'elemental-ff', label: 'Elemental' },
    { id: 'conthrax', className: 'contrax-ff', label: 'Conthrax' },
    { id: 'tesla', className: 'tesla-ff', label: 'Tesla' },
    { id: 'mons-olympia', className: 'mons-olympia-ff', label: 'Mons Olympia' },
    { id: 'imaki', className: 'imaki-ff', label: 'Imaki' },
    { id: 'din-1451', className: 'din-1451-ff', label: 'Din-1451' },
    { id: 'zekton', className: 'zekton-ff', label: 'Zekton' },
    { id: 'prototype', className: 'prototype-ff', label: 'Prototype' },
    { id: 'the-expanse', className: 'expanse-ff', label: 'The Expanse' },
  ];
}
