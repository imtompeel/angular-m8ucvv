import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { CityDeleteComponent } from './city-delete.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    CityDeleteComponent
  ],
  exports: [
    CityDeleteComponent
  ],
  entryComponents: [
    CityDeleteComponent
  ]
})
export class CityDeleteModule { }
