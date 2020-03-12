import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CitiesComponent } from '@app/cities/cities.component';

const routes: Routes = [{
  path: '',
  component: CitiesComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CitiesRouting { }
