import { NotificationsPage } from './../notifications/notifications';
import { MeetingupdatePage } from './../meetingupdate/meetingupdate';
import { Storage } from '@ionic/storage';
import { DashboardPage } from './../dashboard/dashboard';
import { Http } from '@angular/http';
import { Globals } from './../../app/globals';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import moment from 'moment';
import { Observable } from 'rxjs/Rx';
import { User } from '../../providers/user/user';

/**
 * Generated class for the TodoitemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-todoitem',
  templateUrl: 'todoitem.html',
})
export class TodoitemPage {

  typesarray;
  keyArray;
  typeDict;

  whichtype: string;
  selectedItem: string;
  dateTime: string;
  meetingLocation: string;
  meetingPerson: string;
  todoDescription: string;
  pushDateString: any;
  selectedTime: any;
  selectedDate: string;
  updateItems: any;
  activtiyrefid = '';
  recordsList = [];

  rescitem: any;
  myDate;
  myTime;
  items;
  keys;
  taskStatus = '';
  notificationList:any;
  lfdgsqarray = [];
  typeString = '';
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public localNotifications: LocalNotifications, public globals: Globals, public http: Http, public toastCtrl?: ToastController,public storage?:Storage , public loadingCtrl?:LoadingController , public user?:User) {

    var sql = 'SELECT * from ' + this.globals.m_Notifications;
    this.notificationList = this.globals.selectTables(sql);

    this.myDate = moment.utc().local().format('YYYY-MM-DDTHH:mm:ssZ');
    this.myTime = moment.utc().local().format('YYYY-MM-DDTHH:mm:ssZ');

    this.selectedDate = this.globals.getDate(this.myDate, 'dd/MM/yyyy')
    this.selectedTime = moment.utc().local().format('hh:mm a');

    this.dateTime = this.globals.getDate(this.myDate, 'dd/MM/yyyy') + "    " + this.globals.getDate(this.myTime, 'HH:mm'); this.pushDateString = moment.utc().local().format('YYYY-MM-DDTHH:mm:ssZ');

    this.whichtype = 'Lead Activity';

    if (this.navParams.get('params')) {
      this.taskStatus = this.navParams.get('val');
    }

    if (this.navParams.get('params')) {
      this.updateItems = this.navParams.get('params');
      this.whichtype = this.globals.typeSelect(this.updateItems['type']);
    }

    if (this.navParams.get('item')) {
      this.items = this.navParams.get('item');
      this.meetingPerson = this.items['activity_person_name'];
      this.meetingPerson = this.items['activity_person_name'];
      this.todoDescription = this.items['activity_description'];
    }


    if (this.navParams.get('params')) {
      this.updateItems = this.navParams.get('params');
      this.rescitem = this.navParams.get('rescitem');
      // this.whichtype = this.globals.typeSelect(this.updateItems['type']);
      this.whichtype = 'Lead Activity';
    }

    this.getJSON(this.http);


  }


  getJSON(http) {

    this.getcallmettingtypeJSON(http).subscribe(data => {

        this.typesarray = data['MeetingType'];
        this.keys = Object.keys(this.typesarray);

    }, error => console.log( JSON.stringify("aa" + error)));

}

getcallmettingtypeJSON(http): Observable<any> {
  return http.get("assets/callmeetingleadtype.json")
      .map((res: any) => res.json());
}

showNotifications() {
  this.navCtrl.push(NotificationsPage);
}


  ionViewDidLoad() {
    console.log('ionViewDidLoad TodoitemPage');
  }


  fromDateData() {
    this.selectedDate = this.globals.getDate(this.myDate, 'dd/MM/yyyy')
    this.dateTime = this.globals.getDate(this.myDate, 'dd/MM/yyyy') + "    " + this.globals.getDate(this.myTime, 'HH:mm');
    this.pushDateString = moment.utc(this.myDate).local().format('YYYY-MM-DDT') + moment.utc(this.myTime).local().format('HH:mm:ssZ');
  }

  fromTimeData() {
    this.selectedTime = moment.utc(this.myTime).local().format('hh:mm a');
    this.dateTime = this.globals.getDate(this.myDate, 'dd/MM/yyyy') + "    " + this.globals.getDate(this.myTime, 'HH:mm');
    this.pushDateString = moment.utc(this.myDate).local().format('YYYY-MM-DDT') + moment.utc(this.myTime).local().format('HH:mm:ssZ');
  }

  toDoTypeClicked(item){
    this.typeString = item;
  }

  submitEvent() {

    if(this.globals.isNetworkConnected){
      this.globals.codeLatLng();
    }

    var loading = this.loadingCtrl.create({
      content: 'Loading Please wait...'
    });

    loading.present();

    var dataArray;

    setTimeout(() => {

      if (this.todoDescription != '' && this.whichtype != '') {

        this.storage.get('empid').then((val) => {

          this.localNotifications.schedule({
            text: 'Your To-Do activity has been scheduled on ' + this.selectedDate + ' at ' + this.selectedTime,
            trigger: { at: new Date(moment.utc(this.pushDateString).local().valueOf() - 10 * 1000) },
            led: 'FF0000',
            sound: null,
            icon:'file://assets/imgs/icon.png',
            smallIcon: 'file://assets/imgs/icon.png',
          });

          var notifyArray = { "notification_id": '', "notification_from": '', "notification_to": '', "notification_redirect_url": '', "notification_title": 'Meeting Scheduled', "notification_descripiton": 'Metting with ' + this.meetingPerson + ' scheduled on ' + this.selectedDate + ' at ' + this.selectedTime, "notification_is_unread": '', "notification_created_on": '', "notification_updated_on": '' };
          this.globals.updateTables('notification', this.globals.m_Notifications, notifyArray);

          if (this.items) {

            dataArray = { "dash_optionid": 3, "activity_date_time": this.selectedDate, "activity_type": 'To-Do', "activity_person_name": '', "activity_scheduled_type": this.typesarray[this.whichtype], "activity_ref_id": '', "activity_location": '', "activity_description": this.todoDescription, "activity_status": 'ATTENDED', "activity_output_type": '', "activity_output_remarks": '', "activity_output_end_datetime": this.dateTime, "next_activity_id": '', "activity_created_on": this.dateTime, "activity_updated_on": moment.utc().local().format('YYYY-MM-DDTHH:mm:ssZ'), "activity_created_by": val, "activity_updated_by": val, "activity_latitude": '', "activity_longitude": '', "current_lat": this.globals.curr_lat, "current_lng": this.globals.curr_lng, "current_loc": "", "contact_id": '', "team_leader": '' }
              this.globals.updateTables('call', this.globals.m_Activities, dataArray);

            setTimeout(() => {
              var sql = 'SELECT * from ' + this.globals.m_Activities;
              this.recordsList = this.globals.selectTables(sql);
              if (this.globals.isNetworkConnected) {
                setTimeout(() => {
                  this.storage.get('token').then((val) => {
                    this.user.postMethod('sync', JSON.stringify(this.recordsList), { 'Authorization': val }).subscribe((resp) => {
                      console.log("Respis" + JSON.stringify(resp));
                    })
                  })
                }, 100);
              } else {
                let toast = this.toastCtrl.create({
                  message: 'Check Your Internet connection',
                  duration: 3000,
                  position: 'bottom'
                });

                toast.present();
              }
              loading.dismiss();
              this.navCtrl.push(MeetingupdatePage, { val: 'meeting' });
            }, 100);

          }else{

            if (this.updateItems) {
              dataArray = { "dash_optionid": 3, "activity_date_time": this.selectedDate, "activity_type": 'To-Do', "activity_person_name": '', "activity_scheduled_type": this.typesarray[this.whichtype], "activity_ref_id": '', "activity_location": '', "activity_description": this.todoDescription, "activity_status": 'POSTPONE', "activity_output_type": '', "activity_output_remarks": '', "activity_output_end_datetime": this.dateTime, "next_activity_id": '', "activity_created_on": moment.utc().local().format('YYYY-MM-DDTHH:mm:ssZ'), "activity_updated_on": this.dateTime, "activity_created_by": val, "activity_updated_by": val, "activity_latitude": '', "activity_longitude": '', "current_lat": this.globals.curr_lat, "current_lng": this.globals.curr_lng, "current_loc": "", "contact_id": '', "team_leader": '' }
              this.globals.updateTables('call', this.globals.m_Activities, dataArray, this.rescitem['id'], this.updateItems);
            } else {
              dataArray = { "dash_optionid": 3, "activity_date_time": this.selectedDate, "activity_type": 'To-Do', "activity_person_name": '', "activity_scheduled_type": this.typesarray[this.whichtype], "activity_ref_id": '', "activity_location": '', "activity_description": this.todoDescription, "activity_status": 'OPEN', "activity_output_type": '', "activity_output_remarks": '', "activity_output_end_datetime": this.dateTime, "next_activity_id": '', "activity_created_on": moment.utc().local().format('YYYY-MM-DDTHH:mm:ssZ'), "activity_updated_on": this.dateTime, "activity_created_by": val, "activity_updated_by": val, "activity_latitude": '', "activity_longitude": '', "current_lat": this.globals.curr_lat, "current_lng": this.globals.curr_lng, "current_loc": "", "contact_id": '', "team_leader": '' }
              this.globals.updateTables('call', this.globals.m_Activities, dataArray);
            }

            // if (this.updateItems) {
            //   dataArray = { "dash_optionid": 3, "activity_date_time": this.selectedDate, "activity_type": 'Todo', "activity_person_name": '', "activity_scheduled_type": this.typesarray[this.whichtype], "activity_ref_id": this.activtiyrefid, "activity_location": '', "activity_description": this.todoDescription, "activity_status": '1', "activity_output_type": this.updateItems['type'], "activity_output_remarks": this.updateItems['description'], "activity_output_end_datetime": this.dateTime, "next_activity_id": '', "activity_created_on": this.dateTime, "activity_updated_on": moment.utc().local().format('YYYY-MM-DDTHH:mm:ssZ'), "activity_created_by": val, "activity_updated_by": val, "latitude": '', "longitude": '' , "current_lat": this.globals.curr_lat, "current_lng": this.globals.curr_lng, "current_loc": "", "contact_id": '', "team_leader": 'DONT KNOW'}
            //   this.globals.updateTables('todo', this.globals.m_Activities, dataArray, this.items['id'], this.updateItems);
            // } else {
            //   if (this.taskStatus == '') {
            //     dataArray = { "dash_optionid": 3, "activity_date_time": this.selectedDate, "activity_type": 'Todo', "activity_person_name": '', "activity_scheduled_type": this.typesarray[this.whichtype], "activity_ref_id": this.activtiyrefid, "activity_location": '', "activity_description": this.todoDescription, "activity_status": 'OPEN', "activity_output_type": '', "activity_output_remarks": '', "activity_output_end_datetime": this.dateTime, "next_activity_id": '', "activity_created_on": moment.utc().local().format('YYYY-MM-DDTHH:mm:ssZ'), "activity_updated_on": this.dateTime, "activity_created_by": val, "activity_updated_by": val, "activity_latitude": '', "activity_longitude": '' , "current_lat": this.globals.curr_lat, "current_lng": this.globals.curr_lng, "current_loc": "", "contact_id": '', "team_leader": 'DONT KNOW'}
            //     this.globals.updateTables('todo', this.globals.m_Activities, dataArray);
            //   } else {
            //     dataArray = { "dash_optionid": 3, "activity_date_time": this.selectedDate, "activity_type": 'Todo', "activity_person_name": '', "activity_scheduled_type": this.typesarray[this.whichtype], "activity_ref_id": this.activtiyrefid, "activity_location": '', "activity_description": this.todoDescription, "activity_status": this.taskStatus, "activity_output_type": '', "activity_output_remarks": '', "activity_output_end_datetime": this.dateTime, "next_activity_id": '', "activity_created_on": moment.utc().local().format('YYYY-MM-DDTHH:mm:ssZ'), "activity_updated_on": this.dateTime, "activity_created_by": val, "activity_updated_by": val, "activity_latitude": '', "activity_longitude": '' , "current_lat": this.globals.curr_lat, "current_lng": this.globals.curr_lng, "current_loc": "", "contact_id": '', "team_leader": 'DONT KNOW'}
            //     this.globals.updateTables('todo', this.globals.m_Activities, dataArray);
            //   }
            // }

            setTimeout(() => {
              var sql = 'SELECT * from ' + this.globals.m_Activities;
              this.recordsList = this.globals.selectTables(sql);
              if (this.globals.isNetworkConnected) {
                setTimeout(() => {
                  this.storage.get('token').then((val) => {
                    this.user.postMethod('sync', JSON.stringify(this.recordsList), { 'Authorization': val }).subscribe((resp) => {
                      console.log("Respis" + JSON.stringify(resp));
                    })
                  })
                }, 100);
              } else {
                let toast = this.toastCtrl.create({
                  message: 'Check Your Internet connection',
                  duration: 3000,
                  position: 'bottom'
                });

                toast.present();
              }
              loading.dismiss();
              this.navCtrl.push(DashboardPage);
            }, 100);
          }
      })

      } else {
        let toast = this.toastCtrl.create({
          message: 'Please Enter mandatory fields',
          duration: 3000,
          position: 'bottom'
        });
        loading.dismiss();
        toast.present();
      }

    }, 500);

  }


}
