import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { VenueUpdateComponent } from '@app/venues/shared/venue-update/venue-update.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    VenueUpdateComponent
  ],
  exports: [
    VenueUpdateComponent
  ],
  entryComponents: [
    VenueUpdateComponent
  ]
})
export class VenueUpdateModule { }
