import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertComponent } from '@app/shared/alert/alert.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    AlertComponent
  ],
  exports: [
    AlertComponent
  ]
})
export class AlertModule { }
