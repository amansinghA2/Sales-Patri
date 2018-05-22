import { NotificationsPage } from './../notifications/notifications';
import { LeadinfoPage } from './../leadinfo/leadinfo';
import { Globals } from './../../app/globals';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the LeadlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-leadlist',
  templateUrl: 'leadlist.html',
})
export class LeadlistPage {

  notificationList:any;
  leadListArray = [];

  constructor(public navCtrl: NavController, public navParams: NavParams , public globals:Globals) {

    var sql = 'SELECT * from ' + this.globals.m_Notifications;
      this.notificationList = this.globals.selectTables(sql);

      var sql = 'SELECT * from ' + this.globals.m_Lead_Master;
      this.leadListArray = this.globals.selectTables(sql);
;

  }

  showNotifications() {
    this.navCtrl.push(NotificationsPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LeadlistPage');
  }


  leadClicked(item){
      this.navCtrl.push(LeadinfoPage , {val: item});
  }


}
