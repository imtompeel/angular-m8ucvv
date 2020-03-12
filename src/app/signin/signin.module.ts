import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { SigninRoutingModule } from '@app/signin/signin.routing';
import { SigninComponent } from '@app/signin/signin.component';

import { FormSigninComponent } from '@app/signin/components/form-signin/form-signin.component';
import { CoreModule } from '@app/core/core.module';
import { AuthService } from '@app/core/services/auth.service';

@NgModule({
  imports: [
    SharedModule,
    SigninRoutingModule,
  ],
  declarations: [
    SigninComponent,
    FormSigninComponent,
  ],
  providers: [
    AuthService
  ]
})
export class SigninModule { }
