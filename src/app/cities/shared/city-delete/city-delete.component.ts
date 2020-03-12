import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { BehaviorSubject, Subscription } from 'rxjs';

import { VenueService } from '@app/core/services/venue.service';

import { StorageService } from '@app/core/services/storage.service';
import { CityService } from '@app/core/services/city.service';

@Component({
  selector: 'app-city-delete',
  templateUrl: './city-delete.component.html'
})
export class CityDeleteComponent implements OnInit, OnDestroy {

  /**
   * room property
   *
   * @type {any}
   * @memberof CityDeleteComponent
   */
  public city: any;

  /**
   * formDelete property
   *
   * @type {FormGroup}
   * @memberof CityDeleteComponent
   */
  public formDelete: FormGroup;

  /**
   * isLoading property
   *
   * @type {Boolean}
   * @memberof CityDeleteComponent
   */
  public isLoading: Boolean = false;

  /**
   * error$ property
   *
   * @memberof CityDeleteComponent
   */
  public error$ = new BehaviorSubject(null);

  /**
   * Creates an instance of CityDeleteComponent
   *
   * @param {BsModalRef} bsModalRef
   * @param {FormBuilder} formBuilder
   * @param {VenueService} venueService
   * @memberof CityDeleteComponent
   */
  constructor(
    public bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private cityService: CityService,
  ) { }

  /**
   * On component initialize
   *
   * @memberof CityDeleteComponent
   */
  ngOnInit() {
    this.formDelete = this.formBuilder.group({
      id: [this.city.key, Validators.required],
      name: this.city.name
    });
  }

  /**
   * On component destroy
   *
   * @memberof CityDeleteComponent
   */
  ngOnDestroy() {
  }

  /**
   * Room delete function
   *
   * @param {string} cityId
   * @param {boolean} isValid
   * @memberof CityDeleteComponent
   */
  public delete(cityId: string, isValid: boolean) {

    if (isValid) {
      this.cityService.deleteCity(cityId)
    }

    this.bsModalRef.hide()
  }

}
