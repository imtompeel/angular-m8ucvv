import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { VenueCreateComponent } from '@app/venues/shared/venue-create/venue-create.component';
import { VenueDeleteComponent } from '@app/venues/shared/venue-delete/venue-delete.component';
import { VenueUpdateComponent } from '@app/venues/shared/venue-update/venue-update.component';

import { VenueService } from '@app/core/services/venue.service';

import { IVenueSearchRequest, IVenueBase } from '@app/core/models/venue.interface';
import { CityService } from '@app/core/services/city.service';
import { Events } from '@coturiv/angular-kits';
import { APP_EVENTS } from '@app/app.constants';
import { VenueSettingComponent } from '../shared/venue-setting/venue-setting.component';
import { Key } from 'protractor/built';

@Component({
  selector: 'app-venues-list',
  templateUrl: './venues-list.component.html',
  styleUrls: ['./venues-list.component.scss']
})
export class VenuesListComponent implements OnInit, OnDestroy {

  /**
   * bsModalRef property
   *
   * @type {BsModalRef}
   * @memberof VenuesListComponent
   */
  public bsModalRef: BsModalRef;

  /**
   * formGrid property
   *
   * @type {FormGroup}
   * @memberof VenuesListComponent
   */
  public formGrid: FormGroup;

  /**
   * Array of cities
   */
  public cities: Array<any> = [];

  /**
   * All venues from Firebase Realtime database
   *
   * @type {Array<any>}
   * @memberof VenuesListComponent
   */
  public allVenues: Array<any> = [];

  /**
   * venues property
   *
   * @type {Array<any>}
   * @memberof VenuesListComponent
   */
  public venues: Array<any> = [];

  /**
  * downloads property
  *
  * @type {Array<any>}
  * @memberof VenuesListComponent
  */
  public downloads: Array<any> = [];

  private venueSubscription: Subscription = null;

  /**
   * Creates an instance of RoomListComponent.
   *
   * @param {BsModalService} modalService
   * @param {FormBuilder} formBuilder
   * @param {VenueService} venueService
   * @memberof VenuesListComponent
   */
  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private venueService: VenueService,
    private cityService: CityService,
    private events: Events
  ) {
  }

  /**
   * On component initialize
   *
   * @memberof VenuesListComponent
   */
  ngOnInit() {
    this.formGrid = this.formBuilder.group({
      keyword: ''
    });

    this.formGrid.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(value => this.searchVenues(value));

    this.searchVenues(this.formGrid.value);

    this.loadVenues();

    this.events.subscribe(APP_EVENTS.CITY_CHANGED, city => {
      this.loadVenues();
    });

  }

  /**
   * On component destroy
   *
   * @memberof VenuesListComponent
   */
  ngOnDestroy() {
    if (this.venueSubscription) {
      this.venueSubscription.unsubscribe();
      this.venueSubscription = null;
    }
  }

  private loadVenues() {

    if (this.venueSubscription) {
      this.venueSubscription.unsubscribe();
      this.venueSubscription = null;
    }
    this.venueSubscription =
      this.venueService
        .loadVenues(this.cityService.currentCityId())
        .snapshotChanges(['child_added', 'child_changed', 'child_removed'])
        .subscribe(actions => {
          this.venueService
            .getVenueDownloadLogs(this.cityService.currentCityId())
            .snapshotChanges(['child_added', 'child_changed', 'child_removed'])
            .subscribe(result => {
              this.downloads = result;
              this.allVenues = [];
              console.log("actions", actions);
              actions.forEach(action => {
                if (action.key !== 'versionnumber') {
                  const venue: any = action.payload.val() as any;
                  venue['key'] = action.key;
                  if (venue['isAvailable'] === undefined) {
                    venue['isAvailable'] = true;
                  }
                  for (const download of this.downloads) {
                    if (download.key === action.key) {
                      const downloadValue: any = download.payload.val() as any;
                      for (const key in downloadValue) {
                        if (downloadValue.hasOwnProperty(key)) {
                          venue['downloadCount'] = downloadValue[key].downloads;
                          break;
                        }
                      }
                    }
                  }
                  this.allVenues.push(venue);
                }
              });
              this.searchVenues({});
            });
        });
  }
  /**
   * Search venues with key, name or address
   *
   * @param {IVenueSearchRequest} payload
   *                                      venueKey?: string;
   *                                      name?: string;
   *                                      address?: string;
   */
  private searchVenues(payload: IVenueSearchRequest) {
    this.venues = this.allVenues;
  }

  public openWebsite(link: string) {

  }

  onChangeAvailableVenue(event: any, venue: any, isChecked: boolean) {
    const update = {
      isAvailable: isChecked
    };
    this.venueService.updateVenue(update, venue.key);
  }

  /**
   * Clear search input value
   *
   * @memberof VenuesListComponent
   */
  public clearSearchText() {
    this.formGrid.get('keyword').setValue('');
  }

  /**
   * Show modal create
   *
   * @memberof VenuesListComponent
   */
  public showModalCreate() {
    this.bsModalRef = this.modalService.show(VenueCreateComponent, {
      class: 'fade-left modal-dialog-tall modal-dialog-right'
    });
  }

  /**
   * Show modal update
   *
   * @param {VenueModel} venue
   * @memberof VenuesListComponent
   */
  public showModalUpdate(venue: any) {
    this.bsModalRef = this.modalService.show(VenueUpdateComponent, {
      class: 'fade-left modal-dialog-tall modal-dialog-right',
      initialState: {
        venue: venue
      }
    });
  }

  /**
   * Show modal delete
   *
   * @param {VenueModel} venue
   * @memberof VenuesListComponent
   */
  public showModalDelete(venue: any) {
    this.bsModalRef = this.modalService.show(VenueDeleteComponent, {
      class: 'fade-down modal-sm',
      initialState: {
        venue: venue
      }
    });
  }

  /**
   * Show modal for Venue Setting
   *
   * @param venue
   */
  public showModalVenueSetting(venue: any) {
    this.bsModalRef = this.modalService.show(VenueSettingComponent, {
      class: 'fade-left modal-dialog-tall modal-dialog-right',
      initialState: {
        venue: venue
      }
    });
  }

}
