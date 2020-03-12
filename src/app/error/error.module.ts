import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { ErrorRoutingModule } from '@app/error/error.routing';
import { ErrorComponent } from '@app/error/error.component';

@NgModule({
  imports: [
    SharedModule,
    ErrorRoutingModule
  ],
  declarations: [
    ErrorComponent
  ],
  exports: [
    ErrorComponent
  ]
})
export class ErrorModule { }
