import { NotificationsPage } from './../notifications/notifications';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Globals } from '../../app/globals';

/**
 * Generated class for the SourceinfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sourceinfo',
  templateUrl: 'sourceinfo.html',
})
export class SourceinfoPage {

  notificationList:any;
  sourceInfoListArray = [];
  item:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public globals:Globals) {
  
    var sql = 'SELECT * from ' + this.globals.m_Notifications;
    this.notificationList = this.globals.selectTables(sql);

      this.item = this.navParams.get('val');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SourceinfoPage');
  }

  showNotifications() {
    this.navCtrl.push(NotificationsPage);
  }

}
