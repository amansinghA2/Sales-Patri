import { NotificationsPage } from './../notifications/notifications';
import { Storage } from '@ionic/storage';
import { Globals } from './../../app/globals';
import { AppModule } from './../../app/app.module';
import { Component, NgModule, OnInit } from '@angular/core';
import { NavController, Platform, MenuController, Events } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { MeetinginfoPage } from '../meetinginfo/meetinginfo';
import moment from 'moment';
import {Observable} from 'rxjs/Rx';


@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})

export class DashboardPage implements OnInit{

  objectKeys = Object.keys;

  tab1: any;
  tab2: any;

  myDate:any;
  myTime:any;
  recordsList = [];
  presentList: any;
  attendedList: any;
  totalPresent: any;
  totalAttended: any;
  whichList = 0;
  myDateFrom: String;
  myDateTo: String;
  myColor: string;
  myColor1: string;
  currenTime:any;
  myColor2: string;
  prods: string[];
  options;
  setmyDateFrom: string;
  setmyDateTo: string;
  listOptionColor;
  minDate: String;
  totalRecords = [];
  isnotificationseen:any;
  countArrayData = [];

  clickList: Array<{ pgn: number, icon: string, title: string, color: string ,count:number}>;
  whichtypeArray = ["L", "F", "D", "G", "S", "Q"];
  listStatus = ['SCHEDULED' , 'MISSED' , 'COMPLETED'];
  countArray = [];
  pgn = 0 ;
  notificationList:any;
  sourceListArray:any;
  notificationCount = 0;

  constructor(private platform: Platform, public sqlite: SQLite, public navCtrl: NavController, public globals: Globals, public storage: Storage, public menu: MenuController,public events:Events) {

    platform.ready().then(() => {

      var sql = 'SELECT * from ' + this.globals.m_Notifications;
      this.notificationList = this.globals.selectTables(sql);

      setTimeout(() => {

        this.storage.get('isseennotification').then((val) => {
          this.isnotificationseen = val;
        })

        console.log(JSON.stringify(this.notificationList));
        
        for(let i = 0 ; i < this.notificationList.length ; i++){
            // this.notificationList[i]['notification_isread'] == '1';
          // 'notification_isread':'0'  , 'notification_activitytype': 'Meeting'
          if(this.notificationList[i]['notification_isread'] == '0'){
              this.notificationCount++;
          }
  
        }


      }, 200);

      this.clickList = [
        { pgn: 0, icon: 'fas fa-universal-access fa-1xx', title: 'All', color: 'black' , count:0},
        { pgn: 1, icon: 'fas fa-handshake fa-1xx', title: 'Meetings', color: 'gray' , count:0},
        { pgn: 2, icon: 'fas fa-mobile-alt fa-1xx', title: 'Calls', color: 'gray' , count:0},
        { pgn: 3, icon: 'fas fa-list-ol fa-1xx', title: 'To Do', color: 'gray' , count:0},
        { pgn: 4, icon: 'fas fa-edit fa-1xx', title: 'Pending', color: 'gray' , count:0}
      ];


   

    });

  }


