import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFireDatabase } from '@angular/fire/database'

import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CityService } from './city.service';
import { environment } from '@environments/environment';

import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
   * Array of cities
   */
  public cities: Array<any> = [];

  public secondaryApp: firebase.app.App = null
  /**
   * Creates an instance of AuthService.
   *
   */
  constructor(
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    private cityService: CityService,

  ) {
    firebase.apps.forEach(app => {
      if (app.name === 'secondary') {
        this.secondaryApp = app
        return
      }
    })
    if (this.secondaryApp === null) {
      this.secondaryApp = firebase.initializeApp(environment.firebaseConfig, 'secondary');
    }
  }

  /**
   * Sign in
   *
   * @param email : String
   * @param password : String
   */
  public signIn(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  public signUp(email: string, password: string) {
    return this.afAuth.auth.createUserAndRetrieveDataWithEmailAndPassword(email, password)
  }

  public async createAccount(email: string, password: string) : Promise<firebase.auth.UserCredential> {
    return this.secondaryApp.auth().createUserWithEmailAndPassword(email, password).then(userCredential => {
        this.secondaryApp.auth().signOut();
        return userCredential
    });
  }

  /**
   * Check is administrator
   *
   * @param userId : String of user uid
   */
  public isAdmin(userId?: string): Observable<boolean> {
    const userType = localStorage.getItem('overhearUserType');
    if (userType === 'super') {
      return this.afAuth.authState.pipe(
        switchMap(user => {
          return this.db.object(`/admin/${user.uid}`).valueChanges()
            .pipe(map(item => !!item));
        })
      )
    } else if (userType === 'festival') {
      const cityId = localStorage.getItem('overhearCityId');
      return this.afAuth.authState.pipe(
        switchMap(user => {
          return this.db.object(`/owners/festivals/${cityId}`).valueChanges()
            .pipe(map(city => city['owner'] === user.email));
        })
      )
    } else { // if (userType === 'venue') {
      const venueId = localStorage.getItem('overhearVenueId');
      return this.afAuth.authState.pipe(
        switchMap(user => {
          return this.db.object(`/owners/venues/${venueId}`).valueChanges()
            .pipe(map(venue => venue['owner'] === user.email));
        })
      )
    }
  }

  public getCurrentUser() {
    return this.afAuth.authState
  }

  public loadCities() {
    this.cityService
        .loadCities()
        .snapshotChanges(['child_added'])
        .subscribe(actions => {
          actions.forEach(action => {
            this.cities.push({
              name: action.key
            });
          })
        });
  }

  public currentUserType(): string {
    return localStorage.getItem('overhearUserType');
  }

  /**
   * Logout
   *
   * @memberof AuthService
   */
  public signOut() {
    this.cities = [];
    localStorage.setItem('overhearUserType', null)
    localStorage.setItem('overhearCityId', null)
    localStorage.setItem('overhearVenueId', null)
    return this.afAuth.auth.signOut()
  }

}
