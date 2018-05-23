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

  notificationList: any;
  leadListArray = [];
  selectedLeadLIstArray = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public globals: Globals) {

    var sql = 'SELECT * from ' + this.globals.m_Notifications;
    this.notificationList = this.globals.selectTables(sql);

    var sql = 'SELECT * from ' + this.globals.m_Lead_Master;
    this.leadListArray = this.globals.selectTables(sql);;

    this.selectedLeadLIstArray = this.leadListArray;

  }

  showNotifications() {
    this.navCtrl.push(NotificationsPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LeadlistPage');
  }


  updateSubtypeSearchResult(ev: any) {

    var sql = 'SELECT * from ' + this.globals.m_Lead_Master;
    this.leadListArray = this.globals.selectTables(sql);

    setTimeout(() => {

      this.selectedLeadLIstArray = this.leadListArray;

      let val = ev.target.value;

      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
        // this.showListsubtype = true;
        this.selectedLeadLIstArray = this.selectedLeadLIstArray.filter((item) => {
          return (item['name'].toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      } else {
        // this.showListsubtype = false;
      }

    }, 100);

  }


  leadClicked(item) {
    this.navCtrl.push(LeadinfoPage, { val: item });
  }


}
