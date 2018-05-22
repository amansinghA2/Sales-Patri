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
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public user:User,public storage:Storage , public globals:Globals) {

      var sql = 'SELECT * from ' + this.globals.m_Notifications;
      this.notificationList = this.globals.selectTables(sql);


      var sql = 'SELECT * from ' + this.globals.m_Goals_Master;
      this.goalsListArray = this.globals.selectTables(sql);

  }


  ionViewDidLoad() {

    console.log('ionViewDidLoad GoalsPage');
  }

  showNotifications() {
    this.navCtrl.push(NotificationsPage);
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
