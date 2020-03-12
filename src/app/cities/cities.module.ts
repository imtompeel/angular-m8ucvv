import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { CitiesRouting } from './cities.routing';
import { CitiesComponent } from './cities.component';
import { CityCreateModule } from './shared/city-create/city-create.module';
import { CityUpdateModule } from './shared/city-update/city-update.module';
import { CityDeleteModule } from './shared/city-delete/city-delete.module';

@NgModule({
  imports: [
    SharedModule,
    CitiesRouting,
    CityCreateModule,
    CityUpdateModule,
    CityDeleteModule
  ],
  declarations: [
    CitiesComponent
  ]
})
export class CitiesModule { }
