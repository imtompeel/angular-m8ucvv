import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { RecordsRouting } from './records.routing';
import { RecordsComponent } from './records.component';

@NgModule({
  imports: [
    SharedModule,
    RecordsRouting
  ],
  declarations: [
    RecordsComponent
  ]
})
export class RecordsModule { }
