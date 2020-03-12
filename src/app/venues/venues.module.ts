import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { VenuesRouting } from '@app/venues/venues.routing';
import { VenuesComponent } from '@app/venues/venues.component';

@NgModule({
  imports: [
    SharedModule,
    VenuesRouting
  ],
  declarations: [
    VenuesComponent
  ]
})
export class VenuesModule { }
