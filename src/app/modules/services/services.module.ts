import { NgModule } from '@angular/core';
import { AuthService } from './auth.service';
import { PilotService } from './pilot.service';
import { PublicCorporationService } from './public-corporation.service';

@NgModule({
  providers: [PilotService, AuthService, PublicCorporationService],
})
export class ServicesModule {}
