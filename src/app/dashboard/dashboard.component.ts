import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '@app/core/services/user.service';
import { VenueService } from '@app/core/services/venue.service';
import { RecordService } from '@app/core/services/record.service';
import { CityService } from '@app/core/services/city.service';
import { Subscription, Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from '@app/core/services/auth.service';
import { AngularFireAction } from '@angular/fire/database';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  /**
   * subscription property
   *
   * @type {Array<Subscription>}
   * @memberof CompanyListComponent
   */
  public subscriptions: Array<Subscription> = [];

  public totalUsers: number = 10;

  public totalRecordings: number = 0;

  public totalVenues: number = 0;

  userType: string = null

  constructor(
    private userService: UserService,
    private venueService: VenueService,
    private recordService: RecordService,
    private cityService: CityService,
    private authService: AuthService
  ) { 
    this.userType = this.authService.currentUserType()
  }

  ngOnInit() {
    this.subscriptions.push(
      this.userService
          .getTotalUsers()
          .valueChanges()
          .subscribe(actions => {
            this.totalUsers = Object.keys(actions).length;
          })
    )

    if (this.userType === 'owner') {

      const cityId = this.cityService.currentCityId()
      
      this.subscriptions.push(
        this.recordService
            .loadSongs()
            .snapshotChanges(['child_added', 'child_changed', 'child_removed'])
            .subscribe(actions => {
              const recordings = actions.filter(action => {
                const song = action.payload.val()
                return Object.keys(song['venues']).indexOf(cityId) >= 0
              })
              this.totalRecordings = recordings.length
            })
      )

      this.subscriptions.push(
        this.venueService
            .loadVenues(cityId)
            .valueChanges(['child_added', 'child_changed', 'child_removed'])
            .subscribe(actions => {
              const venues = Object.keys(actions).filter(key => {
                return key !== 'versionnumber'
              })
              this.totalVenues += venues.length
            })
      )
  
    } else {
      this.subscriptions.push(
        this.recordService
          .loadArtists()
          .valueChanges(['child_added', 'child_changed', 'child_removed'])
          .subscribe(actions => {
            this.totalRecordings = Object.keys(actions).length;
          })
      )  

      this.subscriptions.push(
        this.venueService
            .loadVenues('/')
            .valueChanges(['child_added', 'child_changed', 'child_removed'])
            .subscribe(actions => {
              this.totalVenues = 0
              actions.forEach(action => {
                const venues = Object.keys(action).filter(key => {
                  return key !== 'versionnumber'
                })
                this.totalVenues += venues.length
              })
            })
      )
  
    }


  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
