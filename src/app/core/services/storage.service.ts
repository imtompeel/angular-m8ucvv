import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { CityService } from './city.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  /**
   * Big Picture file blob
   */
  public bigPictureBlob: any = null;

  /**
   * Smapp Picture file blob
   */
  public smallPictureBlob: any = null;

  /**
   * Song file blob by mp3 file type
   */
  public songBlob: any = null;

  /**
   * Haptic sound file blob by mp3 file type
   */
  public hapticBlob: any = null;

  public cityId: string = '';

  constructor(
    private storage: AngularFireStorage,
    private cityService: CityService,
  ) {
    this.cityId = this.cityService.currentCityId();
  }

  /**
   * Upload all files
   */
  public uploadFiles(
    baseFilename: any
  ) {
    var tasks: AngularFireUploadTask[] = [];

    // Big picture upload task
    if (this.bigPictureBlob) {
      const path = this.bigImageFileFullPath(baseFilename);
      const task = this.storage.ref(path).put(this.bigPictureBlob);
      tasks.push(task);
    }
    // Small picture upload task
    if (this.smallPictureBlob) {
      const path = this.smallImageFileFullPath(baseFilename);
      const task = this.storage.ref(path).put(this.smallPictureBlob);
      tasks.push(task);
    }
    // Song file upload task
    if (this.songBlob) {
      const path = this.songFileFullPath(baseFilename);
      const task = this.storage.ref(path).put(this.songBlob);
      tasks.push(task);
    }
    // Haptic sound file upload task
    if (this.hapticBlob) {
      const path = this.hapticFileFullPath(baseFilename);
      const task = this.storage.ref(path).put(this.hapticBlob);
      tasks.push(task);
    }

    return Promise.all(tasks).then(res => {
      return res;
    })
  }

  public bigImageFileFullPath(baseFilename: any): string {
    if (this.bigPictureBlob) {
      return `images/big/${baseFilename + this.bigPictureBlob.name}`;
    } else {
      return '';
    }
  }
  public smallImageFileFullPath(baseFilename: any): string {
    if (this.smallPictureBlob) {
      return `images/small/${baseFilename + this.smallPictureBlob.name}`;
    } else {
      return '';
    }
  }
  public songFileFullPath(baseFilename: any): string {
    if (this.songBlob) {
      return `${this.cityId}/poems/${baseFilename + this.songBlob.name}`;
    } else {
      return '';
    }
  }
  public hapticFileFullPath(baseFilename: any): string {
    if (this.hapticBlob) {
      return `${this.cityId}/haptic/${baseFilename + this.hapticBlob.name}`;
    } else {
      return '';
    }
  }

  public deleteFile(path: string): Promise<any> {
    if (path.length > 0) {
      return this.storage.ref(path).delete().toPromise();
    } else {
      return null;
    }
  }

}
