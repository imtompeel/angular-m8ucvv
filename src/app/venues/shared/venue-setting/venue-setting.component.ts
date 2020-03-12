import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { format } from 'date-fns';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { VenueService } from '@app/core/services/venue.service';
import { StorageService } from '@app/core/services/storage.service';
import { CityService } from '@app/core/services/city.service';

@Component({
  selector: 'app-venue-setting',
  templateUrl: './venue-setting.component.html',
  styleUrls: ['./venue-setting.component.scss']
})
export class VenueSettingComponent implements OnInit, OnDestroy {

  /**
   * componentAlive property
   *
   * @private
   * @memberof ModalCreateComponent
   */
  private componentAlive = true;

  /**
   * formCreate property
   *
   * @type {FormGroup}
   * @memberof VenueSettingComponent
   */
  public formSetting: FormGroup;

  /**
   * isLoading property
   *
   * @type {Boolean}
   * @memberof VenueSettingComponent
   */
  public isLoading: Boolean = false;

  /**
   * error$ property
   *
   * @memberof VenueSettingComponent
   */
  public error$ = new BehaviorSubject(null);

  public venue: any = null

  weeks: any[] = [
    {
      id: 'mon', value: 'Mon', name: 'Mon'
    },
    {
      id: 'tue', value: 'Tues', name: 'Tue'
    },
    {
      id: 'wed', value: 'Wed', name: 'Wed'
    },
    {
      id: 'thu', value: 'Thurs', name: 'Thu'
    },
    {
      id: 'fri', value: 'Fri', name: 'Fri'
    },
    {
      id: 'sat', value: 'Sat', name: 'Sat'
    },
    {
      id: 'sun', value: 'Sun', name: 'Sun'
    },
  ]

  downloadCounts: number = 20

  nfcInteractions: number = 21


  /**
   * Creates an instance of VenueSettingComponent
   *
   * @param {BsModalRef} bsModalRef
   * @param {FormBuilder} formBuilder
   * @param {VenueService} venueService
   * @param {StorageService} storageService
   * @memberof VenueSettingComponent
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
   * @memberof VenueSettingComponent
   */
  ngOnInit() {

    const defaultStartTime: any = { value: '09:00', disabled: true}
    const defaultEndTime: any = { value: '17:00', disabled: true}

    this.formSetting = this.formBuilder.group({
      chkPoemLive: true,
      chkOnlyOpeningHour: { value: false, disabled: true }, // false,
      startTimeMon: defaultStartTime,
      endTimeMon: defaultEndTime,
      startTimeTue: defaultStartTime,
      endTimeTue: defaultEndTime,
      startTimeWed: defaultStartTime,
      endTimeWed: defaultEndTime,
      startTimeThu: defaultStartTime,
      endTimeThu: defaultEndTime,
      startTimeFri: defaultStartTime,
      endTimeFri: defaultEndTime,
      startTimeSat: defaultStartTime,
      endTimeSat: defaultEndTime,
      startTimeSun: defaultStartTime,
      endTimeSun: defaultEndTime,
      website: { value: null, disabled: true }, //null,
      description: { value: null, disabled: true }, //null,
      nfcDiscount: { value: [10, [Validators.min(0), Validators.max(100)]], disabled: true},
    });

    this.formSetting.get('chkOnlyOpeningHour').valueChanges
    .pipe(takeWhile(() => this.componentAlive))
    .subscribe(value => {
      if (value) {
        this.weeks.forEach(week => {
          const weekName = week.name
          this.formSetting.get(`startTime${weekName}`).enable();
          this.formSetting.get(`endTime${weekName}`).enable();
        })
      } else {
        this.weeks.forEach(week => {
          const weekName = week.name
          this.formSetting.get(`startTime${weekName}`).disable();
          this.formSetting.get(`endTime${weekName}`).disable();
        })
      }
    })

    // this.formSetting.disable()

    // Load venue setting
    this.venueService
        .getVenueSetting(this.venue.key)
        .valueChanges()
        .subscribe(result => {
          console.log(result)
          // this.formSetting.enable()
          if (!result) { return }

          this.formSetting.get('chkPoemLive').setValue(result['isPoemLive'] || true)
          this.formSetting.get('chkOnlyOpeningHour').setValue(result['isOnlyOpeningHours'] || false)
          this.formSetting.get('nfcDiscount').setValue(result['nfcDiscount'])
          const weekSetting = result['week']
          if (weekSetting) {

            this.weeks.forEach(week => {
              const daySetting = weekSetting[week.id]
              const weekName = week.name
              if (daySetting) {
                this.formSetting.get(`startTime${weekName}`).setValue(daySetting.start || defaultStartTime);
                this.formSetting.get(`endTime${weekName}`).setValue(daySetting.end || defaultEndTime);      
              }
            })
            
          }
          this.formSetting.get('website').setValue(result['website'])
          this.formSetting.get('description').setValue(result['description'])
        })
  }

  /**
   * On component destroy
   *
   * @memberof VenueSettingComponent
   */
  ngOnDestroy() {
    this.componentAlive = false;
  }
  
  /**
   * Room create function
   *
   * @param {any} payload
   * @param {boolean} isValid
   * @memberof VenueSettingComponent
   */
  public save(payload: any, isValid: boolean) {
    console.log(payload)
    if (isValid) {

      this.isLoading = true

      var setting = {}
      setting['isPoemLive'] = payload.chkPoemLive
      setting['isOnlyOpeningHours'] = payload.chkOnlyOpeningHour
      setting['nfcDiscount'] = payload.nfcDiscount
      if (payload.chkOnlyOpeningHour === true) {
        var weekSetting = {}
        this.weeks.forEach(week => {
          weekSetting[week.id] = {
            start: payload[`startTime${week.name}`],
            end: payload[`endTime${week.name}`]
          }
        })
        setting['week'] = weekSetting
      }
      setting['website'] = payload.website
      setting['description'] = payload.description

      const updateSettingTask = this.venueService.updateVenueSetting(setting, this.venue.key)

      var venue = {
        website: payload.website || '',
        description: payload.description || ''
      }

      const updateVenueTask = this.venueService.updateVenue(venue, this.venue.key)

      Promise.all([updateSettingTask, updateVenueTask]).then(result => {
        this.isLoading = false
        this.bsModalRef.hide()
      }, error => {
        this.error$.next(error)
        this.isLoading = false
      })

    }
  }

}
