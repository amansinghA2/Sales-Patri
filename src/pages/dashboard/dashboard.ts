import { NotificationsPage } from './../notifications/notifications';
import { Storage } from '@ionic/storage';
import { Globals } from './../../app/globals';
import { AppModule } from './../../app/app.module';
import { Component, NgModule, OnInit } from '@angular/core';
import { NavController, Platform, MenuController, Events } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { MeetinginfoPage } from '../meetinginfo/meetinginfo';
import moment from 'moment';
import { Observable } from 'rxjs/Rx';


@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})

export class DashboardPage implements OnInit {

  objectKeys = Object.keys;

  tab1: any;
  tab2: any;


  recordsArray = [];
  totalArray = [];
  recordsList = [];
  totalRecords = [];
  presentList: any;
  attendedList: any;
  totalPresent: any;
  totalAttended: any;
  whichList = 0;
  myDateFrom: string;
  myDateTo: string;
  currenTime: any;
  options;
  setmyDateFrom: string;
  setmyDateTo: string;
  listOptionColor;
  isnotificationseen: any;

  clickList: Array<{ pgn: number, icon: string, title: string, color: string, count: number }>;
  whichtypeArray = ["L", "F", "D", "G", "S", "Q"];
  listStatus = ['SCHEDULED', 'MISSED', 'COMPLETED'];
  countArray = [];
  pgn = 0;
  notificationList: any;
  sourceListArray: any;
  notificationCount = 0;

  constructor(private platform: Platform, public sqlite: SQLite, public navCtrl: NavController, public globals: Globals, public storage: Storage, public menu: MenuController, public events: Events) {

  }

  ngOnInit() {

    this.notificationFunction();

    this.clickList = [
      { pgn: 0, icon: 'fas fa-universal-access fa-1xx', title: 'All', color: 'black', count: 0 },
      { pgn: 1, icon: 'fas fa-handshake fa-1xx', title: 'Meetings', color: 'gray', count: 0 },
      { pgn: 2, icon: 'fas fa-mobile-alt fa-1xx', title: 'Calls', color: 'gray', count: 0 },
      { pgn: 3, icon: 'fas fa-list-ol fa-1xx', title: 'To Do', color: 'gray', count: 0 },
      { pgn: 4, icon: 'fas fa-edit fa-1xx', title: 'Pending', color: 'gray', count: 0 }
    ];

    this.options = "myschedule";

    this.myDateFrom = moment.utc().local().format('YYYY-MM-DDTHH:mm:ssZ');
    this.myDateTo = moment.utc().local().format('YYYY-MM-DDTHH:mm:ssZ');


    this.setmyDateFrom = moment.utc().local().format('YYYY-MM-DD');   // this.globals.getDate(this.myDateFrom, 'dd/MM/yyyy');
    this.setmyDateTo = moment.utc().local().format('YYYY-MM-DD');

    Observable.interval(1000 * 5).subscribe(x => {

      this.countDataFunction();

    });

    this.selectQuery(0);

  }

  showNotifications() {
    this.navCtrl.push(NotificationsPage);
  }

  allDataList(list) {
    
    this.whichList = list.pgn;
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

    var date = this.globals.getDate(new Date().toISOString(), 'dd/MM/yyyy') + "    " + this.globals.getDate(new Date().toISOString(), 'HH:mm');

    var sql;
    if (list == 0) {
      sql = 'SELECT * from ' + this.globals.m_Activities + " where activity_date_time >= '" + this.setmyDateFrom + "' and activity_date_time <= '" + this.setmyDateTo + "' ORDER BY activity_created_on DESC ;";
    } else if (list == 1) {
      sql = "SELECT *  from " + this.globals.m_Activities + " where activity_type = 'Meeting' and activity_date_time >= '" + this.setmyDateFrom + "' and activity_date_time <= '" + this.setmyDateTo + "' ORDER BY activity_created_on DESC ;";
    } else if (list == 2) {
      sql = "SELECT *  from " + this.globals.m_Activities + " where activity_type = 'Call' and activity_date_time >= '" + this.setmyDateFrom + "' and activity_date_time <= '" + this.setmyDateTo + "' ORDER BY activity_created_on DESC ;";
    } else if (list == 3) {
      sql = "SELECT *  from " + this.globals.m_Activities + " where activity_type = 'To-Do' and activity_date_time >= '" + this.setmyDateFrom + "' and activity_date_time <= '" + this.setmyDateTo + "' ORDER BY activity_created_on DESC ;";
    } else if (list == 4) {
      sql = 'SELECT * from ' + this.globals.m_Activities + " where activity_date_time >= '" + this.setmyDateFrom + "' and activity_date_time <= '" + this.setmyDateTo + "' ORDER BY activity_created_on DESC ;";
    }

    var sql1 = 'SELECT * from ' + this.globals.m_Activities + " where activity_date_time >= '" + this.setmyDateFrom + "' and activity_date_time <= '" + this.setmyDateTo + "' ORDER BY activity_created_on DESC ;";

    this.recordsArray = this.globals.selectTables(sql);
    this.totalArray = this.globals.selectTables(sql1);

    var totalpresentsql = 'SELECT count(*) as activity_type_count from ' + this.globals.m_Activities + " where activity_date_time >= '" + this.setmyDateFrom + "' and activity_date_time <= '" + this.setmyDateTo + "' and next_activity_id == '';";
    var presentlistsql = 'SELECT count(*) as activity_type_count,activity_scheduled_type from ' + this.globals.m_Activities + " where activity_date_time >= '" + this.setmyDateFrom + "' and activity_date_time <= '" + this.setmyDateTo + "' and next_activity_id == '' GROUP BY activity_scheduled_type ;";
    var attendedTotalsql = 'SELECT count(*) as activity_type_count from ' + this.globals.m_Activities + " where activity_date_time >= '" + this.setmyDateFrom + "' and activity_date_time <= '" + this.setmyDateTo + "' and  activity_output_type != '' and next_activity_id == '';";
    var attendedlistsql = 'SELECT count(*) as activity_type_count,activity_scheduled_type from ' + this.globals.m_Activities + " where activity_date_time >= '" + this.setmyDateFrom + "' and activity_date_time <= '" + this.setmyDateTo + "' and  activity_output_type != '' and next_activity_id == '' GROUP BY activity_scheduled_type ;";

    this.totalPresent = this.globals.selectTables(totalpresentsql);
    this.presentList = this.globals.selectTables(presentlistsql);
    this.totalAttended = this.globals.selectTables(attendedTotalsql);
    this.attendedList = this.globals.selectTables(attendedlistsql);

    setTimeout(() => {
      this.countDataFunction();
    }, 250);

  }

