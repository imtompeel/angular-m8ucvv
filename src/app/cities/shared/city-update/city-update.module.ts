import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { CityUpdateComponent } from './city-update.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    CityUpdateComponent
  ],
  exports: [
    CityUpdateComponent
  ],
  entryComponents: [
    CityUpdateComponent
  ]
})
export class CityUpdateModule { }
