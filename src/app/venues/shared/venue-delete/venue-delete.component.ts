import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { BehaviorSubject, Subscription } from 'rxjs';

import { VenueService } from '@app/core/services/venue.service';

import { StorageService } from '@app/core/services/storage.service';

@Component({
  selector: 'app-venue-delete',
  templateUrl: './venue-delete.component.html'
})
export class VenueDeleteComponent implements OnInit, OnDestroy {

  /**
   * room property
   *
   * @type {any}
   * @memberof VenueDeleteComponent
   */
  public venue: any;

  /**
   * formDelete property
   *
   * @type {FormGroup}
   * @memberof VenueDeleteComponent
   */
  public formDelete: FormGroup;

  /**
   * isLoading property
   *
   * @type {Boolean}
   * @memberof VenueDeleteComponent
   */
  public isLoading: Boolean = false;

  /**
   * error$ property
   *
   * @memberof VenueDeleteComponent
   */
  public error$ = new BehaviorSubject(null);

  /**
   * Creates an instance of VenueDeleteComponent
   *
   * @param {BsModalRef} bsModalRef
   * @param {FormBuilder} formBuilder
   * @param {VenueService} venueService
   * @memberof VenueDeleteComponent
   */
  constructor(
    public bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private venueService: VenueService,
    private storageService: StorageService
  ) { }

  /**
   * On component initialize
   *
   * @memberof VenueDeleteComponent
   */
  ngOnInit() {
    this.formDelete = this.formBuilder.group({
      id: [this.venue.key, Validators.required],
      name: this.venue.name
    });
  }

  /**
   * On component destroy
   *
   * @memberof VenueDeleteComponent
   */
  ngOnDestroy() {
  }

  /**
   * Room delete function
   *
   * @param {number} roomId
   * @param {boolean} isValid
   * @memberof VenueDeleteComponent
   */
  public delete(roomId: number, isValid: boolean) {
   this.isLoading = true;

    if (isValid) {

      this.venueService.deleteVenue(this.venue.key).then(result => {
        this.isLoading = false;
        this.bsModalRef.hide();
      }, error => {
        this.isLoading = false;
        this.error$.next(error);
      })

      /*
      var deleteTasks: Promise<any>[] = [];
    
      // Big picture file path
      const bigPicturePath = this.venue.imagebig;
      if (bigPicturePath) {
        const task = this.storageService.deleteFile(bigPicturePath);
        deleteTasks.push(task);
      }

      // Small picture file path
      const smallPicturePath = this.venue.imagesmall;
      if (smallPicturePath) {
        const task = this.storageService.deleteFile(smallPicturePath);
        deleteTasks.push(task);
      }

      const deleteArtist = function(it: VenueDeleteComponent) {
        
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
*/
    }
  }

}
