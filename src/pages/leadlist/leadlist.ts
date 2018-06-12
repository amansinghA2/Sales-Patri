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

  clickList: Array<{ pgn: number, title: string, color: string, count: number }>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public globals: Globals) {

    var sql = 'SELECT * from ' + this.globals.m_Notifications;
    this.notificationList = this.globals.selectTables(sql);

    var sql = 'SELECT * from ' + this.globals.m_Lead_Master;
    this.leadListArray = this.globals.selectTables(sql);


    this.clickList = [
      { pgn: 0, title: 'All', color: 'black', count: 0 },
      { pgn: 1, title: 'New', color: 'gray', count: 0 },
      { pgn: 2, title: 'Pipeline', color: 'gray', count: 0 },
      { pgn: 3, title: 'Ready For Login', color: 'gray', count: 0 },
    ];
    
    setTimeout(() => {
      this.selectedLeadLIstArray = this.leadListArray;
      this.filterCount(this.selectedLeadLIstArray);
      this.selectQuery(0);
    }, 200);
    // this.selectedLeadLIstArray = this.leadListArray;

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

    }, 200);

  }


  leadClicked(item) {
    this.navCtrl.push(LeadinfoPage, { val: item });
  }


  allDataList(list) {

    // this.whichList = list.pgn;
    for (var i = 0; i < this.clickList.length; i++) {
      if (list.pgn == this.clickList[i].pgn) {
        this.clickList[i].color = 'black';
      } else {
        this.clickList[i].color = 'gray';
      }
    }

    this.selectQuery(list.pgn);
  }

  selectQuery(list) {

    this.leadListArray = [];

    var sql;
    if (list == 0) {
      sql = 'SELECT * from ' + this.globals.m_Lead_Master;
    } else if (list == 1) {
      sql = "SELECT *  from " + this.globals.m_Lead_Master + " where lead_status_code = 'F_CLS';";
    } else if (list == 2) {
      sql = "SELECT *  from " + this.globals.m_Lead_Master + " where lead_status_code = 'PIPL'";
    } else if (list == 3) {
      sql = "SELECT *  from " + this.globals.m_Lead_Master + " where lead_status_code = 'REJ'";
    }

    this.leadListArray = this.globals.selectTables(sql);

    setTimeout(() => {
      this.selectedLeadLIstArray = this.leadListArray;
    }, 200);

  }

  filterCount(totalRecords) {

    this.clickList[0]['count'] = 0;
    this.clickList[1]['count'] = 0;
    this.clickList[2]['count'] = 0;
    this.clickList[3]['count'] = 0;

    for (var i = 0; i < totalRecords.length; i++) {
       this.clickList[0]['count']++;
      if (totalRecords[i]['lead_status_code'] == 'F_CLS') {
        this.clickList[1]['count']++;
      } else if (totalRecords[i]['lead_status_code'] == 'PIPL') {
        this.clickList[2]['count']++;
      } else if (totalRecords[i]['lead_status_code'] == 'REJ') {
        this.clickList[3]['count']++;
      } 

    }

  }


}
