import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { RecordDeleteComponent } from './record-delete.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    RecordDeleteComponent
  ],
  exports: [
    RecordDeleteComponent
  ],
  entryComponents: [
    RecordDeleteComponent
  ]
})
export class RecordDeleteModule { }
