import { NotificationsPage } from './../notifications/notifications';
import { Globals } from './../../app/globals';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the LeadinfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-leadinfo',
  templateUrl: 'leadinfo.html',
})
export class LeadinfoPage {

  notificationList:any;
  item:any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams , public globals:Globals) {

    var sql = 'SELECT * from ' + this.globals.m_Notifications;
    this.notificationList = this.globals.selectTables(sql);

    this.item = this.navParams.get('val');

    setTimeout(() => {
      console.log("HEllzxc"+ JSON.stringify(this.item));
    }, 1000);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LeadinfoPage');
  }

  showNotifications() {
    this.navCtrl.push(NotificationsPage);
  }

}
