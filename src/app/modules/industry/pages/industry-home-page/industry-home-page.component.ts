import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderModule } from '../../../header/header.module';

@Component({
  selector: 'industry-home-page',
  imports: [HeaderModule, RouterLink],
  templateUrl: './industry-home-page.component.html',
  styleUrl: './industry-home-page.component.scss',
  host: { class: 'neo-page' },
})
export class IndustryHomePageComponent {}
