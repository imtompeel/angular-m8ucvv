import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { BehaviorSubject, Subscription, Observable } from 'rxjs';

import { VenueService } from '@app/core/services/venue.service';

import { RecordService } from '@app/core/services/record.service';
import { StorageService } from '@app/core/services/storage.service';
import { CityService } from '@app/core/services/city.service';

@Component({
  selector: 'app-record-delete',
  templateUrl: './record-delete.component.html',
  styleUrls: ['./record-delete.component.scss']
})
export class RecordDeleteComponent implements OnInit, OnDestroy {

  /**
   * subscriptions property
   *
   * @private
   * @type {Array<Subscription>}
   * @memberof RecordDeleteComponent
   */
  private subscriptions: Array<Subscription> = [];

  /**
   * room property
   *
   * @type {any}
   * @memberof RecordDeleteComponent
   */
  public artist: any;

  /**
   * formDelete property
   *
   * @type {FormGroup}
   * @memberof RecordDeleteComponent
   */
  public formDelete: FormGroup;

  /**
   * isLoading property
   *
   * @type {Boolean}
   * @memberof RecordDeleteComponent
   */
  public isLoading: Boolean = false;

  /**
   * error$ property
   *
   * @memberof RecordDeleteComponent
   */
  public error$ = new BehaviorSubject(null);

  /**
   * Creates an instance of RecordDeleteComponent
   *
   * @param {BsModalRef} bsModalRef
   * @param {FormBuilder} formBuilder
   * @param {RecordService} recordService
   * @memberof RecordDeleteComponent
   */
  constructor(
    public bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
    public recordService: RecordService,
    private storageService: StorageService,
    private venueService: VenueService,
    private cityService: CityService,
  ) { }

  /**
   * On component initialize
   *
   * @memberof RecordDeleteComponent
   */
  ngOnInit() {
    this.formDelete = this.formBuilder.group({
      id: [this.artist.key, Validators.required],
      name: this.artist.name
    });
  }

  /**
   * On component destroy
   *
   * @memberof RecordDeleteComponent
   */
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Room delete function
   *
   * @param {number} roomId
   * @param {boolean} isValid
   * @memberof RecordDeleteComponent
   */
  public delete(roomId: number, isValid: boolean) {

    this.isLoading = true;

    if (isValid) {
      var deleteTasks: Promise<any>[] = [];

      // Song path
      const songPath = this.artist.recording.path;
      if (songPath) {
        const task = this.storageService.deleteFile(songPath);
        deleteTasks.push(task);
      }

      // Haptic sound file path
      const hapticPath = this.artist.recording.hapticPath;
      if (hapticPath) {
        const task = this.storageService.deleteFile(hapticPath);
        deleteTasks.push(task);
      }

      // Big picture file path
      const bigPicturePath = this.artist.imagebig;
      if (bigPicturePath) {
        const task = this.storageService.deleteFile(bigPicturePath);
        deleteTasks.push(task);
      }

      // Small picture file path
      const smallPicturePath = this.artist.imagesmall;
      if (smallPicturePath) {
        const task = this.storageService.deleteFile(smallPicturePath);
        deleteTasks.push(task);
      }

      // Delete song ids from venues
      const cityId = this.cityService.currentCityId();
      const originalVenues: string[] = this.artist.recording.venues[cityId] as string[];
      if (originalVenues) {
        originalVenues.forEach(venueId => {
          this.venueService.removeSongIdFromVenue(venueId, this.artist.recordings[0]);
        })
      }

      const deleteArtist = function(it: RecordDeleteComponent) {
        it.recordService.deleteArtist(it.artist).then(result => {
          it.isLoading = false;
          it.bsModalRef.hide();
        }, error => {
          it.isLoading = false;
          it.error$.next(error);
        })
      }

      Promise.all(deleteTasks).then(result => {
        // deleteArtist(this);
      }, error => {
        // deleteArtist(this);
        console.log('file delete error', error);
      }).catch(reject => {
        console.log('rejected', reject);
        // deleteArtist(this);
      }).finally(() => {
        console.log('Called Finally');
        deleteArtist(this);
      })
    }
  }

}
