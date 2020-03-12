import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { BehaviorSubject, Subscription } from 'rxjs';

import { AuthService } from '@app/core/services/auth.service';
import { CityService } from '@app/core/services/city.service';
import { VenueService } from '@app/core/services/venue.service';

@Component({
  selector: 'app-form-signin',
  templateUrl: './form-signin.component.html',
  styleUrls: ['./form-signin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormSigninComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = []

  /**
   * formSignin property
   *
   * @type {FormGroup}
   * @memberof FormSigninComponent
   */
  public formSignin: FormGroup;

  /**
   * isLoading property
   *
   * @type {boolean}
   * @memberof FormSigninComponent
   */
  public isLoading: boolean = false;

  /**
   * isPasswordShowed property
   *
   * @type {Boolean}
   * @memberof FormSigninComponent
   */
  public isPasswordShowed: Boolean = false;

  /**
   * error$ property
   *
   * @memberof FormSigninComponent
   */
  public error$ = new BehaviorSubject(null);

  public cities: any[] = [];

  public allVenues: any[] = [];

  public selectedVenues: any[] = [];
  
  /**
   * Creates an instance of FormSigninComponent.
   *
   * @param {Router} router
   * @param {FormBuilder} formBuilder
   * @param {AuthService} authService
   * @memberof FormSigninComponent
   */
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private cityService: CityService,
    private venueService: VenueService
  ) { }

  /**
   * ngOnInit
   *
   * @memberof FormSigninComponent
   */
  ngOnInit() {
    this.formSignin = this.formBuilder.group({
      userType: ['super', Validators.required],
      cityId: null,
      venueId: null,
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      auth_type: 'email',
    });

    this.formSignin
        .get('cityId')
        .valueChanges
        .subscribe(value => {
          this.selectedVenues = this.allVenues.filter (venue => {
            return venue.cityId === value
          })
        }, error => {

        })

    this.subscriptions.push(
      this.cityService
          .loadCities()
          .snapshotChanges(['child_added', 'child_changed', 'child_removed'])
          .subscribe(actions => {
            this.cities = []
            actions.forEach(action => {
              var cityObj = action.payload.val() as any
              cityObj['key'] = action.key
              this.cities.push(cityObj)
            })
          })
    )
    
    this.subscriptions.push(
      this.venueService
          .getVenueAndOwners()
          .snapshotChanges(['child_added', 'child_changed', 'child_removed'])
          .subscribe(actions => {
            this.allVenues = []
            actions.forEach(action => {
              var venueObj = action.payload.val() as any
              venueObj['key'] = action.key
              this.allVenues.push(venueObj)
            })
          })
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * showPassword function
   *
   * @memberof FormSigninComponent
   */
  showPassword() {
    this.isPasswordShowed = !this.isPasswordShowed;
  }

  /**
   * doSignin
   *
   * @param {any} payload
   * @param {Boolean} isValid
   * @memberof FormSigninComponent
   */
  public doSignin(payload: any, isValid: Boolean) {
    if (isValid) {
      if (payload.userType === 'festival') {
        if (payload.cityId === null) {
          const error = {
            success: false,
            message: 'Please select your festival.'
          }
          this.error$.next(error);
          return;
        } else {
          const selectedCity = this.cities.filter((city, idx, elems) => {
            return city.key === payload.cityId
          })[0]
          if (selectedCity.owner !== payload.email) {
            const error = {
              success: false,
              message: `You are not owner of ${selectedCity.name}`
            }
            this.error$.next(error);
            return;
          }
        }
      } else if (payload.userType === 'venue') {
        if (payload.cityId === null || payload.venueId === null) {
          const error = {
            success: false,
            message: 'Please select your festival and venue.'
          }
          this.error$.next(error);
          return;
        } else {
          const selectedVenue = this.allVenues.filter((venue, idx, elems) => {
            return venue.key === payload.venueId
          })[0]
          if (selectedVenue.owner !== payload.email) {
            const error = {
              success: false,
              message: `You are not owner of ${selectedVenue.name}`
            }
            this.error$.next(error);
            return;
          }
        }
      }

      this.isLoading = true;
      this.error$.next(null);

      this.authService.signIn(payload.email, payload.password).then(
        result => {
          this.isLoading = false;

          if (result) {
            localStorage.setItem('overhearUserType', payload.userType)
            localStorage.setItem('overhearCityId', payload.cityId)
            localStorage.setItem('overhearVenueId', payload.venueId)
            this.router.navigate(['/venues']);
          } else {
            this.error$.next(result);
          }
        },
        error => {
          console.log('then error');
          console.log(error);
          if (error.code === 'auth/user-not-found') {

          } else {
            this.isLoading = false;
            error.success = false;
            this.error$.next(error);
          }
        }
      );
    }
  }

  public closeError() {
    this.error$.next(null);
  }

}
