import { Api } from './../providers/api/api';
import { ProjectlistPage } from './../pages/projectlist/projectlist';
import { ContactlistPage } from './../pages/contactlist/contactlist';
import { Geolocation } from '@ionic-native/geolocation';
import { AlertController } from 'ionic-angular';
import { FeedbackPage } from './../pages/feedback/feedback';
import { FaqsPage } from './../pages/faqs/faqs';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { Storage } from '@ionic/storage';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { Component, ViewChild } from '@angular/core';
import { ProfilePage } from '../pages/profile/profile';
import { Globals } from './globals';
import { Firebase } from '@ionic-native/firebase';
import { forkJoin } from "rxjs/observable/forkJoin";
import { NotificationsPage } from '../pages/notifications/notifications';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  pages: Array<{ title: string, component: any }>;
  notificationArray = [];

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public storage: Storage, public alertCtrl: AlertController, public globals: Globals, public geolocation: Geolocation, private firebase: Firebase, public api: Api) {
    platform.ready().then(() => {


      this.storage.get('islogin').then((val) => {
        if (val == true) {
          this.rootPage = DashboardPage
        } else {
          this.rootPage = LoginPage
        }
      })

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      statusBar.hide();
      splashScreen.hide();

      this.pages = [
        { title: 'Profile', component: ProfilePage },
        { title: 'Contacts', component: ContactlistPage },
        { title: 'Project List', component: ProjectlistPage },
        { title: 'FAQ', component: FaqsPage },
        { title: 'Feedback', component: FeedbackPage },
        { title: 'Logout', component: LoginPage },
      ]

      if (this.globals.isNetworkConnected) {
        this.geolocation.getCurrentPosition().then((position) => {
          this.globals.setStorage('locationnotconnected', 'false');
        }, (err) => {
          this.globals.setStorage('locationnotconnected', 'true');
        });
      } else {

      }


      setTimeout(() => {

        setTimeout(() => {

          this.firebase.grantPermission();

          this.firebase.getToken()
            .then(token =>{
              console.log(`The token is ${token}`)
              this.globals.setStorage('device_token' , token);
            }) // save the token server-side and use it to push notifications to this device
            .catch(error => console.error('Error getting token', error));

          this.firebase.onTokenRefresh()
            .subscribe((token: string) =>{
              console.log(`Got a new token ${token}`);
              this.globals.setStorage('device_token' , token);
            }) 

          this.firebase.onNotificationOpen().subscribe(data => {

            var sql1 = 'SELECT * from ' + this.globals.m_Notifications;
            this.notificationArray = this.globals.selectTables(sql1);
    
            this.storage.get('token').then((val) => {
    
              this.storage.get('empid').then((val1) => {
                let seq = this.api.get('getNotifications/' + val1, '', { 'Authorizations': val }).share();
    
                forkJoin([seq]).subscribe(results => {
    
                  if (results[0]['items'].length > 0) {
                    for (let i = 0; i < results[0]['items'].length; i++) {
                      var dataArray = { "notification_id": results[0]['items'][i]['notification_id'], "notification_from": results[0]['items'][i]['notification_from'], "notification_to": results[0]['items'][i]['notification_to'], "notification_redirect_url": results[0]['items'][i]['notification_redirect_url'], "notification_title": results[0]['items'][i]['notification_title'], "notification_descripiton": results[0]['items'][i]['notification_descripiton'], "notification_is_unread": results[0]['items'][i]['notification_is_unread'], "notification_created_on": results[0]['items'][i]['notification_created_on'], "notification_updated_on": results[0]['items'][i]['notification_updated_on'], "notification_isread": results[0]['items'][i]['notification_isread'], "notification_activitytype": results[0]['items'][i]['notification_activitytype'], "notification_scheduled_type": results[0]['items'][i]['notification_scheduled_type'] }
                      this.globals.updateTables('', this.globals.m_Notifications, dataArray);
                    }
    
                  }

                  setTimeout(() => {
                      this.nav.push(NotificationsPage);
                  }, 2000);
    
                })
              })
            })


            if (data.wasTapped) {
              //Notification was received on device tray and tapped by the user.
            } else {
              //Notification was received in foreground. Maybe the user needs to be notified.
            }
          });

        }, 200);

      }, 200);

    });
  }

  openPage(page) {
    if (page.title == 'Logout') {
      this.presentConfirm();
    } else {
      this.nav.setRoot(page.component);
    }
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',

          handler: () => {

            this.nav.push(LoginPage);

            console.log('Confirm clicked');
          }
        }
      ]
    });
    alert.present();
  }

}

