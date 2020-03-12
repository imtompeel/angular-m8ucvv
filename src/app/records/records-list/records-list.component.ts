import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { VenueService } from '@app/core/services/venue.service';

import { IVenueSearchRequest, IVenueBase } from '@app/core/models/venue.interface';
import { CityService } from '@app/core/services/city.service';
import { RecordCreateComponent } from '../shared/record-create/record-create.component';
import { RecordUpdateComponent } from '../shared/record-update/record-update.component';
import { RecordDeleteComponent } from '../shared/record-delete/record-delete.component';
import { RecordService } from '@app/core/services/record.service';
import { Events } from '@coturiv/angular-kits';
import { APP_EVENTS } from '@app/app.constants';
import { id } from '@swimlane/ngx-datatable/release/utils';

@Component({
  selector: 'app-records-list',
  templateUrl: './records-list.component.html',
  styleUrls: ['./records-list.component.scss']
})
export class RecordsListComponent implements OnInit, OnDestroy {

  /**
   * bsModalRef property
   *
   * @type {BsModalRef}
   * @memberof RecordsListComponent
   */
  public bsModalRef: BsModalRef;

  /**
   * formGrid property
   *
   * @type {FormGroup}
   * @memberof RecordsListComponent
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
   * @memberof RecordsListComponent
   */
  public allArtists: Array<any> = [];

  /**
   * venues property
   *
   * @type {Array<any>}
   * @memberof RecordsListComponent
   */
  public artists: Array<any> = [];

  private artistSubscription: Subscription = null

  /**
   * Creates an instance of RoomListComponent.
   *
   * @param {BsModalService} modalService
   * @param {FormBuilder} formBuilder
   * @param {VenueService} venueService
   * @memberof RecordsListComponent
   */
  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private venueService: VenueService,
    private cityService: CityService,
    private recordService: RecordService,
    private events: Events
  ) {

  }

  /**
   * On component initialize
   *
   * @memberof RecordsListComponent
   */
  ngOnInit() {
    this.formGrid = this.formBuilder.group({
      keyword: ''
    });

    this.formGrid.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(value => this.searchArtist(value));

    this.searchArtist(this.formGrid.value);

    this.loadArtists();

    this.events.subscribe(APP_EVENTS.CITY_CHANGED, city => {
      this.loadArtists();
    });
  }

  /**
   * On component destroy
   *
   * @memberof RecordsListComponent
   */
  ngOnDestroy() {
    if (this.artistSubscription) {
      this.artistSubscription.unsubscribe();
    }
  }

  private loadArtists() {
    
    if (this.artistSubscription) {
      this.artistSubscription.unsubscribe();
    }
    
    this.allArtists = [];
    this.searchArtist({});

    this.artistSubscription = 
    this.recordService
        .loadArtists()
        .snapshotChanges(['child_added', 'child_changed', 'child_removed'])
        .subscribe(actions => {
          console.log(actions);
          actions.forEach(action => {
            let artist = action.payload.val();

              artist['key'] = action.key;

              this.finalizeArtistInfo(artist, ((response: any) => {
                if (response === null) { return; }
                console.log('Artists:', this.allArtists);
                if (action.type === 'child_added') {
                  this.allArtists.push(response);
                  this.searchArtist({});
                } else if (action.type === 'value') {
                  const obj = this.allArtists.filter(item => item.key === action.key)[0];
                  const idx = this.allArtists.indexOf(obj);
                  if (idx >= 0) {
                    this.allArtists[idx] = response;
                  } else {
                    this.allArtists.push(response);
                    this.searchArtist({});
                  }
                } else if (action.type === 'child_removed') {
                  const obj = this.allArtists.filter(item => item.key === action.key)[0];
                  const idx = this.allArtists.indexOf(obj);
                  if (idx >= 0) {
                    this.allArtists.splice(idx, 1);
                  }
                }
              }));
              
          });
        });
  }

  private finalizeArtistInfo(artist: any, complete: Function) {
    const cityId = this.cityService.currentCityId();
    let desc: string = artist['description'] || '';
    if (desc.length > 30) {
      desc = desc.substr(0, 30) + '...';
    }
    artist['shortDescription'] = desc;

    if (artist['recordings'] !== null && artist['recordings'].length > 0) {
      const recordingId = artist['recordings'][0];
      this.recordService
          .loadSong(recordingId)
          .valueChanges()
          .subscribe(value => {
            if (value) {
              // Check Artist for Current City
              const idx = Object.keys(value['venues']).indexOf(cityId);
              if (idx < 0) {
                complete(null);
                return;
              }

              let shortTitle: string = value['title'] || '';
              if (shortTitle.length > 20) {
                shortTitle = shortTitle.substr(0, 20) + '...';
              }
              value['shortTitle'] = shortTitle;
              artist['recording'] = value;
              complete(artist);
            }
          });
    }
  }

  /**
   * Search venues with key, name or address
   * 
   * @param {IVenueSearchRequest} payload  
   *                                      venueKey?: string; 
   *                                      name?: string; 
   *                                      address?: string;
   */
  private searchArtist(payload: IVenueSearchRequest) {
    this.artists = [...this.allArtists];
    
  }
  
  public openWebsite(link: string) {
    
  }

  public playSong(path?: string) {

  }

  /**
   * Clear search input value
   *
   * @memberof RecordsListComponent
   */
  public clearSearchText() {
    this.formGrid.get('keyword').setValue('');
  }

  /**
   * Show modal create
   *
   * @memberof RecordsListComponent
   */
  public showModalCreate() {
    this.bsModalRef = this.modalService.show(RecordCreateComponent, {
      class: 'fade-left modal-dialog-tall modal-dialog-right'
    });
  }

  /**
   * Show modal update
   *
   * @param {VenueModel} artist
   * @memberof RecordsListComponent
   */
  public showModalUpdate(artist: any) {
    this.bsModalRef = this.modalService.show(RecordUpdateComponent, {
      class: 'fade-left modal-dialog-tall modal-dialog-right',
      initialState: { artist: artist }
    });
  }

  /**
   * Show modal delete
   *
   * @param {VenueModel} artist
   * @memberof RecordsListComponent
   */
  public showModalDelete(artist: any) {
    this.bsModalRef = this.modalService.show(RecordDeleteComponent, {
      class: 'fade-down modal-sm',
      initialState: { artist: artist }
    });
  }

}