  ngOnInit(){

    this.options = "myschedule";

    this.myDateFrom = new Date().toISOString();
    this.myDateTo = new Date().toISOString();
    this.minDate = new Date().toISOString();

    this.myDate = moment.utc().local().format('YYYY-MM-DDTHH:mm:ssZ');
    this.myTime = moment.utc().local().format('YYYY-MM-DDTHH:mm:ssZ');

    this.currenTime = this.globals.getDate(this.myDate, 'dd/MM/yyyy') + "    " + this.globals.getDate(this.myTime, 'HH:mm');

    this.setmyDateFrom = this.globals.getDate(this.myDateFrom, 'dd/MM/yyyy');
    this.setmyDateTo = this.globals.getDate(this.myDateTo, 'dd/MM/yyyy');

    Observable.interval(1000 * 5).subscribe(x => {
      this.myDate = moment.utc().local().format('YYYY-MM-DDTHH:mm:ssZ');
      this.myTime = moment.utc().local().format('YYYY-MM-DDTHH:mm:ssZ');
      this.currenTime = this.globals.getDate(this.myDate, 'dd/MM/yyyy') + "    " + this.globals.getDate(this.myTime, 'HH:mm');
   
      setTimeout(() => {

        var cnt1 = 0;
        var cnt2 = 0;
        var cnt3 = 0;
  
        for(var i = 0 ; i < this.recordsList.length ; i++){
          
          if(this.recordsList[i]['activity_output_end_datetime'] > this.currenTime && this.recordsList[i]['next_activity_id'] == '' && (this.recordsList[i]['activity_status'] == 'OPEN' || this.recordsList[i]['activity_status'] == 'POSTPONE')){
             cnt1++;
           }else if(this.recordsList[i]['activity_output_end_datetime'] <= this.currenTime && this.recordsList[i]['next_activity_id'] == '' && (this.recordsList[i]['activity_status'] == 'OPEN' || this.recordsList[i]['activity_status'] == 'POSTPONE')){
             cnt2++;
           }else if(this.recordsList[i]['activity_output_type'] != '' && (this.recordsList[i]['activity_status'] == 'CANCEL' || this.recordsList[i]['activity_status'] == 'ATTENDED')){
            cnt3++;
           }
   
         }
  
      this.countArray = [cnt1 , cnt2 , cnt3];
  
  
      this.clickList[0]['count'] = 0;
      this.clickList[1]['count'] = 0;
      this.clickList[2]['count'] = 0;
      this.clickList[3]['count'] = 0;
      this.clickList[4]['count'] = 0;
  
        for(var i = 0 ; i < this.totalRecords.length ; i++){
       
          if(this.totalRecords[i]['activity_date_time'] >= this.setmyDateFrom && this.totalRecords[i]['activity_date_time'] <= this.setmyDateTo && this.totalRecords[i]['activity_status'] != 'ATTENDED'){
            this.clickList[0]['count']++;
           }
           if(this.totalRecords[i]['activity_date_time'] >= this.setmyDateFrom && this.totalRecords[i]['activity_date_time'] <= this.setmyDateTo && this.totalRecords[i]['dash_optionid'] == '1' && this.totalRecords[i]['activity_status'] != 'ATTENDED'){
            this.clickList[1]['count']++;
           }
           if(this.totalRecords[i]['activity_date_time'] >= this.setmyDateFrom && this.totalRecords[i]['activity_date_time'] <= this.setmyDateTo && this.totalRecords[i]['dash_optionid'] == '2' && this.totalRecords[i]['activity_status'] != 'ATTENDED'){
            this.clickList[2]['count']++;
           }
            if(this.totalRecords[i]['activity_date_time'] >= this.setmyDateFrom && this.totalRecords[i]['activity_date_time'] <= this.setmyDateTo && this.totalRecords[i]['dash_optionid'] == '3' && this.totalRecords[i]['activity_status'] != 'ATTENDED'){
            this.clickList[3]['count']++;
           }
           if(this.totalRecords[i]['activity_output_end_datetime'] <= this.currenTime && this.totalRecords[i]['next_activity_id'] == '' && (this.totalRecords[i].activity_status == 'OPEN' || this.totalRecords[i].activity_status == 'POSTPONE')){
            this.clickList[4]['count']++;
           }

         }
     
      }, 200);

    });
    

    setTimeout(() => {
      
    var sql = 'SELECT * from ' + this.globals.m_Activities + " where activity_date_time >= '" + this.setmyDateFrom + "' and activity_date_time <= '" + this.setmyDateTo + "' ORDER BY activity_created_on DESC ;";
    this.countArrayData =  this.globals.selectTables(sql);
    
     setTimeout(() => {
    
      var cnt1 = 0;
      var cnt2 = 0;
      var cnt3 = 0;

      for(var i = 0 ; i < this.countArrayData.length ; i++){
        
        if(this.countArrayData[i]['activity_output_end_datetime'] > this.currenTime && this.countArrayData[i]['next_activity_id'] == '' && (this.countArrayData[i]['activity_status'] == 'OPEN' || this.countArrayData[i]['activity_status'] == 'POSTPONE')){
           cnt1++;
         }else if(this.countArrayData[i]['activity_output_end_datetime'] <= this.currenTime && this.countArrayData[i]['next_activity_id'] == '' && (this.countArrayData[i]['activity_status'] == 'OPEN' || this.countArrayData[i]['activity_status'] == 'POSTPONE')){
           cnt2++;
         }else if(this.countArrayData[i]['activity_output_type'] != '' && (this.countArrayData[i]['activity_status'] == 'CANCEL' || this.countArrayData[i]['activity_status'] == 'ATTENDED')){
          cnt3++;
         }
 
       }

       this.countArray = [cnt1 , cnt2 , cnt3];

       this.clickList[0]['count'] = 0;
       this.clickList[1]['count'] = 0;
       this.clickList[2]['count'] = 0;
       this.clickList[3]['count'] = 0;
       this.clickList[4]['count'] = 0;

       for(var i = 0 ; i < this.countArrayData.length ; i++){
        
        if(this.countArrayData[i]['activity_date_time'] >= this.setmyDateFrom && this.countArrayData[i]['activity_date_time'] <= this.setmyDateTo && this.countArrayData[i]['activity_status'] != 'ATTENDED'){
          this.clickList[0]['count']++;
         }
         if(this.countArrayData[i]['activity_date_time'] >= this.setmyDateFrom && this.countArrayData[i]['activity_date_time'] <= this.setmyDateTo && this.countArrayData[i]['dash_optionid'] == '1' && this.countArrayData[i]['activity_status'] != 'ATTENDED'){
          this.clickList[1]['count']++;
         }
         if(this.countArrayData[i]['activity_date_time'] >= this.setmyDateFrom && this.countArrayData[i]['activity_date_time'] <= this.setmyDateTo && this.countArrayData[i]['dash_optionid'] == '2' && this.countArrayData[i]['activity_status'] != 'ATTENDED'){
          this.clickList[2]['count']++;
         }
          if(this.countArrayData[i]['activity_date_time'] >= this.setmyDateFrom && this.countArrayData[i]['activity_date_time'] <= this.setmyDateTo && this.countArrayData[i]['dash_optionid'] == '3' && this.countArrayData[i]['activity_status'] != 'ATTENDED'){
          this.clickList[3]['count']++;
         }
         if(this.countArrayData[i]['activity_output_end_datetime'] <= this.currenTime && this.countArrayData[i]['next_activity_id'] == '' && (this.countArrayData[i].activity_status == 'OPEN' || this.countArrayData[i].activity_status == 'POSTPONE')){
          this.clickList[4]['count']++;
         }
 
       }

      console.log("recordsList" + JSON.stringify(this.listStatus));
        console.log("total attended" + JSON.stringify(this.attendedList));
    }, 300);

       this.selectQuery(0);


  }, 100);
    
  }

