import { Geolocation } from '@ionic-native/geolocation';
import { AlertController } from 'ionic-angular';
import { FeedbackPage } from './../pages/feedback/feedback';
import { FaqsPage } from './../pages/faqs/faqs';
import { Config, Nav, Platform, MenuController  } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { Storage } from '@ionic/storage';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { Component, ViewChild } from '@angular/core';
import { ProfilePage } from '../pages/profile/profile';
import { Globals } from './globals';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    rootPage:any;
    pages: Array<{ title: string, component: any}>;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen , public storage:Storage , public alertCtrl:AlertController , public globals:Globals , public geolocation:Geolocation) {
    platform.ready().then(() => {

        this.storage.get('islogin').then((val) => {
            if(val == true){
                this.rootPage = DashboardPage
            }else{
                this.rootPage = LoginPage
            }
        })
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      statusBar.hide();
      splashScreen.hide();

      this.pages = [
        { title: 'FAQ', component: FaqsPage },
        { title: 'Feedback', component: FeedbackPage},
        { title: 'Profile', component: ProfilePage },
        { title: 'Logout', component: LoginPage},
      ]

      if(this.globals.isNetworkConnected){
        this.geolocation.getCurrentPosition().then((position) => {
            this.globals.setStorage('locationnotconnected' , 'false');
          }, (err) => {
              this.globals.setStorage('locationnotconnected' , 'true');
          });
    }else{

    }


    });
  }

  openPage(page){
    if(page.title == 'Logout'){
        this.presentConfirm();
    }else{
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

