import { Geolocation } from '@ionic-native/geolocation';
import { Api } from './../../providers/api/api';
import { ProfilePage } from './../profile/profile';
import { Globals } from './../../app/globals';
import { User } from './../../providers/user/user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, MenuController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { Storage, StorageConfigToken } from '@ionic/storage';
import { forkJoin } from "rxjs/observable/forkJoin";
import { JwtHelper } from 'angular2-jwt';


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

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public user: User, public globals: Globals, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public api: Api, private menu: MenuController , public geolocation:Geolocation) {

  }

  ionViewDidLoad() {

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
        this.globals.setStorage('locationnotconnected' , 'false');
      }, (err) => {
          this.globals.setStorage('locationnotconnected' , 'true');
      });
      
      this.storage.get('locationnotconnected').then((val) => {

        if (val == 'true') {
          loading.dismiss();
          this.globals.locationConfirm();
        } else {
          this.user.postMethod('login', JSON.stringify(loginparams), { 'Content-Type': 'application/x-www-form-urlencoded' }).subscribe((resp) => {

            loading.dismiss();
            if (resp['status'] == 0) {
              let toast = this.toastCtrl.create({
                message: 'Username or Password is Incorrect',
                duration: 3000,
                position: 'bottom'
              });
              //  this.ng4LoadingSpinnerService.hide();
              toast.present();
            } else {

              this.storage.set('islogin', true);

              console.log(JSON.stringify(this.jwtHelper.decodeToken(resp['token'])));
              console.log(
                this.jwtHelper.decodeToken(resp['token']),
                this.jwtHelper.getTokenExpirationDate(resp['token']),
                this.jwtHelper.isTokenExpired(resp['token'])
              );
              this.globals.setStorage('empid', this.employeeid);
              this.globals.setStorage('token', resp['token']);

              this.storage.get('token').then((val) => {

                this.storage.get('empid').then((val1) => {

                  this.globals.deleteTable(this.globals.m_Source_Master);
                  this.globals.deleteTable(this.globals.m_Lead_Master);
                  this.globals.deleteTable(this.globals.m_Activities);

                  let seq = this.api.get('getSources/' + val1, '', { 'Content-Type': 'application/x-www-form-urlencoded' }).share();
                  let seq1 = this.api.get('getLeads/' + val1, '', { 'Content-Type': 'application/x-www-form-urlencoded' }).share();
                  let seq2 = this.api.get('goallist/' + val1, '', { 'Content-Type': 'application/x-www-form-urlencoded' }).share();
                  let seq3 = this.api.get('getActivity/'  + val1, '', { 'Content-Type': 'application/x-www-form-urlencoded' }).share(); 

                  forkJoin([seq, seq1, seq2 , seq3]).subscribe(results => {

                    if (results[0]['items'].length > 0) {
                      for (let i = 0; i < results[0]['items'].length; i++) {
                        var dataArray = { "source_id": results[0]['items'][i]['source_id'], "source_type": results[0]['items'][i]['source_type'], "source_sub_type": results[0]['items'][i]['source_sub_type'], "source_name": results[0]['items'][i]['source_name'], "source_address_1": results[0]['items'][i]['source_address_1'], "source_address_2": results[0]['items'][i]['source_address_2'], "source_address_3": results[0]['items'][i]['source_address_3'], "source_location": results[0]['items'][i]['source_location'], "source_city": results[0]['items'][i]['source_city'], "source_pincode": results[0]['items'][i]['source_pincode'], "source_active": results[0]['items'][i]['source_active'], "source_latitude": results[0]['items'][i]['source_latitude'], "source_longitude": results[0]['items'][i]['source_longitude'], "source_tel_number_1": results[0]['items'][i]['source_tel_number_1'], "source_tel_number_2": results[0]['items'][i]['source_tel_number_2'], "source_tel_number_3": results[0]['items'][i]['source_tel_number_3'], "source_created_on": results[0]['items'][i]['source_created_on'], "source_updated_on": results[0]['items'][i]['source_updated_on'], "source_created_by": results[0]['items'][i]['source_created_by'], "source_updated_by": results[0]['items'][i]['source_updated_by'] }
                        this.globals.updateTables('', this.globals.m_Source_Master, dataArray);
                      }
                    }

                    if (results[1]['items'].length > 0) {
                      for (let i = 0; i < results[1]['items'].length; i++) {
                        var dataArray1 = { "lead_no": results[1]['items'][i]['lead_no'], "lead_company": results[1]['items'][i]['lead_company'], "name": results[1]['items'][i]['name'], "branch": results[1]['items'][i]['branch'], "source_type": results[1]['items'][i]['source_type'], "sub_source": results[1]['items'][i]['sub_source'], "last_action_date": results[1]['items'][i]['last_action_date'] , "lead_status_code": results[1]['items'][i]['lead_status_code'] , "lead_status": results[1]['items'][i]['lead_status']}
                        this.globals.updateTables('', this.globals.m_Lead_Master, dataArray1);
                      }
                    }

                    if (results[2]['items'].length > 0) {
                      for (let i = 0; i < results[2]['items'].length; i++) {
                        var dataArray2 = { "goal_id": results[2]['items'][i]['goal_id'], "user_id": results[2]['items'][i]['user_id'], "so_id": results[2]['items'][i]['so_id'], "goal_title": results[2]['items'][i]['goal_title'], "goal_description": results[2]['items'][i]['goal_description'], "tasks": results[2]['items'][i]['tasks'], "escalated_to_manager": results[2]['items'][i]['escalated_to_manager'], "goal_deadline": results[2]['items'][i]['goal_deadline'], "achieved_status": results[2]['items'][i]['achieved_status'], "remarks": results[2]['items'][i]['remarks'], "created_on": results[2]['items'][i]['created_on'], "updated_on": results[2]['items'][i]['updated_on'] }
                        this.globals.updateTables('', this.globals.m_Goals_Master, dataArray2);
                      }
                    }


                    if (results[3]['items'].length > 0) {
                      for (let i = 0; i < results[3]['items'].length; i++) {
                        var dataArray3 = {"activity_date_time": results[3]['items'][i]['activity_date_time'], "activity_type": results[3]['items'][i]['activity_type'], "activity_person_name": results[3]['items'][i]['activity_person_name'],"activity_scheduled_type": results[3]['items'][i]['activity_scheduled_type'], "activity_ref_id": results[3]['items'][i]['activity_ref_id'], "activity_location": results[3]['items'][i]['activity_location'], "activity_latitude": results[3]['items'][i]['activity_latitude'], "activity_longitude": results[3]['items'][i]['activity_longitude'], "activity_city": results[3]['items'][i]['activity_city'], "current_lat": results[3]['items'][i]['current_lat'], "current_lng": results[3]['items'][i]['current_lng'], "current_loc": results[3]['items'][i]['current_loc'], "activity_description": results[3]['items'][i]['activity_description'], "activity_status": results[3]['items'][i]['activity_status'], "activity_output_type": results[3]['items'][i]['activity_output_type'], "activity_output_remarks": results[3]['items'][i]['activity_output_remarks'], "activity_output_end_datetime": results[3]['items'][i]['activity_output_end_datetime'], "next_activity_id": results[3]['items'][i]['next_activity_id'], "activity_created_on": results[3]['items'][i]['activity_created_on'], "activity_updated_on": results[3]['items'][i]['activity_updated_on'], "activity_created_by": results[3]['items'][i]['activity_created_by'], "activity_updated_by": results[3]['items'][i]['activity_updated_by'],
                        "client_id": results[3]['items'][i]['client_id'],
                        "contact_id": results[3]['items'][i]['contact_id'],
                        "team_leader": results[3]['items'][i]['team_leader'], 
                      }
                        this.globals.updateTables('', this.globals.m_Activities, dataArray3);
                      }
                    }


                  })

                });
              });

              this.navCtrl.push(DashboardPage);
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
