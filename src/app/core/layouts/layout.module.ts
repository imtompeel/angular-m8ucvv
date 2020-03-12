import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { LayoutAccountComponent } from '@app/core/layouts/account/account.component';
import { LayoutDashboardComponent } from '@app/core/layouts/dashboard/dashboard.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule
  ],
  declarations: [
    LayoutAccountComponent,
    LayoutDashboardComponent
  ],
  exports: [
    LayoutAccountComponent,
    LayoutDashboardComponent
  ],
})
export class LayoutModule { }
