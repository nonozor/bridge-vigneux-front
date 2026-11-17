import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUserToSessionComponent } from './components/add-user-to-session/add-user-to-session.component';
import { DisplayPageUserCardsComponent } from './components/display-page-user-cards/display-page-user-cards.component';
import { DisplayUserCardComponent } from './components/display-user-card/display-user-card.component';
import { HomeComponent } from './components/home/home.component';
import { ScanQRComponent } from './components/scan-qr/scan-qr.component';
import * as $ from 'jquery';
import { QuitComponent } from './components/quit/quit.component';
import { EditUsersComponent } from './components/edit-users/edit-users.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'displayUserCard', component: DisplayUserCardComponent },
    { path: 'displayPageUserCards', component: DisplayPageUserCardsComponent },
    { path: 'addUserToSession/:encrypted', component: AddUserToSessionComponent },
    { path: 'scanQR/:encrypted', component: ScanQRComponent },
    { path: 'quit', component: QuitComponent },
    { path: 'editUsers', component: EditUsersComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
