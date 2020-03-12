import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database'
import { CityService } from './city.service';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VenueService {

  constructor(
    private db: AngularFireDatabase,
    private cityService: CityService
  ) {
  }

  private cityId(): string {
    return this.cityService.currentCityId()
  }

  /**
   * Load all venues from provided city
   * 
   * @param city City id
   */
  public loadVenues(city: string) {
    return this.db.list(`/venues/${city}`, ref =>
      ref.orderByChild('deleted').equalTo(null));
  }

  /**
   * Add songid to speicified venue
   * 
   * @param venueId venue id
   * @param songId song id
   */
  public addSongIdToVenue(venueId: string, songId: string) {
    const path: string = `/venues/${this.cityId()}/${venueId}`;
    this.db.object(path).valueChanges().subscribe(action => {
      var recordings: string[] = action['recordings'] || [];
      const idx = recordings.indexOf(songId);
      if (idx < 0) {
        recordings.push(songId);
        this.db.object(path).update({ recordings: recordings });
      }
    })
  }

  /**
   * Remove songId from speicified venue
   * 
   * @param venueId venue id
   * @param songId song id
   */
  public removeSongIdFromVenue(venueId: string, songId: string) {
    const path: string = `/venues/${this.cityId()}/${venueId}`;
    this.db.object(path).valueChanges().subscribe(action => {
      var recordings: string[] = action['recordings'] || [];
      const idx = recordings.indexOf(songId);
      if (idx >= 0) {
        recordings.splice(idx, 1);
        this.db.object(path).update({ recordings: recordings })
      }
    });
  }

  /**
   * Create a new Venue
   * 
   * @param venue Venue object
   * @param venueId Veneu unique identifier or null
   */
  public createVenue(venue: any, venueId: string) {
    this.updateVersionNumber()
    if (venueId === null) {
      return this.db.list(`/venues/${this.cityId()}`).push(venue).key
    } else {
      this.db.object(`/venues/${this.cityId()}/${venueId}`).set(venue)
      return venueId;
    }
  }

  /**
   * Update venue information
   * 
   * @param venue Venue object
   * @param venueId VenueId for updating
   */
  public updateVenue(venue: any, venueId: string) {
    this.updateVersionNumber()
    return this.db.object(`/venues/${this.cityId()}/${venueId}`).update(venue)
  }

  /**
   * Delete a venue
   * 
   * @param venueId VenueId for deleting
   */
  public deleteVenue(venueId: string) {
    this.updateVersionNumber()
    const deleteVenueTask = this.db.object(`/venues/${this.cityId()}/${venueId}`).update({ deleted: true })
    const deleteVenueSettingTask = this.db.object(`/venueSettings/${venueId}`).update({ deleted: true })
    return Promise.all([deleteVenueTask, deleteVenueSettingTask])
  }

  public updateVersionNumber() {
    var versionNumber = 0
    const cityId = this.cityId()

    this.db.object(`/venues/${cityId}/versionnumber`)
      .valueChanges()
      .pipe(take(1))
      .subscribe(res => {
        if (res !== null && typeof res === "number") {
          versionNumber = res + 1
        }

        return this.db.object(`/venues/${cityId}`).update({ versionnumber: versionNumber })
      });
  }

  /**
   * Update Venue setting
   * 
   * @param setting Setting options
   * @param venueId Venue key
   */
  public updateVenueSetting(setting: any, venueId: string) {
    return this.db.object(`/venueSettings/${venueId}`).update(setting)
    // return this.db.object(`/venues/${this.cityId()}/${venueId}/setting/`).update(setting)
  }

  /**
   * Get venue setting
   * 
   * @param venueId Venue key
   */
  public getVenueSetting(venueId: string) {
    return this.db.object(`/venueSettings/${venueId}`)
  }

  /**
 * Get donload logs
 * 
 * @param venueId Venue key
 */
  public getVenueDownloadLogs(cityId: string) {
    return this.db.list(`/downloadlog/${cityId}`)
  }

  /**
   * Update Venue Administrator
   * 
   * @param venueId Venue key
   * @param venueName Venue name
   * @param email Owner email
   */
  public updateVenueOwner(venueId: string, venueName: string, email: string) {
    const setting = {
      name: venueName,
      owner: email,
      cityId: this.cityId()
    }
    return this.db.object(`owners/venues/${venueId}`).update(setting)
  }

  public getVenueAndOwners() {
    return this.db.list('owners/venues')
  }

  public currentVenueId(): string {
    return localStorage.getItem('overhearVenueId')
  }

  public currentVenueInfo() {
    const venueId = this.currentVenueId()
    if (venueId) {
      return this.db.object(`/owners/venues/${venueId}`).valueChanges()
    } else {
      return null
    }
  }

}
