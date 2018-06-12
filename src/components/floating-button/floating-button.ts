import { Globals } from './../../app/globals';
import { SchedulecallPage } from './../../pages/schedulecall/schedulecall';
import { MeetingPage } from './../../pages/meeting/meeting';
import { MeetinginfoPage } from './../../pages/meetinginfo/meetinginfo';
import { NavController, ModalController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FabContainer } from 'ionic-angular';
import { TodoitemPage } from './../../pages/todoitem/todoitem';
import { AddprojectPage } from './../../pages/addproject/addproject';

/**
 * Generated class for the FloatingButtonComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'floating-button',
  templateUrl: 'floating-button.html'
})
export class FloatingButtonComponent {

  constructor(public navCtrl:NavController , public modalCtrl: ModalController , public globals:Globals) {
    console.log('Hello FloatingButtonComponent Component');

  }

  add(whichadd: string, fab: FabContainer) {
  
    switch (whichadd){
      case 'meeting':
      // this.modalPage(MeetingPage);
      this.navCtrl.push(MeetingPage);
      break;
      case 'call':
      // this.modalPage(SchedulecallPage);
      this.navCtrl.push(SchedulecallPage);
      break;
      case 'todo':
      // this.modalPage(TodoitemPage);
      this.navCtrl.push(TodoitemPage);
      break;
      case 'addproject':
      // this.modalPage(TodoitemPage);
      this.navCtrl.push(AddprojectPage);
      break;
    }

  }

  modalPage(page:any){
    this.globals.profileModal = this.modalCtrl.create(page);
    this.globals.profileModal.present();
  }



}
