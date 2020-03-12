import { Component, OnInit, OnDestroy, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { format } from 'date-fns';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { VenueService } from '@app/core/services/venue.service';
import { StorageService } from '@app/core/services/storage.service';
import { CityService } from '@app/core/services/city.service';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-city-create',
  templateUrl: './city-create.component.html',
  styleUrls: ['./city-create.component.scss']
})
export class CityCreateComponent implements OnInit, OnDestroy {

  /**
   * formCreate property
   *
   * @type {FormGroup}
   * @memberof CityCreateComponent
   */
  public formCreate: FormGroup;

  /**
   * isLoading property
   *
   * @type {Boolean}
   * @memberof CityCreateComponent
   */
  public isLoading: Boolean = false;

  /**
   * error$ property
   *
   * @memberof CityCreateComponent
   */
  public error$ = new BehaviorSubject(null);

  modalRef2: BsModalRef;

  @ViewChild('existUserPopup', {read: TemplateRef})
  existUserPopup: TemplateRef<any>;

  /**
   * Creates an instance of CityCreateComponent
   *
   * @param {BsModalRef} bsModalRef
   * @param {FormBuilder} formBuilder
   * @param {AuthService} authService
   * @param {StorageService} storageService
   * @memberof CityCreateComponent
   */
  constructor(
    public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService,
    private cityService: CityService
  ) {
  }

  /**
   * On component initialize
   *
   * @memberof CityCreateComponent
   */
  ngOnInit() {
    this.formCreate = this.formBuilder.group({
      cityId: null,
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    });
  }

  /**
   * On component destroy
   *
   * @memberof CityCreateComponent
   */
  ngOnDestroy() {

  }

  /**
   * Room create function
   *
   * @param {any} payload
   * @param {boolean} isValid
   * @memberof CityCreateComponent
   */
  public create(payload: any, isValid: boolean) {
    if (isValid) {

      const cityId = payload.cityId;
      const cityObj = {
        name: payload.name,
        owner: payload.email
      }

      const createCityTask = this.cityService.createCity(cityObj, cityId) as Promise<any>
      const createUserTask = this.authService.createAccount(payload.email, payload.password);

      this.isLoading = true
      Promise
        .all([createCityTask, createUserTask])
        .then(result => {
          this.bsModalRef.hide()
        }, error => {
          if (error.code === 'auth/email-already-in-use') {
            this.modalRef2 = this.modalService.show(this.existUserPopup, { class: 'fade-down modal-sm' });
            this.bsModalRef.hide()
          } else {
            this.error$.next(error)
          }
        })
        .catch(error => {
          console.log(error)
          this.error$.next(error)
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  }

}