  showNotifications(){
    this.navCtrl.push(NotificationsPage);
  }

  selectQuery(list) {

    this.totalRecords = [];

    var date = this.globals.getDate(new Date().toISOString(), 'dd/MM/yyyy') + "    " + this.globals.getDate(new Date().toISOString(), 'HH:mm');

    var sql;
    if (list == 0) {
      sql = 'SELECT * from ' + this.globals.m_Activities + " where activity_date_time >= '" + this.setmyDateFrom + "' and activity_date_time <= '" + this.setmyDateTo + "' ORDER BY activity_created_on DESC ;";
    } else if (list == 1) {
      sql = "SELECT *  from " + this.globals.m_Activities + " where dash_optionid = 1 and activity_date_time >= '" + this.setmyDateFrom + "' and activity_date_time <= '" + this.setmyDateTo + "' ORDER BY activity_created_on DESC ;";
    } else if (list == 2) {
      sql = "SELECT *  from " + this.globals.m_Activities + " where dash_optionid = 2 and activity_date_time >= '" + this.setmyDateFrom + "' and activity_date_time <= '" + this.setmyDateTo + "' ORDER BY activity_created_on DESC ;";
    } else if (list == 3) {
      sql = "SELECT *  from " + this.globals.m_Activities + " where dash_optionid = 3 and activity_date_time >= '" + this.setmyDateFrom + "' and activity_date_time <= '" + this.setmyDateTo + "' ORDER BY activity_created_on DESC ;";
    } else if (list == 4) {
      sql = 'SELECT * from ' + this.globals.m_Activities + " where activity_date_time >= '" + this.setmyDateFrom + "' and activity_date_time <= '" + this.setmyDateTo + "' ORDER BY activity_created_on DESC ;";
    }

    this.recordsList = this.globals.selectTables(sql);

    var sql1 = 'SELECT * from ' + this.globals.m_Activities + " where activity_date_time >= '" + this.setmyDateFrom + "' and activity_date_time <= '" + this.setmyDateTo + "' ORDER BY activity_created_on DESC ;";

    this.totalRecords = this.globals.selectTables(sql1);

    var totalpresentsql = 'SELECT count(*) as activity_type_count from ' + this.globals.m_Activities + " where activity_date_time >= '" + this.setmyDateFrom + "' and activity_date_time <= '" + this.setmyDateTo + "' and next_activity_id == '';";
    var presentlistsql = 'SELECT count(*) as activity_type_count,activity_scheduled_type from ' + this.globals.m_Activities + " where activity_date_time >= '" + this.setmyDateFrom + "' and activity_date_time <= '" + this.setmyDateTo + "' and next_activity_id == '' GROUP BY activity_scheduled_type ;";
    var attendedTotalsql = 'SELECT count(*) as activity_type_count from ' + this.globals.m_Activities + " where activity_date_time >= '" + this.setmyDateFrom + "' and activity_date_time <= '" + this.setmyDateTo + "' and  activity_output_type != '' and next_activity_id == '';";
    var attendedlistsql = 'SELECT count(*) as activity_type_count,activity_scheduled_type from ' + this.globals.m_Activities + " where activity_date_time >= '" + this.setmyDateFrom + "' and activity_date_time <= '" + this.setmyDateTo + "' and  activity_output_type != '' and next_activity_id == '' GROUP BY activity_scheduled_type ;";

    this.totalPresent = this.globals.selectTables(totalpresentsql);
    this.presentList = this.globals.selectTables(presentlistsql); 
    this.totalAttended = this.globals.selectTables(attendedTotalsql);
    this.attendedList = this.globals.selectTables(attendedlistsql);


    setTimeout(() => {

      var cnt1 = 0;
      var cnt2 = 0;
      var cnt3 = 0;

      for(var i = 0 ; i < this.recordsList.length ; i++){
        
        if(this.recordsList[i]['activity_output_end_datetime'] > this.currenTime && this.recordsList[i]['next_activity_id'] == '' && (this.recordsList[i]['activity_status'] == 'OPEN' || this.recordsList[i]['activity_status'] == 'POSTPONE')){
           cnt1++;
         }else if(this.recordsList[i]['activity_output_end_datetime'] <= this.currenTime && this.recordsList[i]['next_activity_id'] == '' && (this.recordsList[i]['activity_status'] == 'OPEN' || this.recordsList[i]['activity_status'] == 'POSTPONE')){
           cnt2++;
         }else if(this.recordsList[i]['activity_output_type'] != '' && (this.recordsList[i]['activity_status'] == 'CANCEL' || this.recordsList[i]['activity_status'] == 'ATTENDED')){
          cnt3++;
         }
 
       }

       this.countArray = [cnt1 , cnt2 , cnt3];


    this.clickList[0]['count'] = 0;
    this.clickList[1]['count'] = 0;
    this.clickList[2]['count'] = 0;
    this.clickList[3]['count'] = 0;
    this.clickList[4]['count'] = 0;

      for(var i = 0 ; i < this.totalRecords.length ; i++){
     
        if(this.totalRecords[i]['activity_date_time'] >= this.setmyDateFrom && this.totalRecords[i]['activity_date_time'] <= this.setmyDateTo && this.totalRecords[i]['activity_status'] != 'ATTENDED'){
          this.clickList[0]['count']++;
         }
         if(this.totalRecords[i]['activity_date_time'] >= this.setmyDateFrom && this.totalRecords[i]['activity_date_time'] <= this.setmyDateTo && this.totalRecords[i]['dash_optionid'] == '1' && this.totalRecords[i]['activity_status'] != 'ATTENDED'){
          this.clickList[1]['count']++;
         }
         if(this.totalRecords[i]['activity_date_time'] >= this.setmyDateFrom && this.totalRecords[i]['activity_date_time'] <= this.setmyDateTo && this.totalRecords[i]['dash_optionid'] == '2' && this.totalRecords[i]['activity_status'] != 'ATTENDED'){
          this.clickList[2]['count']++;
         }
          if(this.totalRecords[i]['activity_date_time'] >= this.setmyDateFrom && this.totalRecords[i]['activity_date_time'] <= this.setmyDateTo && this.totalRecords[i]['dash_optionid'] == '3' && this.totalRecords[i]['activity_status'] != 'ATTENDED'){
          this.clickList[3]['count']++;
         }
         if(this.totalRecords[i]['activity_output_end_datetime'] <= this.currenTime && this.totalRecords[i]['next_activity_id'] == '' && (this.totalRecords[i].activity_status == 'OPEN' || this.totalRecords[i].activity_status == 'POSTPONE')){
          this.clickList[4]['count']++;
         }
   
       }
   
    }, 200);
   

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

  fromDateData() {
    this.setmyDateFrom = this.globals.getDate(this.myDateFrom, 'dd/MM/yyyy');
    this.myDateTo = this.myDateFrom;
    this.selectQuery(this.whichList);
  }

  toDateData() {
    this.setmyDateTo = this.globals.getDate(this.myDateTo, 'dd/MM/yyyy');
    this.selectQuery(this.whichList);
  }

  itemClicked(item) {
    this.navCtrl.push(MeetinginfoPage, { item });
  }

  lastCallDetails(){

  }

}

