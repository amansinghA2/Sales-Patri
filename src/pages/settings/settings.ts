import { DashboardPage } from './../dashboard/dashboard';
import { Storage } from '@ionic/storage';
import { User } from './../../providers/user/user';
import { Globals } from './../../app/globals';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  isSync = false;
  recordsList = [];
  notificationList:any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public globals: Globals , public user:User , public storage:Storage , public loadingCtrl:LoadingController) {
  
    var sql = 'SELECT * from ' + this.globals.m_Notifications;
    this.notificationList = this.globals.selectTables(sql);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }


  submitEvent() {

    var loading = this.loadingCtrl.create({
      content: 'Syncing Please wait...'
    });

    loading.present();

    var sql = 'SELECT * from ' + this.globals.m_Activities;
    
    this.recordsList = this.globals.selectTables(sql);

    setTimeout(() => {

      if (this.isSync == true) {
 
        this.storage.get('token').then((val) => {

        this.user.postMethod('sync' , JSON.stringify(this.recordsList)  , { 'Authorization': val }).subscribe((resp) => {

          loading.dismiss();
          this.navCtrl.push(DashboardPage);
          console.log("Respis" + JSON.stringify(resp));
 
        });

      })

      } else {

      }
    }, 2000);



  }


}
