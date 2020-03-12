import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { VenueService } from '@app/core/services/venue.service';

import { RecordService } from '@app/core/services/record.service';
import { StorageService } from '@app/core/services/storage.service';
import { CityService } from '@app/core/services/city.service';


@Component({
  selector: 'app-record-update',
  templateUrl: './record-update.component.html',
  styleUrls: ['./record-update.component.scss']
})
export class RecordUpdateComponent implements OnInit, OnDestroy {

  /**
   * subscriptions property
   *
   * @private
   * @type {Array<Subscription>}
   * @memberof RecordUpdateComponent
   */
  private subscriptions: Array<Subscription> = [];

  /**
   * Artist object
   */
  public artist: any;

  /**
   * formUpdate property
   *
   * @type {FormGroup}
   * @memberof RecordUpdateComponent
   */
  public formUpdate: FormGroup;

  /**
   * isLoading property
   *
   * @type {Boolean}
   * @memberof RecordUpdateComponent
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
   * @memberof RecordUpdateComponent
   */
  public error$ = new BehaviorSubject(null);

  /**
   * Creates an instance of RecordUpdateComponent.
   *
   * @param {BsModalRef} bsModalRef
   * @param {FormBuilder} formBuilder
   * @param {CompanyService} companyService
   * @param {RoomService} venueService
   * @memberof RecordUpdateComponent
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
   * @memberof RecordUpdateComponent
   */
  ngOnInit() {
    console.log(this.artist);

    const cityId = this.cityService.currentCityId();
    this.formUpdate = this.formBuilder.group({
      name: [this.artist.name, Validators.required],
      description: this.artist.description,
      website: this.artist.website,
      genres: new FormArray([], this.minSelectedCheckboxes(1)),
      songGenres: new FormArray([], this.minSelectedCheckboxes(1)),
      songTitle: [this.artist.recording.title, Validators.required],
      songText: this.artist.recording.text,
      songVenues: [this.artist.recording[cityId], Validators.required],
    });

    this.addGenreCheckboxes();
    this.addSongGenreCheckboxes();

    this.venueService
        .loadVenues(cityId)
        .snapshotChanges(['child_added', 'child_changed', 'child_removed'])
        .subscribe(actions => {
          this.venues = [];
          const selectedVenues: string[] = this.artist.recording.venues[cityId];
          var willSelectVenuesName : any[] = [];
          actions.forEach(action => {
            if (action.key !== 'versionnumber') { 
              var venue = {
                key: action.key,
                value: action.payload.val()
              };
              this.venues.push(venue);
              const idx = selectedVenues.indexOf(venue.key);
              if (idx >= 0) {
                willSelectVenuesName.push(venue.value['name']);
              }
            }
          });
          (this.formUpdate.controls.songVenues as FormControl)
            .setValue(willSelectVenuesName);
        });

  }

  private addGenreCheckboxes() {
    this.genres.map((g, i) => {
      const idx = this.artist.genre.indexOf(g);
      const control = new FormControl(idx >= 0);
      (this.formUpdate.controls.genres as FormArray).push(control);
    });
  }

  private addSongGenreCheckboxes() {
    this.songGenres.map((g, i) => {
      const idx = this.artist.recording.genre.indexOf(g);
      const control = new FormControl(idx >= 0);
      (this.formUpdate.controls.songGenres as FormArray).push(control);
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

  /**
   * On component destroy
   *
   * @memberof RecordUpdateComponent
   */
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Update room
   *
   * @param {any} payload
   * @param {boolean} isValid
   * @memberof RecordUpdateComponent
   */
  public update(payload: any, isValid: boolean) {
    if (isValid) {
      this.isLoading = true;

      var artistId: string = this.artist.key;
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

      var songId: string = this.artist.recordings[0];
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

      const current = new Date().getTime();
      this.storageService.uploadFiles(current).then(result => {
        this.error$.next(null);
        
        const bigPicturePath = this.storageService.bigImageFileFullPath(current);
        const smallPicturePath = this.storageService.smallImageFileFullPath(current);
        const songPath = this.storageService.songFileFullPath(current);
        const hapticPath = this.storageService.hapticFileFullPath(current);

        // Create song object and update
        const cityId = this.cityService.currentCityId();
        var songObj = {
          title: songTitle,
          genre: songGenresValue,
          text: songText,
          venues: {}
        }
        songObj.venues[cityId] = songVenues
        if (songPath) {
          songObj['path'] = songPath;
        }
        if (hapticPath) {
          songObj['hapticPath'] = hapticPath;
        }

        this.recordService.updateSong(songObj, songId);
        
        // Create Artist object and update
        var artistObj = {
          name: artistName,
          description: description,
          genre: artistGenresValue,
          website: website
        }
        if (bigPicturePath) {
          artistObj['imagebig'] = bigPicturePath;
        }
        if (smallPicturePath) {
          artistObj['imagesmall'] = smallPicturePath;
        }

        this.recordService.updateArtist(artistObj, artistId);
        
        
        // Update venue's recordings
        const originalVenues: string[] = this.artist.recording.venues[cityId] as string[];
        if (originalVenues) {
          originalVenues.forEach(venueId => {
            this.venueService.removeSongIdFromVenue(venueId, songId);
          })
        }
        songVenues.forEach(venueId => {
          this.venueService.addSongIdToVenue(venueId, songId);
        })

        // Hide update modal view
        this.isLoading = false;
        this.bsModalRef.hide();

      }, reject => {
        this.isLoading = false;
        this.error$.next(reject);
        console.log('file upload failed');
      })
    }
  }

  /**
   * Reformat time
   *
   * @private
   * @param {*} time
   * @returns
   * @memberof RecordUpdateComponent
   */
  private _reformatTime(time) {
    const date = new Date();

    date.setHours(+time.split(':')[0]);
    date.setMinutes(+time.split(':')[1]);

    return date;
  }

}
