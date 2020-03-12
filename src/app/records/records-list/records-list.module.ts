import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { RecordsListRouting } from '@app/records/records-list/records-list.routing';
import { RecordsListComponent } from '@app/records/records-list/records-list.component';
import { RecordCreateModule } from '../shared/record-create/record-create.module';
import { RecordUpdateModule } from '../shared/record-update/record-update.module';
import { RecordDeleteModule } from '../shared/record-delete/record-delete.module';

@NgModule({
  imports: [
    SharedModule,
    RecordCreateModule,
    RecordUpdateModule,
    RecordDeleteModule,
    RecordsListRouting
  ],
  declarations: [
    RecordsListComponent
  ]
})
export class RecordsListModule { }