  countDataFunction() {

    this.currenTime = this.globals.getDate(moment.utc().local().format('YYYY-MM-DDTHH:mm:ssZ'), 'dd/MM/yyyy') + "    " + this.globals.getDate(moment.utc().local().format('YYYY-MM-DDTHH:mm:ssZ'), 'HH:mm');

    this.recordsList = this.recordsArray;
    this.totalRecords = this.totalArray;

    var cnt1 = 0;
    var cnt2 = 0;
    var cnt3 = 0;

    for (var i = 0; i < this.recordsList.length; i++) {

      if (this.recordsList[i]['activity_output_end_datetime'] > this.currenTime && this.recordsList[i]['next_activity_id'] == '' && (this.recordsList[i]['activity_status'] == 'OPEN' || this.recordsList[i]['activity_status'] == 'POSTPONE')) {
        cnt1++;
      } else if (this.recordsList[i]['activity_output_end_datetime'] <= this.currenTime && this.recordsList[i]['next_activity_id'] == '' && (this.recordsList[i]['activity_status'] == 'OPEN' || this.recordsList[i]['activity_status'] == 'POSTPONE')) {
        cnt2++;
      } else if (this.recordsList[i]['activity_output_type'] != '' && (this.recordsList[i]['activity_status'] == 'CANCEL' || this.recordsList[i]['activity_status'] == 'ATTENDED')) {
        cnt3++;
      }

    }

    this.countArray = [cnt1, cnt2, cnt3];

    this.clickList[0]['count'] = 0;
    this.clickList[1]['count'] = 0;
    this.clickList[2]['count'] = 0;
    this.clickList[3]['count'] = 0;
    this.clickList[4]['count'] = 0;

    for (var i = 0; i < this.totalRecords.length; i++) {

      if (this.totalRecords[i]['activity_date_time'] >= this.setmyDateFrom && this.totalRecords[i]['activity_date_time'] <= this.setmyDateTo && this.totalRecords[i]['activity_status'] != 'ATTENDED') {
        this.clickList[0]['count']++;
      }
      if (this.totalRecords[i]['activity_date_time'] >= this.setmyDateFrom && this.totalRecords[i]['activity_date_time'] <= this.setmyDateTo && this.totalRecords[i]['activity_type'] == 'Meeting' && this.totalRecords[i]['activity_status'] != 'ATTENDED') {
        this.clickList[1]['count']++;
      }
      if (this.totalRecords[i]['activity_date_time'] >= this.setmyDateFrom && this.totalRecords[i]['activity_date_time'] <= this.setmyDateTo && this.totalRecords[i]['activity_type'] == 'Call' && this.totalRecords[i]['activity_status'] != 'ATTENDED') {
        this.clickList[2]['count']++;
      }
      if (this.totalRecords[i]['activity_date_time'] >= this.setmyDateFrom && this.totalRecords[i]['activity_date_time'] <= this.setmyDateTo && this.totalRecords[i]['activity_type'] == 'To-Do' && this.totalRecords[i]['activity_status'] != 'ATTENDED') {
        this.clickList[3]['count']++;
      }
      if (this.totalRecords[i]['activity_output_end_datetime'] <= this.currenTime && this.totalRecords[i]['next_activity_id'] == '' && (this.totalRecords[i].activity_status == 'OPEN' || this.totalRecords[i].activity_status == 'POSTPONE')) {
        this.clickList[4]['count']++;
      }

    }



  }

  fromDateData() {
    this.setmyDateFrom = moment.utc(this.myDateFrom).local().format('YYYY-MM-DD');   //this.globals.getDate(this.myDateFrom, 'dd/MM/yyyy');
    if (this.setmyDateFrom > this.setmyDateTo) {
      this.myDateTo = this.myDateFrom;
    }

    this.selectQuery(this.whichList);
  }

  toDateData() {
    this.setmyDateTo = this.globals.getDate(this.myDateTo, 'dd/MM/yyyy');
    this.selectQuery(this.whichList);
  }

  notificationFunction() {
    var sql = 'SELECT * from ' + this.globals.m_Notifications;
    this.notificationList = this.globals.selectTables(sql);

    setTimeout(() => {
      this.storage.get('isseennotification').then((val) => {
        this.isnotificationseen = val;
      })

      console.log(JSON.stringify(this.notificationList));

      for (let i = 0; i < this.notificationList.length; i++) {
        // this.notificationList[i]['notification_isread'] == '1';
        // 'notification_isread':'0'  , 'notification_activitytype': 'Meeting'
        if (this.notificationList[i]['notification_isread'] == '0') {
          this.notificationCount++;
        }

      }
    }, 200);
  }


  itemClicked(item) {
    this.navCtrl.push(MeetinginfoPage, { item });
  }

  lastCallDetails() {

  }


}

