import { ContactlistPage } from './../contactlist/contactlist';
import { Globals } from './../../app/globals';
import { SQLite , SQLiteObject} from '@ionic-native/sqlite';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ContactdetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contactdetails',
  templateUrl: 'contactdetails.html',
})

export class ContactdetailsPage implements OnInit {

  item: any;

  name:any;
  mob:any;
  email:any;
  defaddr:any;
  dob:any;

  constructor(public navCtrl: NavController, public navParams: NavParams , public sqlite:SQLite , public globals:Globals) {
  }

  ngOnInit() {

    this.item = this.navParams.get('item');
    console.log("Details" + JSON.stringify(this.item))

    this.name = this.item['contact_name'];
    this.mob = this.item['contact_number_1'];
    this.email = this.item['contact_email_1'];
    this.defaddr = this.item['def_addr'];
    this.dob = this.item['contact_dob'];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactdetailsPage');
  }

  submitEvent(){

    this.sqlite.create({
      name: this.globals.dbName,
      location: 'default'
  }).then((db: SQLiteObject) => {
    db.executeSql('UPDATE m_ContactDetails SET contact_name=? , contact_number_1=? , contact_email_1=? , def_addr=? WHERE id=?', [this.name , this.mob ,this.email ,this.defaddr,  this.item['id']])
    .then(res => {
        console.log("m_ContactDetailsupadtee inserted");
        this.navCtrl.push(ContactlistPage);
    })

  })

  }

}
