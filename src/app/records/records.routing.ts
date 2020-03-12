import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordsComponent } from './records.component';

const routes: Routes = [{
  path: '',
  component: RecordsComponent,
  children: [{
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  }, {
    path: 'list',
    loadChildren: './records-list/records-list.module#RecordsListModule'
  }/*, {
    path: 'detail/:id',
    loadChildren: '@app/room/room-detail/room-detail.module#RoomDetailModule'
  }*/]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecordsRouting { }
