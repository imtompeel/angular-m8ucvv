import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { VenueDeleteComponent } from '@app/venues/shared/venue-delete/venue-delete.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    VenueDeleteComponent
  ],
  exports: [
    VenueDeleteComponent
  ],
  entryComponents: [
    VenueDeleteComponent
  ]
})
export class VenueDeleteModule { }
