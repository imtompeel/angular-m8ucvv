import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VenuesComponent } from '@app/venues/venues.component';

const routes: Routes = [{
  path: '',
  component: VenuesComponent,
  children: [{
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  }, {
    path: 'list',
    loadChildren: '@app/venues/venues-list/venues-list.module#VenuesListModule'
  }/*, {
    path: 'detail/:id',
    loadChildren: '@app/room/room-detail/room-detail.module#RoomDetailModule'
  }*/]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VenuesRouting { }
