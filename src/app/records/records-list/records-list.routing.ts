import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordsListComponent } from '@app/records/records-list/records-list.component';

const routes: Routes = [{
  path: '',
  component: RecordsListComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecordsListRouting { }
