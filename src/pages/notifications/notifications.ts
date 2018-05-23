import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Globals } from '../../app/globals';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';


/**
 * Generated class for the NotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  notificationList:any;
  isChecked = true;
  isnotificationseen:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public globals:Globals , public storage:Storage , public sqlite:SQLite) {

    var sql = 'SELECT * from ' + this.globals.m_Notifications + ' ORDER BY id DESC; ';
    this.notificationList = this.globals.selectTables(sql);

    this.globals.setStorage('isseennotification' , 'false');
   

    setTimeout(() => {

      for(let i = 0 ; i < this.notificationList.length ; i++){


        this.sqlite.create({
          name: this.globals.dbName,
          location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('UPDATE m_Notifications SET notification_isread=? WHERE notification_isread=?', ['1', '0'])
        .then(res => {
            console.log("m_Notificationsinsert inserted");
        })

      })

        // 'notification_isread':'0'  , 'notification_activitytype': 'Meeting'
      }

      console.log(JSON.stringify(this.notificationList));
    }, 500);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationsPage');
  }

  // showNotifications(){
  //   this.navCtrl.push(NotificationsPage);
  // }


}
