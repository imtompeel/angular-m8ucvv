import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  public cityId: string = null;

  constructor(
    private db: AngularFireDatabase,
  ) {
  }

  public loadCities() {
    return this.db.list('/owners/festivals');
  }

  public setCurrentCityId(cityId: string) {
    this.cityId = cityId;
    return localStorage.setItem('overhearCityId', cityId);
  }

  public currentCityId(): string {
    return localStorage.getItem('overhearCityId');
  }

  public currentCityInfo() {
    const cityId = this.currentCityId();
    if (cityId) {
      return this.db.object(`/owners/festivals/${cityId}`).valueChanges();
    } else {
      return null;
    }
  }

  public createCity(data: any, cityId: string) {
    if (cityId) {
      return this.db.object(`/owners/festivals/${cityId}`).set(data);
    } else {
      return this.db.list(`/owners/festivals`).push(data);
    }
  }

  public updateCity(data: any, cityId: string) {
    if (cityId) {
      this.db.object(`/owners/festivals/${cityId}`).update(data);
    }
  }

  public deleteCity(cityId: string) {
    this.db.object(`/owners/festivals/${cityId}`).set(null);
  }
}
