import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { VenueCreateComponent } from '@app/venues/shared/venue-create/venue-create.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    VenueCreateComponent
  ],
  exports: [
    VenueCreateComponent
  ],
  entryComponents: [
    VenueCreateComponent
  ]
})
export class VenueCreateModule { }
