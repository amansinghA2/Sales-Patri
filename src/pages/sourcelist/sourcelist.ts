import { NotificationsPage } from './../notifications/notifications';
import { SourceinfoPage } from './../sourceinfo/sourceinfo';
import { Api } from './../../providers/api/api';
import { User } from './../../providers/user/user';
import { Globals } from './../../app/globals';
import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

/**
 * Generated class for the SourcelistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sourcelist',
  templateUrl: 'sourcelist.html',
})
export class SourcelistPage implements OnInit {

  sourceListArray = [];
  notificationList:any;
  selectedsourceListArray = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public globals: Globals, public user: User, public api: Api, public loadingCtrl: LoadingController) {

    var sql = 'SELECT * from ' + this.globals.m_Notifications;
    this.notificationList = this.globals.selectTables(sql);



  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SourcelistPage');
  }

  showNotifications() {
    this.navCtrl.push(NotificationsPage);
  }


  ngOnInit() {

    var sql = 'SELECT * from ' + this.globals.m_Source_Master;
    this.sourceListArray = this.globals.selectTables(sql);

    setTimeout(() => {
      this.selectedsourceListArray = this.sourceListArray;
    }, 200);
   
  }

  updateSubtypeSearchResult(ev: any) {

    var sql = 'SELECT * from ' + this.globals.m_Source_Master;
    this.sourceListArray = this.globals.selectTables(sql);

    setTimeout(() => {

      this.selectedsourceListArray = this.sourceListArray;

      let val = ev.target.value;

      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
        // this.showListsubtype = true;
        this.selectedsourceListArray = this.selectedsourceListArray.filter((item) => {
          return (item['source_name'].toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      } else {
        // this.showListsubtype = false;
      }

    }, 100);

  }


  sourceClicked(item){
      this.navCtrl.push(SourceinfoPage , {val: item});
  }

}




// <ion-row>
// <ion-col col-4>
//   <ion-select [(ngModel)]="whichbsa">
//     <!-- *ngFor="let item of typesarray" -->
//     <!-- <ion-option *ngFor="let key of keys;" [value]="key">{{key}}</ion-option> -->
//   </ion-select>
// </ion-col>
// <ion-col col-4>
//   <ion-select [(ngModel)]="whichsource">
//     <!-- *ngFor="let item of typesarray" -->
//     <!-- <ion-option *ngFor="let key of keys;" [value]="key">{{key}}</ion-option> -->
//   </ion-select>
// </ion-col>
// <ion-col col-4>
//   <ion-select [(ngModel)]="whichlocation">
//     <!-- *ngFor="let item of typesarray" -->
//     <!-- <ion-option *ngFor="let key of keys;" [value]="key">{{key}}</ion-option> -->
//   </ion-select>
// </ion-col>
// </ion-row>