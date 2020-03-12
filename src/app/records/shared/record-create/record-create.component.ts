import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { format } from 'date-fns';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { RecordService } from '@app/core/services/record.service';
import { StorageService } from '@app/core/services/storage.service';
import { VenueService } from '@app/core/services/venue.service';
import { CityService } from '@app/core/services/city.service';

@Component({
  selector: 'app-record-create',
  templateUrl: './record-create.component.html',
  styleUrls: ['./record-create.component.scss']
})
export class RecordCreateComponent implements OnInit, OnDestroy {

  /**
   * subscriptions property
   *
   * @private
   * @type {Array<Subscription>}
   * @memberof RecordCreateComponent
   */
  private subscriptions: Array<Subscription> = [];

  /**
   * formCreate property
   *
   * @type {FormGroup}
   * @memberof RecordCreateComponent
   */
  public formCreate: FormGroup;

  /**
   * isLoading property
   *
   * @type {Boolean}
   * @memberof RecordCreateComponent
   */
  public isLoading: Boolean = false;

  /**
   * Genre types
   */
  public genres: string[] = [];
  public songGenres: string[] = [];

  /**
   * All selectable Venues
   */
  public venues: any[] = [];

  /**
   * error$ property
   *
   * @memberof RecordCreateComponent
   */
  public error$ = new BehaviorSubject(null);

  /**
   * Creates an instance of RecordCreateComponent
   *
   * @param {BsModalRef} bsModalRef
   * @param {FormBuilder} formBuilder
   * @param {RoomService} roomService
   * @memberof RecordCreateComponent
   */
  constructor(
    public bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private recordService: RecordService,
    private storageService: StorageService,
    private venueService: VenueService,
    private cityService: CityService,
  ) {
    this.genres = this.recordService.genres;
    this.songGenres = this.recordService.genres;
  }

  /**
   * On component initialize
   *
   * @memberof RecordCreateComponent
   */
  ngOnInit() {
    this.formCreate = this.formBuilder.group({
      artistId: null,
      name: [null, Validators.required],
      description: '',
      website: '',
      genres: new FormArray([], this.minSelectedCheckboxes(1)),
      songGenres: new FormArray([], this.minSelectedCheckboxes(1)),
      songId: null,
      songTitle: [null, Validators.required],
      songText: null,
      songVenues: [null, Validators.required], //new FormArray([], this.minSelectedCheckboxes(1))
    });

    this.addGenreCheckboxes();
    this.addSongGenreCheckboxes();

    this.venueService
        .loadVenues(this.cityService.currentCityId())
        .snapshotChanges(['child_added', 'child_changed', 'child_removed'])
        .subscribe(actions => {
          this.venues = [];
          actions.forEach(action => {
            if (action.key !== 'versionnumber') { 
              var venue = {
                key: action.key,
                value: action.payload.val()
              };
              this.venues.push(venue);
            }
          })
          this.addVenues();
        });
  }

  private addGenreCheckboxes() {
    this.genres.map((g, i) => {
      const control = new FormControl();
      (this.formCreate.controls.genres as FormArray).push(control);
    });
  }

  private addSongGenreCheckboxes() {
    this.songGenres.map((g, i) => {
      const control = new FormControl();
      (this.formCreate.controls.songGenres as FormArray).push(control);
    });
  }

  private addVenues() {
    return;
    this.formCreate.controls.songVenues = new FormControl(null, Validators.required);
    this.venues.map((g, i) => {
      const control = new FormControl();
      (this.formCreate.controls.songVenues as FormArray).push(control);
    });
  }

  private minSelectedCheckboxes(min = 1) {
    const validator: ValidatorFn = (formArray: FormArray) => {
      const totalSelected = formArray.controls
        // get a list of checkbox values (boolean)
        .map(control => control.value)
        // total up the number of checked checkboxes
        .reduce((prev, next) => next ? prev + next : prev, 0);
  
      // if the total is not greater than the minimum, return the error message
      return totalSelected >= min ? null : { required: true };
    };
  
    return validator;
  }

  test(ev: any) {
    console.log(ev);
  }

  /**
   * On component destroy
   *
   * @memberof RecordCreateComponent
   */
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Room create function
   *
   * @param {Object} payload
   * @param {boolean} isValid
   * @memberof RecordCreateComponent
   */
  public create(payload: any, isValid: boolean) {
    
    console.log(payload);

    if (isValid) {
      this.isLoading = true;
      var artistId: string = payload.artistId;
      var artistName: string = payload.name;
      var description: string = payload.description;
      var website: string = payload.website;
      const artistGenres: boolean[] = payload.genres;
      var artistGenresValue: string[] = [];
      artistGenres.forEach((g, idx) => {
        if (g) {
          artistGenresValue.push(this.genres[idx]);
        }
      })

      var songId: string = payload.songId;
      const songTitle: string = payload.songTitle;
      const songText: string = payload.songText;
      const songGenres: boolean[] = payload.songGenres;
      var songGenresValue: string[] = [];
      songGenres.forEach((g, idx) => {
        if (g) {
          songGenresValue.push(this.songGenres[idx]);
        }
      })
      const songVenues: string[] = payload.songVenues;

      // Upload files
      const current = new Date().getTime();
      this.storageService.uploadFiles(current).then(result => {
        this.error$.next(null);
        
        const bigPicturePath = this.storageService.bigImageFileFullPath(current);
        const smallPicturePath = this.storageService.smallImageFileFullPath(current);
        const songPath = this.storageService.songFileFullPath(current);
        const hapticPath = this.storageService.hapticFileFullPath(current);

        // Create song object and save
        const cityId = this.cityService.currentCityId();
        var songObj = {
          title: songTitle,
          genre: songGenresValue,
          text: songText,
          hapticPath: hapticPath,
          path: songPath,
          artist: artistId,
          venues: {}
        }
        songObj.venues[cityId] = songVenues

        songId = this.recordService.createSong(songObj, songId);
        const shouldUpdateArtistIdForSong: boolean = (artistId === null ? true : false);

        // Create Artist object and save
        const artistObj = {
          name: artistName,
          description: description,
          genre: artistGenresValue,
          imagebig: bigPicturePath,
          imagesmall: smallPicturePath,
          recordings: [songId],
          website: website
        }
        artistId = this.recordService.createArtist(artistObj, artistId);

        // Update artist id for song
        if (shouldUpdateArtistIdForSong) {
          this.recordService.updateArtistIdForSong(songId, artistId);
        }

        // Update venue's recordings
        songVenues.forEach(venueId => {
          this.venueService.addSongIdToVenue(venueId, songId);
        })

        // Hide modal
        this.isLoading = false;
        this.bsModalRef.hide();

      }, reject => {
        this.isLoading = false;
        this.error$.next(reject);
        console.log('file upload failed');
      })

      // room.open_at = format(room.open_at, 'HH:mm');
      // room.close_at = format(room.close_at, 'HH:mm');

    }
  }

}
