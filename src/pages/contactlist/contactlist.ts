import { ContactPage } from './../contact/contact';
import { ContactdetailsPage } from './../contactdetails/contactdetails';
import { Globals } from './../../app/globals';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { EmailComposer } from '@ionic-native/email-composer'; 
/**
 * Generated class for the ContactlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contactlist',
  templateUrl: 'contactlist.html',
})
export class ContactlistPage implements OnInit {

  contactList = [];
  selectedContactListArray = [];
  showListsubtype = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public globals: Globals, private callNumber: CallNumber ,private emailComposer: EmailComposer) {
  }

  ngOnInit() {

    var sql = 'SELECT * from ' + this.globals.m_ContactDetails;
    this.selectedContactListArray = this.globals.selectTables(sql);

    setTimeout(() => {
      console.log(JSON.stringify(this.selectedContactListArray));
    }, 3000);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactlistPage');
  }

  updateSubtypeSearchResult(ev: any) {

    var sql = 'SELECT * from ' + this.globals.m_ContactDetails;
    this.contactList = this.globals.selectTables(sql);

    this.showListsubtype = false;
    setTimeout(() => {

      this.selectedContactListArray = this.contactList;

      let val = ev.target.value;

      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
        this.showListsubtype = true;
        this.selectedContactListArray = this.selectedContactListArray.filter((item) => {
          return (item.contact_name.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.contact_number_1.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      } else {
        this.showListsubtype = false;
      }

    }, 200);

  }

  contactClicked(item) {
    this.navCtrl.push(ContactdetailsPage, {item});
  }

  callClicked(item) {
    this.callNumber.callNumber(item.contact_number_1, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  emailClicked(item){

    this.emailComposer.isAvailable().then((available: boolean) =>{
      if(available) {
        //Now we know we can send
      }
     });
     
     let email = {
       to: item['contact_email_1'],
       cc: '',
       bcc: [''],
       subject: '',
       body: ''
     };
     
     // Send a text message using default options
     this.emailComposer.open(email);

  }

  addContact(){
    this.navCtrl.push(ContactPage);
  }

}
