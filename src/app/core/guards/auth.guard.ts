import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { auth } from 'firebase/app'
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFireDatabase } from '@angular/fire/database'

import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  /**
   * Creates an instance of AuthGuard.
   *
   * @param {Router} router
   * @param {AuthService} authService
   * @memberof AuthGuard
   */
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  /**
   * Can activate
   *
   * @param {ActivatedRouteSnapshot} next
   * @param {RouterStateSnapshot} state
   * @returns {(Observable<boolean> | Promise<boolean> | boolean)}
   * @memberof AuthGuard
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isAdmin().pipe(
      take(1),
      tap(isAdmin => {
        if (!isAdmin) {
          this.router.navigateByUrl('signin');
          this.authService.signOut();
        }
      })
    );
  }

}
