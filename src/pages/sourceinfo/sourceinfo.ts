import { NotificationsPage } from './../notifications/notifications';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Globals } from '../../app/globals';
import moment from 'moment';
import { Observable } from 'rxjs/Rx';

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
export class SourceinfoPage implements OnInit{

  notificationList:any;
  sourceInfoListArray = [];
  item:any;
  sourceActivityArray = [];
  currenTime:any;
  isPrevClick = false;
  isNextClick = false;
  activitiesArray = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,public globals:Globals) {
  

  }

  ngOnInit(){

    var sql = 'SELECT * from ' + this.globals.m_Notifications;
    this.notificationList = this.globals.selectTables(sql);

    this.item = this.navParams.get('val');

    var sql = 'SELECT * from ' + this.globals.m_Activities + ' ORDER BY activity_created_on DESC ;'
    this.activitiesArray = this.globals.selectTables(sql);

    this.currenTime = moment.utc().local().format('YYYY-MM-DD') + " " +  moment.utc().local().format('HH:mm');

    Observable.interval(1000 * 5).subscribe(x => {

      this.currenTime = moment.utc().local().format('YYYY-MM-DD') + " " +  moment.utc().local().format('HH:mm');

    });

    setTimeout(() => {

      for(let i=0 ; i < this.activitiesArray.length ; i++){
            if(this.activitiesArray[i]['activity_ref_id'] == this.item.source_id){
              this.sourceActivityArray.push(this.activitiesArray[i]);
            }

      }

      console.log('lollat' + JSON.stringify(this.sourceActivityArray));
    }, 200);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SourceinfoPage');
  }

  showNotifications() {
    this.navCtrl.push(NotificationsPage);
  }

  nextCall(){

    if(this.isNextClick == false){
      this.isPrevClick = false;
      this.isNextClick = true;
    }else{
      this.isPrevClick = false;
      this.isNextClick = false;
    }
 
  }

  prevCall(){

    if(this.isPrevClick == false){
    this.isPrevClick = true;
    this.isNextClick = false;
    }else{
      this.isPrevClick = false;
      this.isNextClick = false;
    }

  }


}
