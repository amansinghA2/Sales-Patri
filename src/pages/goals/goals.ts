import { OnInit } from '@angular/core';
import { NotificationsPage } from './../notifications/notifications';
import { GoalsinfoPage } from './../goalsinfo/goalsinfo';
import { Globals } from './../../app/globals';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../providers/user/user';
import moment from 'moment';
import {Observable} from 'rxjs/Rx';

/**
 * Generated class for the GoalsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-goals',
  templateUrl: 'goals.html',
})
export class GoalsPage implements OnInit{

  goalsList = [];
  shownGroup = null;
  notificationList:any;
  goalsListArray = [];
  selectedgoalsListArray = [];

  myDate:any;
  myTime:any;

  myDateFrom: String;
  myDateTo: String;

  setmyDateFrom: string;
  setmyDateTo: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,public user:User,public storage:Storage , public globals:Globals) {

      var sql = 'SELECT * from ' + this.globals.m_Notifications;
      this.notificationList = this.globals.selectTables(sql);


      var sql = 'SELECT * from ' + this.globals.m_Goals_Master;
      this.goalsListArray = this.globals.selectTables(sql);


      setTimeout(() => {
        this.selectedgoalsListArray = this.goalsListArray;
      }, 200);
    

  }

  ngOnInit(){

    this.myDateFrom = new Date().toISOString();
    this.myDateTo = new Date().toISOString();
    // this.minDate = new Date().toISOString();

    this.myDate = moment.utc().local().format('YYYY-MM-DDTHH:mm:ssZ');
    this.myTime = moment.utc().local().format('YYYY-MM-DDTHH:mm:ssZ');

    var send_date=new Date();
    send_date.setMonth(send_date.getMonth() - 2 );
    this.myDateFrom = send_date.toISOString().slice(0,10);
    this.myDateFrom  =this.globals.getDate( this.myDateFrom , 'yyyy-MM-dd');
    this.setmyDateFrom = this.globals.getDate( this.myDateFrom , 'yyyy-MM-dd');
    this.setmyDateTo = this.globals.getDate(this.myDateTo, 'yyyy-MM-dd');

    this.selectQuery();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GoalsPage');
  }

  showNotifications() {
    this.navCtrl.push(NotificationsPage);
  }

  updateSubtypeSearchResult(ev: any) {

    var sql = 'SELECT * from ' + this.globals.m_Goals_Master;
    this.goalsListArray = this.globals.selectTables(sql);

    setTimeout(() => {

      this.selectedgoalsListArray = this.goalsListArray;

      let val = ev.target.value;

      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
        // this.showListsubtype = true;
        this.selectedgoalsListArray = this.selectedgoalsListArray.filter((item) => {
          return (item['goal_id'].toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      } else {
        // this.showListsubtype = false;
      }

    }, 100);

  }

  toggleGroup(group) {
    if(this.isGroupShown(group)){
      this.shownGroup = null;
    }else{
      this.shownGroup = group;
    }
  };

  isGroupShown(group) {
    return this.shownGroup === group;
  };

  goalsClicked(item){
    this.navCtrl.push(GoalsinfoPage , {val: item});
  }

  fromDateData() {
    this.setmyDateFrom = this.globals.getDate(this.myDateFrom, 'yyyy-MM-dd');
    if(this.setmyDateFrom > this.setmyDateTo){
      this.myDateTo = this.myDateFrom;
    }
    this.selectQuery();
  }

  toDateData() {
    this.setmyDateTo = this.globals.getDate(this.myDateTo, 'yyyy-MM-dd');
    this.selectQuery();
  }


  selectQuery() {

    var sql = 'SELECT * from ' + this.globals.m_Goals_Master + " where goal_deadline >= '" + this.setmyDateFrom + "' and goal_deadline <= '" + this.setmyDateTo + "' ORDER BY goal_deadline ASC ;";
    this.goalsListArray = this.globals.selectTables(sql);

    setTimeout(() => {
        this.selectedgoalsListArray = this.goalsListArray;
    }, 100);

  }
}
