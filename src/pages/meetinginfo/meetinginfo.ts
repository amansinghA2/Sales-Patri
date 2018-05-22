import { Globals } from './../../app/globals';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MeetingupdatePage } from '../meetingupdate/meetingupdate';
import { NotificationsPage } from './../notifications/notifications';


/**
 * Generated class for the MeetinginfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-meetinginfo',
  templateUrl: 'meetinginfo.html',
})
export class MeetinginfoPage {

  item: any;
  meetinginfolist = [];
  notificationList:any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public globals: Globals) {

   
    this.item = this.navParams.get('item');

    setTimeout(() => {
      console.log(JSON.stringify(this.item));
    }, 3000);

    var sql = 'SELECT * from ' + this.globals.m_Notifications;
    this.notificationList = this.globals.selectTables(sql);

  }

  ionViewDidLoad() {

    var sql = "SELECT * from " + this.globals.m_Activities + " where next_activity_id == " + this.item['id'] + " or contact_id == " + this.item['contact_id'];

    if(this.meetinginfolist.length > 0){
      this.meetinginfolist = this.globals.selectTables(sql);

      setTimeout(() => {
        console.log("nextactivity" + JSON.stringify(this.meetinginfolist));
      }, 3000);

    }




    console.log('ionViewDidLoad MeetinginfoPage');
  }

  updateMeeting() {
    var item = this.item;
    this.navCtrl.push(MeetingupdatePage, { item });
  }

  showNotifications() {
    this.navCtrl.push(NotificationsPage);
  }


}
