import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LayoutModule } from '@app/core/layouts/layout.module';
import { GlobalErrorHandler } from '@app/core/handlers/global-error.handler';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
  ],
  providers: [{
    provide: ErrorHandler,
    useClass: GlobalErrorHandler
  }]
})
export class CoreModule { }
