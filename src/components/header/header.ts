import { NotificationsPage } from './../../pages/notifications/notifications';
import { NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { Globals } from '../../app/globals';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the HeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'header',
  templateUrl: 'header.html'
})
export class HeaderComponent {

  text: string;
  notificationList = [];
  isnotificationseen:any;
  notificationCount = 0;

  constructor(public navCtrl:NavController ,public globals:Globals ,public storage:Storage ) {
    console.log('Hello HeaderComponent Component');
    this.text = 'Hello World';

    var sql = 'SELECT * from ' + this.globals.m_Notifications;
    this.notificationList = this.globals.selectTables(sql);


    setTimeout(() => {

      this.storage.get('isseennotification').then((val) => {
        this.isnotificationseen = val;
      })


      for(let i = 0 ; i < this.notificationList.length ; i++){
          // this.notificationList[i]['notification_isread'] == '1';
        // 'notification_isread':'0'  , 'notification_activitytype': 'Meeting'

        if(this.notificationList[i]['notification_isread'] == '0'){
            this.notificationCount++;
        }

      }
      
    }, 200);

    
  }

  showNotifications(){
    this.navCtrl.push(NotificationsPage);
  }

}
