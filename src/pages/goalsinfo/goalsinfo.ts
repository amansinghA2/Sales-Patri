import { Globals } from './../../app/globals';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the GoalsinfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-goalsinfo',
  templateUrl: 'goalsinfo.html',
})
export class GoalsinfoPage {

  notificationList:any;
  item:any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams , public globals:Globals) {

    var sql = 'SELECT * from ' + this.globals.m_Notifications;
    this.notificationList = this.globals.selectTables(sql);

    this.item = this.navParams.get('val');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GoalsinfoPage');
  }

}
