import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { CityService } from '@app/core/services/city.service';


@Component({
  selector: 'app-city-update',
  templateUrl: './city-update.component.html',
  styleUrls: ['./city-update.component.scss']
})
export class CityUpdateComponent implements OnInit, OnDestroy {

  /**
   * room property
   *
   * @type {any}
   * @memberof CityUpdateComponent
   */
  public city: any;

  /**
   * formUpdate property
   *
   * @type {FormGroup}
   * @memberof CityUpdateComponent
   */
  public formUpdate: FormGroup;

  /**
   * isLoading property
   *
   * @type {Boolean}
   * @memberof CityUpdateComponent
   */
  public isLoading: Boolean = false;

  /**
   * error$ property
   *
   * @memberof CityUpdateComponent
   */
  public error$ = new BehaviorSubject(null);

  /**
   * Creates an instance of CityUpdateComponent.
   *
   * @param {BsModalRef} bsModalRef
   * @param {FormBuilder} formBuilder
   * @param {CityService} cityService
   * @memberof CityUpdateComponent
   */
  constructor(
    public bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private cityService: CityService,
  ) {
  }

  /**
   * On component initialize
   *
   * @memberof CityUpdateComponent
   */
  ngOnInit() {
    console.log(this.city);
    this.formUpdate = this.formBuilder.group({
      cityId: { value: this.city.key, disabled: true },
      name: [this.city.name, Validators.required],
      email: { value: this.city.owner, disabled: true }
    });

  }

  /**
   * On component destroy
   *
   * @memberof CityUpdateComponent
   */
  ngOnDestroy() {
  }

  /**
   * Update room
   *
   * @param {any} payload
   * @param {boolean} isValid
   * @memberof CityUpdateComponent
   */
  public update(payload: any, isValid: boolean) {
    if (isValid) {
      
      const cityObj = {
        name: payload.name
      }
      this.cityService.updateCity(cityObj, this.city.key);

      this.bsModalRef.hide()
    }
  }

}
