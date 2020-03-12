import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { PopoverModule } from 'ngx-bootstrap/popover';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AvatarModule } from '@app/shared/avatar/avatar.module';
import { SpinnerModule } from '@app/shared/spinner/spinner.module';
import { AlertModule } from '@app/shared/alert/alert.module';
import { CountupModule } from '@app/shared/countup/countup.module';
import { UploaderModule } from '@app/shared/uploader/uploader.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    TimepickerModule.forRoot(),
    ButtonsModule.forRoot(),
    PopoverModule.forRoot(),

    NgSelectModule,
    NgxDatatableModule,

    AlertModule,
    AvatarModule,
    CountupModule,
    SpinnerModule,
    UploaderModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    NgSelectModule,
    NgxDatatableModule,
    BsDropdownModule,
    BsDatepickerModule,
    ButtonsModule,
    PopoverModule,

    TimepickerModule,
    ModalModule,

    AlertModule,
    AvatarModule,
    CountupModule,
    SpinnerModule,
    UploaderModule
  ]
})
export class SharedModule { }
