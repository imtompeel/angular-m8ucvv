import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { VenueSettingComponent } from './venue-setting.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    VenueSettingComponent
  ],
  exports: [
    VenueSettingComponent
  ],
  entryComponents: [
    VenueSettingComponent
  ]
})
export class VenueSettingModule { }
