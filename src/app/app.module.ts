import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DisplayUserQRComponent } from './components/display-user-qr/display-user-qr.component';
import { QrCodeModule } from 'ng-qrcode';
import { DisplayUserCardComponent } from './components/display-user-card/display-user-card.component';
import { DisplayPageUserCardsComponent } from './components/display-page-user-cards/display-page-user-cards.component';
import { HttpClientModule } from '@angular/common/http';
import { AddUserToSessionComponent } from './components/add-user-to-session/add-user-to-session.component';
import { ScanQRComponent } from './components/scan-qr/scan-qr.component';
import { HomeComponent } from './components/home/home.component';
import * as $ from 'jquery';
import { QuitComponent } from './components/quit/quit.component';
import { httpInterceptorProviders } from './interceptors';
import { EditUsersComponent } from './components/edit-users/edit-users.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { EditableComponent } from './components/editable/editable.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    DisplayUserQRComponent,
    DisplayUserCardComponent,
    DisplayPageUserCardsComponent,
    AddUserToSessionComponent,
    ScanQRComponent,
    HomeComponent,
    QuitComponent,
    EditUsersComponent,
    EditableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    QrCodeModule,
    NgbModule,
    FormsModule
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
