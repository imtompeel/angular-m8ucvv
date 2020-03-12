import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { UsersRouting } from './users.routing';
import { UsersComponent } from './users.component';

@NgModule({
  imports: [
    SharedModule,
    UsersRouting
  ],
  declarations: [
    UsersComponent
  ]
})
export class UsersModule { }
