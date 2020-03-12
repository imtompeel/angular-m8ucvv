import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService } from '@app/core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  /**
   * Creates an instance of RoleGuard.
   *
   * @param {AuthService} authService
   * @memberof RoleGuard
   */
  constructor(
    private authService: AuthService
  ) {}

  /**
   * Can activate
   *
   * @param {ActivatedRouteSnapshot} next
   * @param {RouterStateSnapshot} state
   * @returns {(Observable<boolean> | Promise<boolean> | boolean)}
   * @memberof RoleGuard
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const roles = next.data['roles'] as Array<string>;

    return true; // (roles == null || roles.indexOf(this.authService.decodeJwt().type) !== -1);
  }

}
