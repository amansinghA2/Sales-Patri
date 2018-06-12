import { NotificationsPage } from './../notifications/notifications';
import { Globals } from './../../app/globals';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import moment from 'moment';
import { Observable } from 'rxjs/Rx';
/**
 * Generated class for the LeadinfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-leadinfo',
  templateUrl: 'leadinfo.html',
})
export class LeadinfoPage implements OnInit{

  notificationList:any;
  item:any;
  activitiesArray = [];
  leadActivityArray = [];
  currenTime:any;
  isPrevClick = false;
  isNextClick = false;

  constructor(public navCtrl: NavController, public navParams: NavParams , public globals:Globals) {

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
      // console.log("HEllzxc"+ JSON.stringify(this.item));

      for(let i=0 ; i < this.activitiesArray.length ; i++){
            if(this.activitiesArray[i]['activity_ref_id'] == this.item.lead_no){
              this.leadActivityArray.push(this.activitiesArray[i]);
            }

      }
      
    }, 200);

  }

ngOnInit(){
  
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LeadinfoPage');
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
