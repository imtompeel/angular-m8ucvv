import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { BehaviorSubject } from 'rxjs';

import { StorageService } from '@app/core/services/storage.service';
import { SourceMapGenerator } from '@angular/compiler/src/output/source_map';

export declare type AttachFileType = 'image' | 'music';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})

export class UploaderComponent implements OnInit, OnChanges {

  public fileBlob$ = new BehaviorSubject(null);
  public fileList$ = new BehaviorSubject(null);

  @Input()
  public data: any;

  @Input()
  public fileType: AttachFileType;

  @Input()
  public fieldName: string;

  @Output()
  uploadComplete: EventEmitter<any>;

  constructor(
    private storageService: StorageService,
    private sanitizer: DomSanitizer
  ) {
    this.uploadComplete = new EventEmitter();
  }

  ngOnInit() {
    
  }

  ngOnChanges() {
  }

  public onChange(fileList: FileList) {
    
    var valid: boolean = false;
    const file = fileList[0];

    // this.uploadComplete.emit(fileList);
    console.log(this.fileType, this.fieldName);
    switch (this.fileType) {
      case 'image':
        if (file.type === 'image/png' || 
            file.type === 'image/jpeg' ||
            file.type === 'image/bmp') {
          if (this.fieldName === 'big-picture') {
            this.storageService.bigPictureBlob = file;
            valid = true;
          } else if (this.fieldName === 'small-picture') {
            this.storageService.smallPictureBlob = file;
            valid = true;
          }
        }
        break;
      case 'music':
        if (file.type === 'audio/mpeg' ||
            file.type === 'audio/mp4' ||
            file.type === 'audio/mp3') {
          if (this.fieldName === 'song') {
            this.storageService.songBlob = file;
            valid = true;
          } else if (this.fieldName === 'haptic') {
            this.storageService.hapticBlob = file;
            valid = true;
          }
        }
        break;
    }
    
    console.log(file, file.size, file.type, file.name);

    if (valid) {
      this.fileList$.next(file);
      this.fileBlob$.next(this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file)));
    }
  }

}
