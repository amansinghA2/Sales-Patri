import { DashboardPage } from './../dashboard/dashboard';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { NotificationsPage } from './../notifications/notifications';
import { Globals } from '../../app/globals';


/**
 * Generated class for the FeedbackPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {

  whichfeedbacktype:string;
  feedbackdetail:string;
  notificationList:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public toastCtrl:ToastController,public globals:Globals) {
  
      var sql = 'SELECT * from ' + this.globals.m_Notifications;
      this.notificationList = this.globals.selectTables(sql);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedbackPage');
  }

  showNotifications(){
    this.navCtrl.push(NotificationsPage);
    }
    

  submitEvent(){

     if(this.feedbackdetail != ''){
      let toast = this.toastCtrl.create({
        message: 'Feedback submitted successfully',
        duration: 3000,
        position: 'bottom'
      });
      //  this.ng4LoadingSpinnerService.hide();
      toast.present();
      setTimeout(() => {
        this.navCtrl.push(DashboardPage);
      }, 1000);

     }else{
      let toast = this.toastCtrl.create({
        message: 'Enter required fields',
        duration: 3000,
        position: 'bottom'
      });
      //  this.ng4LoadingSpinnerService.hide();
      toast.present();
     }
    
  }

}
