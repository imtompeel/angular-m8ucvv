import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { RecordUpdateComponent } from './record-update.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    RecordUpdateComponent
  ],
  exports: [
    RecordUpdateComponent
  ],
  entryComponents: [
    RecordUpdateComponent
  ]
})
export class RecordUpdateModule { }
