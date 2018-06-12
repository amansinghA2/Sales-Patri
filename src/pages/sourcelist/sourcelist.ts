import { Http } from '@angular/http';
import { NotificationsPage } from './../notifications/notifications';
import { SourceinfoPage } from './../sourceinfo/sourceinfo';
import { Api } from './../../providers/api/api';
import { User } from './../../providers/user/user';
import { Globals } from './../../app/globals';
import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

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
  notificationList: any;
  selectedsourceListArray = [];
  subSrcArray = [];
  whichsubtype = '';
  val: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public globals: Globals, public user: User, public api: Api, public loadingCtrl: LoadingController, public http: Http) {

    var sql = 'SELECT * from ' + this.globals.m_Notifications;
    this.notificationList = this.globals.selectTables(sql);

    this.getSubSource();
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

    this.val = ev.target.value;

    this.searchResultfilter(0);

  }

  onTypeChange(item) {

    if (item == 'Select-Associate') {
      this.searchResultfilter(2)
    } else {
      this.searchResultfilter(1)
    }


  }

  searchResultfilter(whichsearch) {

    var sql;
    if (whichsearch == 0) {

      if (this.whichsubtype != '') {
        sql = 'SELECT * from ' + this.globals.m_Source_Master + " WHERE source_type == '" + this.whichsubtype + "'";
      } else {
        sql = 'SELECT * from ' + this.globals.m_Source_Master;
      }
    } else if (whichsearch == 1) {
      sql = 'SELECT * from ' + this.globals.m_Source_Master + " WHERE source_type == '" + this.whichsubtype + "'";
    } else {
      sql = 'SELECT * from ' + this.globals.m_Source_Master;
    }

    this.sourceListArray = this.globals.selectTables(sql);

    setTimeout(() => {

      this.selectedsourceListArray = this.sourceListArray;

      // if the value is an empty string don't filter the items
      if (this.val && this.val.trim() != '') {
        // this.showListsubtype = true;
        this.selectedsourceListArray = this.selectedsourceListArray.filter((item) => {
          return (item['source_name'].toLowerCase().indexOf(this.val.toLowerCase()) > -1);
        })
      } else {
        // this.showListsubtype = false;
      }

    }, 200);

  }

  getSubSource() {

    this.getsubsrcjson(this.http).subscribe(data => {
      var keyArray1: string[] = [];

      for (let keyname in data) {
        keyArray1.push(keyname);
      }

      this.subSrcArray = keyArray1;
      this.whichsubtype = this.subSrcArray[0];
    }, error => console.log(error));

  }

  getsubsrcjson(http): Observable<any> {
    return http.get("assets/srcsubsrc.json")
      .map((res: any) => res.json());
  }

  sourceClicked(item) {
    this.navCtrl.push(SourceinfoPage, { val: item });
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