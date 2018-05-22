import { OnInit } from '@angular/core';
import { Globals } from './../../app/globals';
import { Platform, ToastController } from 'ionic-angular';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { User } from '../../providers/user/user';
import { Storage } from '@ionic/storage';
import { NotificationsPage } from './../notifications/notifications';


/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage implements OnInit{

  token:any;
  profileData:Array<{name: string , value :string}>;
  baseimg:string;
  notificationList:any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public camera: Camera , public platform:Platform , public globals:Globals , public user:User , public storage:Storage , public toastCtrl:ToastController) {
    
    var sql = 'SELECT * from ' + this.globals.m_Notifications;
    this.notificationList = this.globals.selectTables(sql);
    
    this.profileData = [
      { name: 'Name', value: '-'},
      { name: 'Official Number', value: '-'},
      { name: 'Personal Number', value: '-'},
      { name: 'Official Email',  value: '-'},
      { name: 'Personal Email', value: '-'},
      { name: 'Contact Address', value: '-'},
    ];

  }

  ngOnInit(){

    if(this.globals.isNetworkConnected){
      this.storage.get('token').then((val) => {
        this.storage.get('empid').then((val1) => {
        this.user.getMethod('get_user_info/' + '4600'  , { 'Authorization': val }).subscribe((resp) => {
          console.log(JSON.stringify(resp));
  
        var dataArray;
  
        dataArray = {"emp_id":'' , "username":resp['item']['username'] , "profile_picture":resp['item']['profile_picture'], "office_number":resp['item']['office_number'] ,"personal_number":resp['item']['personal_number'],"email":resp['item']['email'],"personal_email":resp['item']['personal_email'],"office_address":resp['item']['office_address']}
        this.globals.updateTables('meeting' ,this.globals.m_profile , dataArray);
  
        this.baseimg = resp['item']['image'];  

        let cameraImageSelector = document.getElementById('camera-image');
        cameraImageSelector.setAttribute('src', this.baseimg);

          this.profileData = [
            { name: 'Name', value: resp['item']['username']},
            { name: 'Official Number', value: resp['item']['office_number']},
            { name: 'Personal Number', value: resp['item']['personal_number']},
            { name: 'Official Email',  value: resp['item']['email']},
            { name: 'Personal Email', value: resp['item']['personal_email']},
            { name: 'Contact Address', value: resp['item']['office_address']},
          ];
  
        });
      });
      });
      
    }else{

    }
  
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  showNotifications(){
    this.navCtrl.push(NotificationsPage);
    }
    
  imageCaptureClicked(){

    const options: CameraOptions = {
      quality: 100,
      targetWidth: 900,
      targetHeight: 600,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false,
      allowEdit: true,
      sourceType: 1
    }

    this.camera.getPicture(options).then((imageData) => {
      this.baseimg = 'data:image/jpeg;base64,' + imageData;

      let cameraImageSelector = document.getElementById('camera-image');
      cameraImageSelector.setAttribute('src', this.baseimg);

        this.user.postMethod('upload_profile', JSON.stringify({profile_picture:this.baseimg , }), { 'Content-Type': 'application/x-www-form-urlencoded' }).subscribe((resp) => {
          // console.log(JSON.stringify(resp));
        }, (err) => {
          let toast = this.toastCtrl.create({
            message: 'Image Upload Issue',
            duration: 3000,
            position: 'bottom'
          });
          //  this.ng4LoadingSpinnerService.hide();
          toast.present();
        });
    
    }, (err) => {
      alert("Failed to capture image");
    });

  }

}


