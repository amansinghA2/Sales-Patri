import { OnInit } from '@angular/core';
import { NotificationsPage } from './../notifications/notifications';
import { GoalsinfoPage } from './../goalsinfo/goalsinfo';
import { Globals } from './../../app/globals';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../providers/user/user';
import moment from 'moment';

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


  myDateFrom: string;
  myDateTo: string;


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

    this.myDateFrom =  moment.utc().local().format('YYYY-MM-DDTHH:mm:ssZ');
    this.myDateTo =  moment.utc().local().format('YYYY-MM-DDTHH:mm:ssZ');

    this.myDateFrom = moment.utc(this.myDateFrom).local().format('YYYY-MM-DD');
    this.myDateTo = moment.utc(this.myDateTo).local().format('YYYY-MM-DD');

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

    }, 200);

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
    this.myDateFrom =  moment.utc(this.myDateFrom).local().format('YYYY-MM-DD');
    if(this.myDateFrom > this.myDateTo){
      this.myDateTo = this.myDateFrom;
    }
    this.selectQuery();
  }

  toDateData() {
    this.myDateTo =  moment.utc(this.myDateTo).local().format('YYYY-MM-DD');
    this.selectQuery();
  }


  selectQuery() {

    var sql = 'SELECT * from ' + this.globals.m_Goals_Master + " where goal_deadline >= '" + this.myDateFrom + "' and goal_deadline <= '" + this.myDateTo + "' ORDER BY goal_deadline ASC ;";
    this.goalsListArray = this.globals.selectTables(sql);

    setTimeout(() => {
        this.selectedgoalsListArray = this.goalsListArray;
    }, 200);

  }
}
