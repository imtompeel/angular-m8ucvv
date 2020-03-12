import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { CityCreateComponent } from './city-create.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    CityCreateComponent
  ],
  exports: [
    CityCreateComponent
  ],
  entryComponents: [
    CityCreateComponent
  ]
})
export class CityCreateModule { }
