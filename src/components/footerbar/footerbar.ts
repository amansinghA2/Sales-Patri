import { SourcelistPage } from './../../pages/sourcelist/sourcelist';
import { GoalsPage } from './../../pages/goals/goals';
import { Globals } from './../../app/globals';
import { MeetingPage } from './../../pages/meeting/meeting';
import { Component } from '@angular/core';
import { NavController, ModalController, Events } from 'ionic-angular';
import { DashboardPage } from '../../pages/dashboard/dashboard';
import { MapPage } from '../../pages/map/map';
import { LeadlistPage } from '../../pages/leadlist/leadlist';

/**
 * Generated class for the FooterbarComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

@Component({
  selector: 'footerbar',
  templateUrl: 'footerbar.html'
})
export class FooterbarComponent {

  optionsList:Array<{pgn: string , icon :string ,badge:string , color:string , iconselected:string }>;

  constructor(public navCtrl:NavController , public modalCtrl: ModalController , public globals:Globals,public events:Events) {

    this.optionsList = [
      { pgn: 'Home', icon: 'assets/imgs/home_footer.png', badge: 'All' ,color: 'red' , iconselected:'assets/imgs/home_footer_selected.png'},
      { pgn: 'L', icon: 'assets/imgs/L_footer.png', badge: 'Meetings' ,color: 'black' , iconselected:'assets/imgs/L_footer_selected.png'},
      { pgn: 'F', icon: 'assets/imgs/F_footer.png', badge: 'Calls' ,color: 'black', iconselected:'assets/imgs/F_footer_selected.png'},
      { pgn: 'D',  icon: 'assets/imgs/D_footer.png', badge:  'To Do' ,color: 'black', iconselected:'assets/imgs/D_footer_selected.png'},
      { pgn: 'G', icon: 'assets/imgs/G_footer.png', badge: 'Pending' ,color:'black', iconselected:'assets/imgs/G_footer_selected.png'},
      { pgn: 'S',  icon: 'assets/imgs/S_footer.png', badge:  'To Do' ,color: 'black', iconselected:'assets/imgs/S_footer_selected.png'},
      { pgn: 'Q', icon: 'assets/imgs/Q_footer.png', badge: 'Pending' ,color:'black', iconselected:'assets/imgs/Q_footer_selected.png'},
      { pgn: 'Map', icon: 'assets/imgs/map_footer.png', badge: 'Pending' ,color:'black', iconselected:'assets/imgs/map_footer.png'},
    ]; 

    for(var i = 0 ; i < this.optionsList.length ; i++){

      if (this.globals.footerSelectedItem == this.optionsList[i].pgn){
        this.optionsList[i].icon = this.optionsList[i].iconselected;
      }else{
        // this.optionsList[i].color = 'black';
      }

    }


  }

  modalPage(page:any){
    this.globals.profileModal = this.modalCtrl.create(page);
    this.globals.profileModal.present();
  }


  allOptionsList(list) {

    this.globals.footerSelectedItem = list.pgn;

    switch (list.pgn) {
      case 'Home':
      // this.modalPage(DashboardPage);
      this.navCtrl.push(DashboardPage);
      break;
      case 'L':
      // this.modalPage(MeetingPage);
      this.navCtrl.push(LeadlistPage);
      break;
      case 'F':
      // this.modalPage(MeetingPage);
      break;
      case 'D':
      // this.modalPage(MeetingPage);
      break;
      case 'G':
      // this.modalPage(GoalsPage);
      this.navCtrl.push(GoalsPage);
      break;
      case 'S':
      // this.modalPage(SourcelistPage);
      this.navCtrl.push(SourcelistPage);
      break;
      case 'Q':
      // this.modalPage(MeetingPage);
      break;
      case 'Map':
       this.navCtrl.push(MapPage);
      break;

    }

 

  

  }


}
