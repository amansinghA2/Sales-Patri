import { NotificationsPage } from './../notifications/notifications';
import { Globals } from './../../app/globals';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the LeaddetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-leaddetails',
  templateUrl: 'leaddetails.html',
})
export class LeaddetailsPage {

  notificationList:any;

  constructor(public navCtrl: NavController, public navParams: NavParams , public globals:Globals) {
  

      var sql = 'SELECT * from ' + this.globals.m_Notifications;
      this.notificationList = this.globals.selectTables(sql);

  }

  showNotifications() {
    this.navCtrl.push(NotificationsPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LeaddetailsPage');
  }

}
