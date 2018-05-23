import { NotificationsPage } from './../notifications/notifications';
import { GoalsinfoPage } from './../goalsinfo/goalsinfo';
import { Globals } from './../../app/globals';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../providers/user/user';

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
export class GoalsPage {

  goalsList = [];
  shownGroup = null;
  notificationList:any;
  goalsListArray = [];
  selectedgoalsListArray = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,public user:User,public storage:Storage , public globals:Globals) {

      var sql = 'SELECT * from ' + this.globals.m_Notifications;
      this.notificationList = this.globals.selectTables(sql);


      var sql = 'SELECT * from ' + this.globals.m_Goals_Master;
      this.goalsListArray = this.globals.selectTables(sql);


      setTimeout(() => {
        this.selectedgoalsListArray = this.goalsListArray;
      }, 200);
    

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

}
