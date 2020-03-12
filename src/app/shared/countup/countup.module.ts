import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountupDirective } from '@app/shared/countup/countup.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CountupDirective
  ],
  exports: [
    CountupDirective
  ]
})
export class CountupModule { }
