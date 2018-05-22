import { ContactPage } from './../contact/contact';
import { User } from './../../providers/user/user';
import { MeetingupdatePage } from './../meetingupdate/meetingupdate';
import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { MapPage } from './../map/map';
import { Globals } from './../../app/globals';
import { HttpModule, Http } from '@angular/http';
import { Component, NgModule, OnInit, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController, LoadingController } from 'ionic-angular';
import { ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { MeetingPage } from './../meeting/meeting';
import { DashboardPage } from './../dashboard/dashboard';
import moment from 'moment';
import { NotificationsPage } from './../notifications/notifications';


/**
 * Generated class for the SchedulecallPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;

@IonicPage()
@Component({
  selector: 'page-schedulecall',
  templateUrl: 'schedulecall.html',
})


export class SchedulecallPage {

  typesarray = [];
  keyArray;
  typeDict;

  whichtype: string;
  selectedItem: string;
  dateTime: string;
  meetingLocation: string;
  meetingPerson: string;
  meetingDescription: string;
  pushDateString: any;

  selectedTime: any;

  latitude: number;
  longitude: number;
  selectedDate: string;
  updateItems: any;

  recordsList = [];

  myDate;
  myTime;
  items;
  keys;
  taskStatus = '';
  rescitem: any;
  meetingPersonn = '';
  contactArray: any;
  contactId: any;

  showList = false;
  contactList: any;
  notificationList: any;
  lfdgsqArray = [];
  activityrefid = '';
  autocomplete: any;
  address = '';
  isLeader = false;

  GoogleAutocomplete: any;
  autocompleteItems: any;
  showListsubtype = false;
  whichname = '';

  constructor(private platform: Platform, public navCtrl: NavController, public navParams: NavParams, public http: Http, public globals: Globals, public cd: ChangeDetectorRef, public localNotifications: LocalNotifications, public toastCtrl?: ToastController, public storage?: Storage, public user?: User, public loadingCtrl?: LoadingController, public zone?: NgZone) {

    this.pageInit();

  }

  pageInit() {

    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];

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
      this.rescitem = this.navParams.get('rescitem');
      // this.whichtype = this.globals.typeSelect(this.updateItems['type']);
      this.whichtype = 'Lead Activity';
    }

    if (this.navParams.get('item')) {
      this.items = this.navParams.get('item');
      this.meetingPerson = this.items['activity_person_name'];
      this.meetingPersonn = this.meetingPerson;
      this.meetingDescription = this.items['activity_description'];
    }

    if (this.navParams.get('dataArray')) {
      this.contactArray = this.navParams.get('dataArray');
      this.meetingPerson = this.contactArray['contact_name'];
      this.address = this.contactArray['def_addr'];
      this.latitude = this.contactArray['def_lat'];
      this.longitude = this.contactArray['def_lng'];
      this.meetingPersonn = this.meetingPerson;

      setTimeout(() => {

        for (let i = 0; i < this.contactList.length; i++) {

          if (this.contactList[i]['contact_email_1'] == this.contactArray['contact_email_1']) {

            this.contactId = this.contactList[i]['id'];
          }

        }

      }, 500);

    }

    var sql = 'SELECT * from ' + this.globals.m_Notifications;
    this.notificationList = this.globals.selectTables(sql);

    this.getJSON(this.http);


  }

  getJSON(http) {

    this.getcallmettingtypeJSON(http).subscribe(data => {

      this.typesarray = data['MeetingType'];
      this.keys = Object.keys(this.typesarray);

      this.lfdgsqtype('ontype', '');

    }, error => console.log(JSON.stringify("aa" + error)));


  }

  getcallmettingtypeJSON(http): Observable<any> {
    return http.get("assets/callmeetingleadtype.json")
      .map((res: any) => res.json());
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  lfdgsqtype(from, item) {

    var sql;
    switch (this.typesarray[this.whichtype]) {
      case 'L':
        this.whichname = 'name';
        if (from == 'onsearch') {
          sql = 'SELECT * from ' + this.globals.m_Lead_Master;
          this.lfdgsqArray = this.globals.selectTables(sql);
        } else
          if (from == 'ontype') {
            sql = 'SELECT * from ' + this.globals.m_Lead_Master;
            this.lfdgsqArray = this.globals.selectTables(sql);
            setTimeout(() => {
              this.selectedItem = this.lfdgsqArray[0]['name'];
              this.activityrefid = this.lfdgsqArray[0]['lead_no'];
            }, 500);
          } else {
            for (let i = 0; i < this.lfdgsqArray.length; i++) {
              if (this.lfdgsqArray[i]['name'] == item.name) {
                this.selectedItem = item.name;
                this.activityrefid = this.lfdgsqArray[i]['lead_no'];
              }
            }
          }
        break;
      case 'F':
        this.whichname = 'name';
        if (from == 'onsearch') {
          this.lfdgsqArray = [{ "name": "Option A" }, { "name": "Option B" }, { "name": "Option C" }];

        } else
          if (from == 'ontype') {
            this.lfdgsqArray = [{ "name": "Option A" }, { "name": "Option B" }, { "name": "Option C" }];
            setTimeout(() => {
              this.selectedItem = this.lfdgsqArray[0]['source_name'];
            }, 500);
          } else {
            for (let i = 0; i < this.lfdgsqArray.length; i++) {
              if (this.lfdgsqArray[i]['name'] == item.name) {
              }
            }
          }
        break;
      case 'D':
        this.whichname = 'name';
        if (from == 'onsearch') {
          this.lfdgsqArray = [{ "name": "Option A" }, { "name": "Option B" }, { "name": "Option C" }];
        } else
          if (from == 'ontype') {
            this.lfdgsqArray = [{ "name": "Option A" }, { "name": "Option B" }, { "name": "Option C" }];
            setTimeout(() => {
              this.selectedItem = this.lfdgsqArray[0]['source_name'];
            }, 500);
          } else {
            for (let i = 0; i < this.lfdgsqArray.length; i++) {
              if (this.lfdgsqArray[i]['name'] == item.name) {
              }
            }
          }
        break;
      case 'G':
        this.whichname = 'name';
        if (from == 'onsearch') {
          this.lfdgsqArray = [{ "name": "Option A" }, { "name": "Option B" }, { "name": "Option C" }];

        } else
          if (from == 'ontype') {
            this.lfdgsqArray = [{ "name": "Option A" }, { "name": "Option B" }, { "name": "Option C" }];
            setTimeout(() => {
              this.selectedItem = this.lfdgsqArray[0]['source_name'];
            }, 500);
          } else {
            for (let i = 0; i < this.lfdgsqArray.length; i++) {
              if (this.lfdgsqArray[i]['name'] == item.name) {

              }
            }
          }
        break;
      case 'S':
        this.whichname = 'source_name';
        if (from == 'onsearch') {
          sql = 'SELECT * from ' + this.globals.m_Source_Master;
          this.lfdgsqArray = this.globals.selectTables(sql);
        } else
          if (from == 'ontype') {
            sql = 'SELECT * from ' + this.globals.m_Source_Master;
            this.lfdgsqArray = this.globals.selectTables(sql);
            setTimeout(() => {
              this.selectedItem = this.lfdgsqArray[0]['source_name'];
              this.activityrefid = this.lfdgsqArray[0]['source_id'];
            }, 500);
          } else {

            for (let i = 0; i < this.lfdgsqArray.length; i++) {
              if (this.lfdgsqArray[i]['source_name'] == item.source_name) {
                this.selectedItem = item['source_name'];
                this.activityrefid = this.lfdgsqArray[i]['source_id'];
              }
            }
          }
        break;
      case 'Q':
        this.whichname = 'name';
        if (from == 'onsearch') {
          this.lfdgsqArray = [{ "name": "Option A" }, { "name": "Option B" }, { "name": "Option C" }];

        } else
          if (from == 'ontype') {
            this.lfdgsqArray = [{ "name": "Option A" }, { "name": "Option B" }, { "name": "Option C" }];
            setTimeout(() => {
              this.selectedItem = this.lfdgsqArray[0]['source_name'];
            }, 500);
          } else {
            for (let i = 0; i < this.lfdgsqArray.length; i++) {
              if (this.lfdgsqArray[i]['name'] == item.name) {
              }
            }
          }
        break;
    }
  }

  showNotifications() {
    this.navCtrl.push(NotificationsPage);
  }

  onTypeChange(item) {
    this.lfdgsqtype('ontype', '');
  }


  updateSubtypeSearchResult(ev: any) {

    this.lfdgsqtype('onsearch', '');
    this.showListsubtype = false;
    setTimeout(() => {
      let val = ev.target.value;
      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
        this.showListsubtype = true;
        this.lfdgsqArray = this.lfdgsqArray.filter((item) => {
          return (item[this.whichname].toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      } else {
        this.showListsubtype = false;
      }

    }, 200);

  }

  selectSubTypeSearchResult(item) {
    this.lfdgsqtype('onchange', item);
    this.showListsubtype = false;
  }

  updateSearchResults() {
    if (this.address == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.address },
      (predictions, status) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction);
          });
        });
      });
  }

  selectSearchResult(item) {
    // this.clearMarkers();

    this.address = item['description'];
    this.autocompleteItems = [];

    var geocoder = new google.maps.Geocoder;

    geocoder.geocode({ 'placeId': item.place_id }, (results, status) => {

      this.latitude = results[0].geometry.location.lat();
      this.longitude = results[0].geometry.location.lng();

    })

  }


  getPersonsList(ev: any) {
    // Reset items back to all of the items
    var sql = 'SELECT * from ' + this.globals.m_ContactDetails;
    this.contactList = this.globals.selectTables(sql);

    // set val to the value of the searchbar
    setTimeout(() => {
      let val = ev.target.value;

      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
        this.showList = true;
        this.contactList = this.contactList.filter((item) => {
          return (item.contact_name.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.contact_number_1.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      } else {
        this.showList = false;
      }
    }, 500);

  }


  personClicked(item) {
    this.meetingPerson = item['contact_name'];
    this.address = item['def_addr'];
    this.latitude = item['def_lat'];
    this.longitude = item['def_lng'];
    this.contactId = item['id'];
    this.meetingPersonn = this.meetingPerson;
    this.showList = false;
  }

  // onChange(item) {
  //   this.lfdgsqtype('onchange', item);
  // }


  addContact() {
    this.navCtrl.push(ContactPage, { page: 'call' });
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

  submitEvent() {

    console.log("lat" + this.latitude + "lng" + this.longitude + "addr11 " + this.address);

    if (this.globals.isNetworkConnected) {
      this.globals.codeLatLng();
    }

    if (this.meetingPersonn == '') {

      let toast = this.toastCtrl.create({
        message: 'Please add the new name first to continue',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();

    } else {

      var loading = this.loadingCtrl.create({
        content: 'Loading Please wait...'
      });

      loading.present();

      var dataArray;

      setTimeout(() => {

        if (this.meetingPerson != '' && this.meetingDescription != '' && this.address != '') {

          this.storage.get('empid').then((val) => {

            this.localNotifications.schedule({
              text: 'Call with ' + this.meetingPerson + ' scheduled on ' + this.selectedDate + ' at ' + this.selectedTime,
              trigger: { at: new Date(moment.utc(this.pushDateString).local().valueOf() - 10 * 1000) },
              led: 'FF0000',
              sound: null,
              icon: 'file://assets/imgs/icon.png',
              smallIcon: 'file://assets/imgs/icon.png',
            });

            var notifyArray = { "notification_id": '', "notification_from": '', "notification_to": '', "notification_redirect_url": '', "notification_title": 'Meeting Scheduled', "notification_descripiton": 'Metting with ' + this.meetingPerson + ' scheduled on ' + this.selectedDate + ' at ' + this.selectedTime, "notification_is_unread": '', "notification_created_on": '', "notification_updated_on": '' };
            this.globals.updateTables('notification', this.globals.m_Notifications, notifyArray);

            if (this.items) {

              dataArray = { "dash_optionid": 2, "activity_date_time": this.selectedDate, "activity_type": 'Call', "activity_person_name": this.meetingPerson, "activity_scheduled_type": this.typesarray[this.whichtype], "activity_ref_id": this.activityrefid, "activity_location": this.address, "activity_description": this.meetingDescription, "activity_status": 'ATTENDED', "activity_output_type": this.updateItems['type'], "activity_output_remarks": this.updateItems['description'], "activity_output_end_datetime": this.dateTime, "next_activity_id": '', "activity_created_on": this.dateTime, "activity_updated_on": moment.utc().local().format('YYYY-MM-DDTHH:mm:ssZ'), "activity_created_by": val, "activity_updated_by": val, "activity_latitude": this.latitude, "activity_longitude": this.longitude, "current_lat": this.globals.curr_lat, "current_lng": this.globals.curr_lng, "current_loc": "", "contact_id": this.contactId, "team_leader": this.isLeader }
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

            } else {

              if (this.updateItems) {
                dataArray = { "dash_optionid": 2, "activity_date_time": this.selectedDate, "activity_type": 'Call', "activity_person_name": this.meetingPerson, "activity_scheduled_type": this.typesarray[this.whichtype], "activity_ref_id": this.activityrefid, "activity_location": this.address, "activity_description": this.meetingDescription, "activity_status": 'POSTPONE', "activity_output_type": '', "activity_output_remarks": '', "activity_output_end_datetime": this.dateTime, "next_activity_id": '', "activity_created_on": moment.utc().local().format('YYYY-MM-DDTHH:mm:ssZ'), "activity_updated_on": this.dateTime, "activity_created_by": val, "activity_updated_by": val, "activity_latitude": this.latitude, "activity_longitude": this.longitude, "current_lat": this.globals.curr_lat, "current_lng": this.globals.curr_lng, "current_loc": "", "contact_id": this.contactId, "team_leader": this.isLeader }
                this.globals.updateTables('call', this.globals.m_Activities, dataArray, this.rescitem['id'], this.updateItems);
              } else {
                dataArray = { "dash_optionid": 2, "activity_date_time": this.selectedDate, "activity_type": 'Call', "activity_person_name": this.meetingPerson, "activity_scheduled_type": this.typesarray[this.whichtype], "activity_ref_id": this.activityrefid, "activity_location": this.address, "activity_description": this.meetingDescription, "activity_status": 'OPEN', "activity_output_type": '', "activity_output_remarks": '', "activity_output_end_datetime": this.dateTime, "next_activity_id": '', "activity_created_on": moment.utc().local().format('YYYY-MM-DDTHH:mm:ssZ'), "activity_updated_on": this.dateTime, "activity_created_by": val, "activity_updated_by": val, "activity_latitude": this.latitude, "activity_longitude": this.longitude, "current_lat": this.globals.curr_lat, "current_lng": this.globals.curr_lng, "current_loc": "", "contact_id": this.contactId, "team_leader": this.isLeader }
                this.globals.updateTables('call', this.globals.m_Activities, dataArray);
              }

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
          });

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


}


