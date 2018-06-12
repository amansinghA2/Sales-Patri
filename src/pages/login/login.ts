import { Geolocation } from '@ionic-native/geolocation';
import { Api } from './../../providers/api/api';
import { Globals } from './../../app/globals';
import { User } from './../../providers/user/user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, MenuController, Platform } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { Storage } from '@ionic/storage';
import { JwtHelper } from 'angular2-jwt';
import { AppVersion } from '@ionic-native/app-version';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  employeeid: any;
  employeepassword: any;
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public user: User, public globals: Globals, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public api: Api, private menu: MenuController, public geolocation: Geolocation, public platform: Platform, private appVersion: AppVersion) {

  }

  ionViewDidLoad() {

    this.storage.set('islogin', false);

  }

  ionViewDidEnter() {

    // If you have more than one side menu, use the id like below
    // this.menu.swipeEnable(false, 'menu1');
  }

  doLogin() {

    if (this.globals.isNetworkConnected) {

      var loading = this.loadingCtrl.create({
        content: 'Logging in please wait...'
      });

      loading.present();

      var loginparams = {
        empid: this.employeeid,
        password: this.employeepassword
      }

      // var loginparams = {
      //   empid:'11490',
      //   password:'12345'
      // }

      this.geolocation.getCurrentPosition().then((position) => {
        this.globals.setStorage('locationnotconnected', 'false');
      }, (err) => {
        this.globals.setStorage('locationnotconnected', 'true');
      });

      this.storage.get('locationnotconnected').then((val) => {

        if (val == 'true') {
          loading.dismiss();
          this.globals.locationConfirm();
        } else {


          this.user.postMethod('login', JSON.stringify(loginparams), { 'Content-Type': 'application/x-www-form-urlencoded' }).subscribe((resp) => {


            if (resp['status'] == 0) {
              let toast = this.toastCtrl.create({
                message: 'Username or Password is Incorrect',
                duration: 3000,
                position: 'bottom'
              });
              //  this.ng4LoadingSpinnerService.hide();
              loading.dismiss();
              toast.present();
            } else {

              this.storage.set('islogin', true);

              // console.log(JSON.stringify(this.jwtHelper.decodeToken(resp['token'])));
              console.log(
                this.jwtHelper.decodeToken(resp['token']),
                this.jwtHelper.getTokenExpirationDate(resp['token']),
                this.jwtHelper.isTokenExpired(resp['token'])
              );

              this.storage.get('device_token').then((val) => {
              var versionNumber = this.appVersion.getVersionNumber();

              var pushNotifyParams;
              // device_token
              setTimeout(() => {

                if (this.platform.is('ios')) {
                  pushNotifyParams = {
                    token: val,
                    os: 'ios',
                    version: versionNumber['__zone_symbol__value'],
                    empid: this.employeeid
                  }
                  console.log('I am an iOS device!');
                } else {
                  pushNotifyParams = {
                    token: val,
                    os: 'android',
                    version: versionNumber['__zone_symbol__value'],
                    empid: this.employeeid
                  }
                }

                this.user.postMethod('insert_device_token', JSON.stringify(pushNotifyParams), { 'Authorizations': resp['token'] }).subscribe((resp) => {
                  console.log("devicess resp" + JSON.stringify(resp));
                })

              }, 50);

            })

              this.globals.setStorage('empid', this.employeeid);
              this.globals.setStorage('token', resp['token']);

              this.storage.get('token').then((val) => {

                this.storage.get('empid').then((val1) => {

                  this.storage.get('user_id').then((val2) => {

                    this.globals.dataFromServices();

                    this.globals.setStorage('user_id', this.employeeid);

                    setTimeout(() => {
                      loading.dismiss();
                      this.navCtrl.push(DashboardPage);
                    }, 2000);

                    // if (val2 == this.employeeid) {
                    //   loading.dismiss();
                    //   this.navCtrl.push(DashboardPage);
                    // } else {

                    //   this.globals.dataFromServices();

                    //   this.globals.setStorage('user_id', this.employeeid);

                    //   setTimeout(() => {
                    //     loading.dismiss();
                    //     this.navCtrl.push(DashboardPage);
                    //   }, 2000);

                    // }

                  })
                });
              });

            }
          }, (err) => {
            let toast = this.toastCtrl.create({
              message: 'Username or Password is Incorrect',
              duration: 3000,
              position: 'bottom'
            });
            //  this.ng4LoadingSpinnerService.hide();
            toast.present();
            loading.dismiss();
          });

        }
      });
    } else {
      let toast = this.toastCtrl.create({
        message: 'Check Your Internet connection',
        duration: 3000,
        position: 'bottom'
      });

      toast.present();
    }

  }


}
