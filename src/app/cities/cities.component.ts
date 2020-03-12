import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { CityService } from '@app/core/services/city.service';
import { CityCreateComponent } from './shared/city-create/city-create.component';
import { CityUpdateComponent } from './shared/city-update/city-update.component';
import { CityDeleteComponent } from './shared/city-delete/city-delete.component';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})
export class CitiesComponent implements OnInit, OnDestroy {

  /**
 * bsModalRef property
 *
 * @type {BsModalRef}
 * @memberof VenuesListComponent
 */
  public bsModalRef: BsModalRef;

  /**
   * componentAlive property
   *
   * @private
   * @memberof CitiesComponent
   */
  private componentAlive = true;

  /**
   * Array of cities 
   */
  public cities: Array<any> = [];

  constructor(
    private cityService: CityService,
    private modalService: BsModalService,

  ) { }

  ngOnInit() {
    this.cityService
      .loadCities()
      .snapshotChanges(['child_added', 'child_changed', 'child_removed'])
      .subscribe(actions => {
        this.cities = []
        actions.forEach(action => {
          var city = action.payload.val() as any
          city['key'] = action.key
          if (city['isAvailable'] === undefined) {
            city['isAvailable'] = true;
          }
          this.cities.push(city);
        })
      });
  }

  ngOnDestroy() {
    this.componentAlive = false;
  }

  onChangeAvailableCity(event: any, city: any, isChecked: boolean) {
    const update = {
      isAvailable: isChecked
    };
    this.cityService.updateCity(update, city.key);
  }

  /**
 * Show modal create
 *
 * @memberof VenuesListComponent
 */
  public showModalCreate() {
    this.bsModalRef = this.modalService.show(CityCreateComponent, {
      class: 'fade-left modal-dialog-tall modal-dialog-right'
    });
  }

  /**
   * Show modal update
   *
   * @param {VenueModel} room
   * @memberof VenuesListComponent
   */
  public showModalUpdate(city: any) {
    this.bsModalRef = this.modalService.show(CityUpdateComponent, {
      class: 'fade-left modal-dialog-tall modal-dialog-right',
      initialState: {
        city: city
      }
    });
  }

  /**
   * Show modal delete
   *
   * @param {VenueModel} room
   * @memberof VenuesListComponent
   */
  public showModalDelete(city: any) {
    this.bsModalRef = this.modalService.show(CityDeleteComponent, {
      class: 'fade-down modal-sm',
      initialState: {
        city: city
      }
    });
  }

}
