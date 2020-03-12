import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { RecordCreateComponent } from './record-create.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    RecordCreateComponent
  ],
  exports: [
    RecordCreateComponent
  ],
  entryComponents: [
    RecordCreateComponent
  ]
})
export class RecordCreateModule { }
