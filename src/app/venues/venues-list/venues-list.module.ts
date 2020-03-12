import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { VenueCreateModule } from '@app/venues/shared/venue-create/venue-create.module';
import { VenueDeleteModule } from '@app/venues/shared/venue-delete/venue-delete.module';
import { VenueUpdateModule } from '@app/venues/shared/venue-update/venue-update.module';
import { VenueSettingModule } from '../shared/venue-setting/venue-setting.module';

import { VenuesListRouting } from '@app/venues/venues-list/venues-list.routing';
import { VenuesListComponent } from '@app/venues/venues-list/venues-list.component';

@NgModule({
  imports: [
    SharedModule,
    VenueCreateModule,
    VenueDeleteModule,
    VenueUpdateModule,
    VenueSettingModule,
    VenuesListRouting
  ],
  declarations: [
    VenuesListComponent
  ]
})
export class VenuesListModule { }
