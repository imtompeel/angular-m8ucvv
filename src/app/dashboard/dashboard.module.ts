import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { DashboardRouting } from '@app/dashboard/dashboard.routing';
import { DashboardComponent } from '@app/dashboard/dashboard.component';

import { ChartTopClassComponent } from '@app/dashboard/components/chart-top-class/chart-top-class.component';

@NgModule({
  imports: [
    SharedModule,
    DashboardRouting
  ],
  declarations: [
    DashboardComponent,
    ChartTopClassComponent
  ]
})
export class DashboardModule { }
