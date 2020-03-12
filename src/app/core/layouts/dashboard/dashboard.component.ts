import { Component, OnInit } from '@angular/core';
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

import * as NProgress from 'nprogress';
import { AuthService } from '@app/core/services/auth.service';
import { CityService } from '@app/core/services/city.service';
import { Events } from '@coturiv/angular-kits';
import { APP_EVENTS } from '@app/app.constants';
import { VenueService } from '@app/core/services/venue.service';

@Component({
  selector: 'app-layout-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class LayoutDashboardComponent implements OnInit {

  public sidebarCollapse: Boolean = false;

  public cities: Array<any> = [];

  public userType: string = 'super';

  public currentCity: any = null;
  
  public currentVenue: any = null;

  public selectedCity: any = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cityService: CityService,
    private venueService: VenueService,
    private events: Events
  ) {
    router.events.subscribe((routerEvent: RouterEvent) => {
      this.navigationInterceptor(routerEvent);
    });

    this.userType = this.authService.currentUserType();
    if (this.userType === 'super') {
      this.cityService
          .loadCities()
          .snapshotChanges(['child_added', 'child_changed', 'child_removed'])
          .subscribe(actions => {
            this.cities = []
            actions.forEach(action => {
              var city = action.payload.val() as any;
              city['key'] = action.key;
              this.cities.push(city);
            });
            if (this.selectedCity === null) {
              this.selectedCity = this.cities[0].key
              this.changedCity()
            }
          })
    } else if (this.userType === 'festival') {
      this.cityService.currentCityInfo().subscribe(action => {
        this.currentCity = action;
      })
    } else if (this.userType === 'venue') {
      this.venueService.currentVenueInfo().subscribe(action => {
        this.currentVenue = action;
      })
    }
  }

  ngOnInit() {
    NProgress.configure({
      showSpinner: false,
      parent: '#main-header'
    });

    this.authService.loadCities();
  }

  changedCity() {
    this.cityService.setCurrentCityId(this.selectedCity)

    // this.router.routeReuseStrategy.shouldReuseRoute = function(){
    //   return false;
    // };
    
    // this.router.events.subscribe((evt) => {
    //   if (evt instanceof NavigationEnd) {
    //     this.router.navigated = false;
    //     window.scrollTo(0, 0);
    //   }
    // });
    this.events.publish(APP_EVENTS.CITY_CHANGED, this.selectedCity);
  
  }
  
  public collapseSidebar() {
    this.sidebarCollapse = !this.sidebarCollapse;
  }

  // Shows and hides the loading spinner during RouterEvent changes
  private navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      NProgress.start();
    }
    if (event instanceof NavigationEnd) {
      NProgress.done();
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      NProgress.done();
    }
    if (event instanceof NavigationError) {
      NProgress.done();
    }
  }

}
