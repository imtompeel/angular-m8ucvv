import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploaderComponent } from '@app/shared/uploader/uploader.component';
import { AvatarModule } from '@app/shared/avatar/avatar.module';

@NgModule({
  imports: [
    CommonModule,
    AvatarModule
  ],
  declarations: [
    UploaderComponent
  ],
  exports: [
    UploaderComponent
  ]
})
export class UploaderModule { }
