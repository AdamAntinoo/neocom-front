import { NgModule } from '@angular/core';
import { AuthService } from './auth.service';
import { PilotService } from './pilot.service';

@NgModule({
  providers: [PilotService, AuthService],
})
export class ServicesModule {}
