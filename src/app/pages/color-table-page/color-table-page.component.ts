import { Component } from '@angular/core';
import { HeaderModule } from '../../modules/header/header.module';

export type PaletteEntry = {
  /** Palette key in `_palette.scss` `$neo-colors`. */
  key: string;
  /** CSS custom property name. */
  cssVar: string;
  /** Hex from the palette map (documentation / copy). */
  hex: string;
  group: string;
};

/**
 * Support page: application colour table.
 * Samples every key currently in `src/styles/_palette.scss` `$neo-colors`.
 * Route `/color-table` — no auth (dev support, same class as `/model-strip`).
 */
@Component({
  selector: 'color-table-page',
  imports: [HeaderModule],
  templateUrl: './color-table-page.component.html',
  styleUrl: './color-table-page.component.scss',
  host: { class: 'neo-page' },
})
export class ColorTablePageComponent {
  /** Keep in sync with `$neo-colors` in `src/styles/_palette.scss`. */
  protected readonly colours: PaletteEntry[] = [
    { group: 'app', key: 'app-red-70', cssVar: '--neo-color-app-red-70', hex: '#ff6666' },
    { group: 'app', key: 'app-red-30', cssVar: '--neo-color-app-red-30', hex: '#990000' },
    { group: 'app', key: 'app-pale-red', cssVar: '--neo-color-app-pale-red', hex: '#990000' },
    { group: 'panel', key: 'panel-red', cssVar: '--neo-color-panel-red', hex: '#ff0000' },
    { group: 'panel', key: 'panel-red-90', cssVar: '--neo-color-panel-red-90', hex: '#ffcccc' },
    { group: 'panel', key: 'panel-red-10', cssVar: '--neo-color-panel-red-10', hex: '#330000' },
    { group: 'panel', key: 'panel-pink', cssVar: '--neo-color-panel-pink', hex: '#ff00ff' },
    { group: 'panel', key: 'panel-pink-90', cssVar: '--neo-color-panel-pink-90', hex: '#ffccff' },
    { group: 'panel', key: 'panel-pink-10', cssVar: '--neo-color-panel-pink-10', hex: '#660033' },
    { group: 'panel', key: 'panel-orange', cssVar: '--neo-color-panel-orange', hex: '#ff3300' },
    { group: 'panel', key: 'panel-orange-90', cssVar: '--neo-color-panel-orange-90', hex: '#ffd6cc' },
    { group: 'panel', key: 'panel-orange-20', cssVar: '--neo-color-panel-orange-20', hex: '#661400' },
    { group: 'panel', key: 'panel-orange-10', cssVar: '--neo-color-panel-orange-10', hex: '#300a00' },
    { group: 'panel', key: 'panel-yellow', cssVar: '--neo-color-panel-yellow', hex: '#ffff00' },
    { group: 'panel', key: 'panel-yellow-90', cssVar: '--neo-color-panel-yellow-90', hex: '#ffff99' },
    { group: 'panel', key: 'panel-yellow-20', cssVar: '--neo-color-panel-yellow-20', hex: '#666600' },
    { group: 'panel', key: 'panel-yellow-10', cssVar: '--neo-color-panel-yellow-10', hex: '#333300' },
    { group: 'panel', key: 'panel-lime', cssVar: '--neo-color-panel-lime', hex: '#99ff33' },
    { group: 'panel', key: 'panel-lime-90', cssVar: '--neo-color-panel-lime-90', hex: '#e6ffcc' },
    { group: 'panel', key: 'panel-lime-10', cssVar: '--neo-color-panel-lime-10', hex: '#1a3300' },
    { group: 'panel', key: 'panel-green', cssVar: '--neo-color-panel-green', hex: '#009900' },
    { group: 'panel', key: 'panel-green-90', cssVar: '--neo-color-panel-green-90', hex: '#b3ffb3' },
    { group: 'panel', key: 'panel-green-20', cssVar: '--neo-color-panel-green-20', hex: '#006600' },
    { group: 'panel', key: 'panel-green-10', cssVar: '--neo-color-panel-green-10', hex: '#003300' },
    { group: 'panel', key: 'panel-lightblue', cssVar: '--neo-color-panel-lightblue', hex: '#00ffcc' },
    {
      group: 'panel',
      key: 'panel-lightblue-90',
      cssVar: '--neo-color-panel-lightblue-90',
      hex: '#ccfff5',
    },
    {
      group: 'panel',
      key: 'panel-lightblue-10',
      cssVar: '--neo-color-panel-lightblue-10',
      hex: '#003329',
    },
    { group: 'panel', key: 'panel-blue', cssVar: '--neo-color-panel-blue', hex: '#0066cc' },
    { group: 'panel', key: 'panel-blue-90', cssVar: '--neo-color-panel-blue-90', hex: '#cce6ff' },
    { group: 'panel', key: 'panel-blue-30', cssVar: '--neo-color-panel-blue-30', hex: '#0059b3' },
    { group: 'panel', key: 'panel-blue-20', cssVar: '--neo-color-panel-blue-20', hex: '#003366' },
    { group: 'panel', key: 'panel-blue-10', cssVar: '--neo-color-panel-blue-10', hex: '#001a33' },
    { group: 'panel', key: 'panel-violet', cssVar: '--neo-color-panel-violet', hex: '#cc33ff' },
    { group: 'panel', key: 'panel-violet-90', cssVar: '--neo-color-panel-violet-90', hex: '#f2ccff' },
    { group: 'panel', key: 'panel-violet-10', cssVar: '--neo-color-panel-violet-10', hex: '#4d004d' },
    { group: 'panel', key: 'panel-white', cssVar: '--neo-color-panel-white', hex: '#ffffff' },
    { group: 'panel', key: 'panel-white-90', cssVar: '--neo-color-panel-white-90', hex: '#e6e6e6' },
    { group: 'panel', key: 'panel-white-40', cssVar: '--neo-color-panel-white-40', hex: '#666666' },
    { group: 'panel', key: 'panel-white-20', cssVar: '--neo-color-panel-white-20', hex: '#333333' },
    { group: 'panel', key: 'panel-white-10', cssVar: '--neo-color-panel-white-10', hex: '#1a1a1a' },
    { group: 'panel', key: 'panel-darkgrey', cssVar: '--neo-color-panel-darkgrey', hex: '#808080' },
    {
      group: 'panel',
      key: 'panel-darkgrey-90',
      cssVar: '--neo-color-panel-darkgrey-90',
      hex: '#cccccc',
    },
    {
      group: 'panel',
      key: 'panel-darkgrey-10',
      cssVar: '--neo-color-panel-darkgrey-10',
      hex: '#1a1a1a',
    },
    { group: 'panel', key: 'panel-border', cssVar: '--neo-color-panel-border', hex: '#404040' },
    {
      group: 'panel',
      key: 'panel-background',
      cssVar: '--neo-color-panel-background',
      hex: '#080808',
    },
    {
      group: 'panel',
      key: 'panel-hover-green',
      cssVar: '--neo-color-panel-hover-green',
      hex: '#0b3d03',
    },
    {
      group: 'panel',
      key: 'panel-hover-blue',
      cssVar: '--neo-color-panel-hover-blue',
      hex: '#0b3d03',
    },
    {
      group: 'background',
      key: 'background-tint-red',
      cssVar: '--neo-color-background-tint-red',
      hex: '#250000',
    },
    {
      group: 'background',
      key: 'background-tint-orange',
      cssVar: '--neo-color-background-tint-orange',
      hex: '#301000',
    },
    {
      group: 'background',
      key: 'background-tint-yellow',
      cssVar: '--neo-color-background-tint-yellow',
      hex: '#303000',
    },
    {
      group: 'background',
      key: 'background-tint-blue',
      cssVar: '--neo-color-background-tint-blue',
      hex: '#080825',
    },
    {
      group: 'background',
      key: 'background-tint-green',
      cssVar: '--neo-color-background-tint-green',
      hex: '#052406',
    },
    {
      group: 'background',
      key: 'background-tint-white',
      cssVar: '--neo-color-background-tint-white',
      hex: '#252525',
    },
    {
      group: 'page',
      key: 'page-background',
      cssVar: '--neo-color-page-background',
      hex: '#10141b',
    },
    {
      group: 'page',
      key: 'page-foreground',
      cssVar: '--neo-color-page-foreground',
      hex: '#e8eef7',
    },
    {
      group: 'text',
      key: 'text-expandable-name',
      cssVar: '--neo-color-text-expandable-name',
      hex: '#ffffff',
    },
    {
      group: 'text',
      key: 'text-selectable-name',
      cssVar: '--neo-color-text-selectable-name',
      hex: '#ffa500',
    },
    {
      group: 'text',
      key: 'text-classname',
      cssVar: '--neo-color-text-classname',
      hex: '#3d3de6',
    },
    {
      group: 'text',
      key: 'text-light-orange-85',
      cssVar: '--neo-color-text-light-orange-85',
      hex: '#ffe6b3',
    },
  ];

  protected groups(): string[] {
    return [...new Set(this.colours.map((c) => c.group))];
  }

  protected coloursIn(group: string): PaletteEntry[] {
    return this.colours.filter((c) => c.group === group);
  }
}
