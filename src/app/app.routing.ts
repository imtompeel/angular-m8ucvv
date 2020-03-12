import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutAccountComponent } from '@app/core/layouts/account/account.component';
import { LayoutDashboardComponent } from '@app/core/layouts/dashboard/dashboard.component';

import { AuthGuard } from '@app/core/guards/auth.guard';
import { RoleGuard } from '@app/core/guards/role.guard';

const routes: Routes = [{
  path: '',
  pathMatch: 'full',
  redirectTo: 'signin'
}, {
  path: '',
  component: LayoutAccountComponent,
  children: [{
    path: 'signin',
    loadChildren: '@app/signin/signin.module#SigninModule'
  }]
}, {
  path: '',
  component: LayoutDashboardComponent,
  canActivate: [AuthGuard],
  children: [{
    path: 'error',
    loadChildren: '@app/error/error.module#ErrorModule'
  }, 
// Overhear
  {
    path: 'cities',
    loadChildren: '@app/cities/cities.module#CitiesModule',
    canActivate: [AuthGuard, RoleGuard],
    data: {
      roles: ['super-admin']
    }
  }, {
    path: 'venues',
    loadChildren: '@app/venues/venues.module#VenuesModule',
    canActivate: [AuthGuard, RoleGuard],
    data: {
      roles: ['super-admin']
    },
    runGuardsAndResolvers: 'always',
  }, {
    path: 'records',
    loadChildren: '@app/records/records.module#RecordsModule',
    canActivate: [AuthGuard, RoleGuard],
    data: {
      roles: ['super-admin']
    },
    runGuardsAndResolvers: 'always',
  }, {
    path: 'users',
    loadChildren: '@app/users/users.module#UsersModule',
    canActivate: [AuthGuard, RoleGuard],
    data: {
      roles: ['super-admin']
    },
    runGuardsAndResolvers: 'always',
  }]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
