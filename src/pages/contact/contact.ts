import { ContactlistPage } from './../contactlist/contactlist';
import { User } from './../../providers/user/user';
import { Api } from './../../providers/api/api';
import { NgZone } from '@angular/core';
import { NotificationsPage } from './../notifications/notifications';
import { SchedulecallPage } from './../schedulecall/schedulecall';
import { MeetingPage } from './../meeting/meeting';
import { Globals } from './../../app/globals';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Platform } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { EmailComposer } from '@ionic-native/email-composer';


declare var google;

/**
 * Generated class for the ContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage implements OnInit {

  user: FormGroup;
  fromWhichPage: any;
  contactList: any;
  isDuplicateEmail = false;
  notificationList: any;
  autocompleteItems: any;
  GoogleAutocomplete: any;
  default_lat: any;
  default_lng: any;
  isnotificationseen: any;
  locationmaps = '';
  selectedItem:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public globals: Globals, public toastCtrl: ToastController, public loading: LoadingController, public platform: Platform, public zone: NgZone, public storage: Storage , public api:Api , public user1:User , private emailComposer: EmailComposer) {

    this.autocompleteItems = [];
    platform.ready().then(() => {

      var sql = 'SELECT * from ' + this.globals.m_Notifications;
      this.notificationList = this.globals.selectTables(sql);

      this.storage.get('isseennotification').then((val) => {
        this.isnotificationseen = val;
      })

    });

    if (this.navParams.get('page')) {
      this.fromWhichPage = this.navParams.get('page');
    }

    if (this.navParams.get('selectedItem')) {
      this.selectedItem = this.navParams.get('selectedItem');
    }

    
  }

  ngOnInit() {

    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();

    this.user = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(4)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      mob: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      dob: new FormControl('', [Validators.required]),
      meetaddr: new FormControl('', [Validators.required])
    });

    var sql = 'SELECT * from ' + this.globals.m_ContactDetails;
    this.contactList = this.globals.selectTables(sql);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactPage');
  }

  showNotifications() {
    this.navCtrl.push(NotificationsPage);
  }

  updateSearchResults() {
    if (this.user.get('meetaddr').value == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.user.get('meetaddr').value },
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
    this.locationmaps = item['description'];

    this.user.controls['meetaddr'].setValue(item['description']);

    this.autocompleteItems = [];

    var geocoder = new google.maps.Geocoder;

    geocoder.geocode({ 'placeId': item.place_id }, (results, status) => {

      this.default_lat = results[0].geometry.location.lat();
      this.default_lng = results[0].geometry.location.lng();

    })
  }

  
  submitEvent() {
    this.isDuplicateEmail = false;
    var dataArray;
    // console.log("OCntact data" + this.user.get('meetaddr').value + this.default_lat + this.default_lng);

    for (let i = 0; i < this.contactList.length; i++) {
      if (this.contactList[i]['contact_email_1'] == this.user.get('email').value) {
        this.isDuplicateEmail = true;
      }
    }

    if (this.locationmaps == '') {
      let toast = this.toastCtrl.create({
        message: 'Choose location from the drop down list to continue',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    } else
      if (this.isDuplicateEmail == true) {
        let toast = this.toastCtrl.create({
          message: 'This email id is already registered, please use different id',
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      } else {

        this.storage.get('empid').then((val) => {
        dataArray = {"ref_id":'' , "contact_name": this.user.get('name').value, "contact_number_1": this.user.get('mob').value, "contact_number_2": '', "contact_email_1": this.user.get('email').value, "contact_email_2": '', "contact_dob": this.user.get('dob').value, "contact_created_on": '', "contact_updated_on": '', "contact_created_by": val, "contact_updated_by": '', "def_addr": this.user.get('meetaddr').value, "def_lat": this.default_lat, "def_lng": this.default_lng }
        this.globals.updateTables('meeting', this.globals.m_ContactDetails, dataArray);

        setTimeout(() => {
          var sql = 'SELECT * from ' + this.globals.m_ContactDetails;
          this.contactList = this.globals.selectTables(sql);

          if (this.globals.isNetworkConnected) {
            setTimeout(() => {
              this.storage.get('token').then((val) => {
                this.user1.postMethod('activity_sync', JSON.stringify(this.contactList), { 'Authorization': val }).subscribe((resp) => {
                  console.log("contact resp" + JSON.stringify(resp));
                })
              })
            }, 200);
          } else {
            let toast = this.toastCtrl.create({
              message: 'Sync unsuccessful , check your internet connection and try again',
              duration: 3000,
              position: 'bottom'
            });
            toast.present();
          }

        }, 150);
    

        if (this.fromWhichPage == 'meeting') {
          this.navCtrl.push(MeetingPage, { dataArray:dataArray , selectedItem:this.selectedItem });
        } else if (this.fromWhichPage == 'call'){
          this.navCtrl.push(SchedulecallPage, { dataArray:dataArray , selectedItem:this.selectedItem });
        }else{
          this.navCtrl.push(ContactlistPage);
        }

      })
  

       
        
      }

   
  }

}
