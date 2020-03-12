import { Injectable, NgZone } from '@angular/core';
import { auth } from 'firebase/app'
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFireDatabase } from '@angular/fire/database'

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';

import { IUserBase, IUsersResponse, IUserResponse, IUserSearchRequest } from '@app/core/models/user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private db: AngularFireDatabase
  ) {

  }

  public loadUsers() {
    return this.db.list('/users');
  }

  public getTotalUsers() {
    return this.db.object('users');
  }


}
