import { Globals } from './../../app/globals';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DiaryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-diary',
  templateUrl: 'diary.html',
})
export class DiaryPage {
  whichtypeArray = [];
  constructor(public navCtrl: NavController, public navParams: NavParams , public globals:Globals) {
    this.whichtypeArray = ["L" , "F" , "D" , "G"  , "S"  , "Q"];
  }

  ionViewDidLoad() {

    console.log('ionViewoad DiaryPage');
  }

}
