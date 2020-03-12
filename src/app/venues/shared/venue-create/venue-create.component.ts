import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { format } from 'date-fns';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { VenueService } from '@app/core/services/venue.service';
import { StorageService } from '@app/core/services/storage.service';
import { CityService } from '@app/core/services/city.service';

@Component({
  selector: 'app-venue-create',
  templateUrl: './venue-create.component.html',
  styleUrls: ['./venue-create.component.scss']
})
export class VenueCreateComponent implements OnInit, OnDestroy {

  /**
   * formCreate property
   *
   * @type {FormGroup}
   * @memberof RoomCreateComponent
   */
  public formCreate: FormGroup;

  /**
   * isLoading property
   *
   * @type {Boolean}
   * @memberof RoomCreateComponent
   */
  public isLoading: Boolean = false;

  /**
   * error$ property
   *
   * @memberof RoomCreateComponent
   */
  public error$ = new BehaviorSubject(null);

  /**
   * Creates an instance of RoomCreateComponent
   *
   * @param {BsModalRef} bsModalRef
   * @param {FormBuilder} formBuilder
   * @param {VenueService} venueService
   * @param {StorageService} storageService
   * @memberof RoomCreateComponent
   */
  constructor(
    public bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private venueService: VenueService,
    private storageService: StorageService,
    private cityService: CityService
  ) {
  }

  /**
   * On component initialize
   *
   * @memberof RoomCreateComponent
   */
  ngOnInit() {
    this.formCreate = this.formBuilder.group({
      venueId: null,
      isAvailable: true,
      name: [null, Validators.required],
      address: '',
      latitude: [0, [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: [0, [Validators.required, Validators.min(-180), Validators.max(180)]],
      distance: [15, Validators.required],
      email: [null, [Validators.email]],
      description: '',
      website: '',
      nfcId: null,
    });
  }

  /**
   * On component destroy
   *
   * @memberof RoomCreateComponent
   */
  ngOnDestroy() {

  }

  /**
   * Room create function
   *
   * @param {any} payload
   * @param {boolean} isValid
   * @memberof RoomCreateComponent
   */
  public create(payload: any, isValid: boolean) {
    if (isValid) {
      this.isLoading = true;

      const venueObj = {
        address: payload.address || '',
        city: this.cityService.currentCityId(),
        festivalKey: this.cityService.currentCityId(),
        description: payload.description || '',
        imagebig: '',
        imagesmall: '',
        lat: payload.latitude * 1 || 0,
        long: payload.longitude * 1 || 0,
        distance: payload.distance * 1 || 15,
        name: payload.name || '',
        website: payload.website || ''
      };
      let venueId: string = payload.venueId;

      const current = new Date().getTime();
      this.storageService.uploadFiles(current).then(result => {
        this.error$.next(null);
        const bigPicturePath = this.storageService.bigImageFileFullPath(current);
        if (bigPicturePath) {
          venueObj.imagebig = bigPicturePath;
        }

        venueId = this.venueService.createVenue(venueObj, venueId);

        if (payload.email) {
          this.venueService.updateVenueOwner(venueId, venueObj.name, payload.email);
        }

        this.isLoading = false;
        this.bsModalRef.hide();
      }, reject => {
        this.isLoading = false;
        this.error$.next(reject);
        console.log('file upload failed');
      });

    }
  }

}
