import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { format } from 'date-fns';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { VenueService } from '@app/core/services/venue.service';
import { StorageService } from '@app/core/services/storage.service';


@Component({
  selector: 'app-venue-update',
  templateUrl: './venue-update.component.html',
  styleUrls: ['./venue-update.component.scss']
})
export class VenueUpdateComponent implements OnInit, OnDestroy {

  /**
   * room property
   *
   * @type {any}
   * @memberof VenueUpdateComponent
   */
  public venue: any;

  /**
   * formUpdate property
   *
   * @type {FormGroup}
   * @memberof VenueUpdateComponent
   */
  public formUpdate: FormGroup;

  /**
   * isLoading property
   *
   * @type {Boolean}
   * @memberof VenueUpdateComponent
   */
  public isLoading: Boolean = false;

  /**
   * error$ property
   *
   * @memberof VenueUpdateComponent
   */
  public error$ = new BehaviorSubject(null);

  /**
   * Creates an instance of VenueUpdateComponent.
   *
   * @param {BsModalRef} bsModalRef
   * @param {FormBuilder} formBuilder
   * @param {VenueService} venueService
   * @param {StorageService} storageService
   * @memberof VenueUpdateComponent
   */
  constructor(
    public bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private venueService: VenueService,
    private storageService: StorageService,
  ) {
  }

  /**
   * On component initialize
   *
   * @memberof VenueUpdateComponent
   */
  ngOnInit() {
    console.log(this.venue);
    this.formUpdate = this.formBuilder.group({
      venueId: { value: this.venue.key, disabled: true },
      name: [this.venue.name, Validators.required],
      address: this.venue.address,
      latitude: [this.venue.lat, [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: [this.venue.long, [Validators.required, Validators.min(-180), Validators.max(180)]],
      distance: [this.venue.distance, Validators.required],
      email: [this.venue.email, [Validators.email]],
      description: this.venue.description,
      website: this.venue.website,
      nfcId: this.venue.nfcId,
    });

  }

  /**
   * On component destroy
   *
   * @memberof VenueUpdateComponent
   */
  ngOnDestroy() {
  }

  /**
   * Update room
   *
   * @param {any} payload
   * @param {boolean} isValid
   * @memberof VenueUpdateComponent
   */
  public update(payload: any, isValid: boolean) {
    if (isValid) {
      this.isLoading = true;

      const venueObj = {
        address: payload.address || '',
        description: payload.description || '',
        lat: payload.latitude * 1 || 0,
        long: payload.longitude * 1 || 0,
        distance: payload.distance * 1 || 15,
        name: payload.name || '',
        website: payload.website || '',
        email: payload.email,
      };
      const venueId: string = this.venue.key;

      const current = new Date().getTime();
      this.storageService.uploadFiles(current).then(result => {
        this.error$.next(null);
        const bigPicturePath = this.storageService.bigImageFileFullPath(current);
        if (bigPicturePath) {
          venueObj['imagebig'] = bigPicturePath;
        }

        const tasks: any[] = [];

        tasks.push(this.venueService.updateVenue(venueObj, venueId));

        tasks.push(
          this.venueService.updateVenueSetting({
            website: payload.website,
            description: payload.description
          }, venueId)
        );

        if (payload.email) {
          tasks.push(
            this.venueService.updateVenueOwner(venueId, venueObj.name, payload.email)
          );
        }

        Promise.all(tasks).then(_result => {
          this.isLoading = false;
          this.bsModalRef.hide();
        }, error => {
          this.error$.next(error);
          this.isLoading = false;
        });

      }, reject => {
        this.isLoading = false;
        this.error$.next(reject);
        console.log('file upload failed');
      });

    }
  }

  /**
   * Reformat time
   *
   * @private
   * @param {*} time
   * @returns
   * @memberof VenueUpdateComponent
   */
  private _reformatTime(time) {
    const date = new Date();

    date.setHours(+time.split(':')[0]);
    date.setMinutes(+time.split(':')[1]);

    return date;
  }

}
