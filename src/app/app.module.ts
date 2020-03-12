import { NgModule } from '@angular/core';

import { AppRoutingModule } from '@app/app.routing';
import { AppComponent } from '@app/app.component';

import { CoreModule } from '@app/core/core.module';
import { SharedModule } from '@app/shared/shared.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularKitsModule } from '@coturiv/angular-kits';

@NgModule({
  imports: [
    CoreModule,
    SharedModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    AngularKitsModule.forRoot()
  ],
  declarations: [
    AppComponent,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
