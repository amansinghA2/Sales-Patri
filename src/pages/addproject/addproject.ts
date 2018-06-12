import { ProjectlistPage } from './../projectlist/projectlist';
import { User } from './../../providers/user/user';
import { Globals } from './../../app/globals';
import { NgZone } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheetController } from 'ionic-angular'

declare var google;

/**
 * Generated class for the AddprojectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addproject',
  templateUrl: 'addproject.html',
})
export class AddprojectPage implements OnInit {

  builderName = '';
  projectName = '';
  developerName = '';
  source = '';
  projectLocation = '';
  totalUnits = '';
  avgUnits = '';
  projectStatus = '';
  selectedItem = '';
  activityrefid = '';
  showListsubtype = false;
  seletedItemFromList = false;
  autocomplete: any;
  GoogleAutocomplete: any;
  autocompleteItems: any;
  address = '';
  latitude: any;
  longitude: any;
  sourceListArray: any;
  projectStatusArray = ['Inactive', 'Active', 'Dead'];
  projectList = [];
  baseimg: string;
  imagesArray = [];

  constructor(public navCtrl: NavController, public camera: Camera, public navParams: NavParams, public zone: NgZone, public globals: Globals, public toastCtrl: ToastController, public storage: Storage, public user: User ,public actionSheetCtrl: ActionSheetController) {
  }

  ngOnInit() {

    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];

    var sql = 'SELECT * from ' + this.globals.m_Source_Master;
    this.sourceListArray = this.globals.selectTables(sql);

    setTimeout(() => {
      if (this.sourceListArray.length > 0) {
        // this.selectedItem = this.sourceListArray[0]['source_name'];
        this.activityrefid = this.sourceListArray[0]['source_id'];
      }
    }, 150);

    this.projectStatus = 'Inactive';

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddprojectPage');
  }


  updateSubtypeSearchResult(ev: any) {

    var sql = 'SELECT * from ' + this.globals.m_Source_Master;
    this.sourceListArray = this.globals.selectTables(sql);

    this.showListsubtype = false;
    setTimeout(() => {
      let val = ev.target.value;

      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
        this.showListsubtype = true;
        this.sourceListArray = this.sourceListArray.filter((item) => {
          return (item['source_name'].toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      } else {
        this.showListsubtype = false;
      }

    }, 200);

  }


  selectSubTypeSearchResult(item) {

    if (this.selectedItem != '') {
      this.seletedItemFromList = true;
    }

    this.showListsubtype = false;

    this.selectedItem = item['source_name'];

    this.selectedItem = item.source_name;
    this.activityrefid = item.source_id;


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

  projectStatusChange(item) {

  }

  imageCaptureClicked() {
    this.presentActionSheet();
  }

  submitEvent() {

    if (this.globals.isNetworkConnected) {
      this.globals.codeLatLng();
    }

    if (this.selectedItem == '') {

      let toast = this.toastCtrl.create({
        message: 'Sub Type canot be left blank',
        duration: 3000,
        position: 'bottom'
      });

      toast.present();

    } else if (this.seletedItemFromList == false) {

      let toast = this.toastCtrl.create({
        message: 'Please select valid subtype to continue',
        duration: 3000,
        position: 'bottom'
      });

      toast.present();

    } else {


      if (this.builderName != '' && this.projectName != '' && this.developerName != '' && this.address != '' && this.totalUnits != '' && this.avgUnits != '' && this.projectStatus != '') {
       
        this.storage.get('empid').then((val1) => {

        var dataArray = {"emp_id":val1 , "builder_group": this.builderName, "project_name": this.projectName, "developer_name": this.developerName,"source_name":  this.selectedItem, "source_id": this.activityrefid, "project_location": this.address, "project_lat": this.latitude, "project_lng": this.longitude, "total_unit": this.totalUnits, "avg_val_unit": this.avgUnits, "project_status": this.projectStatus }
        this.globals.updateTables('meeting', this.globals.m_Add_Project, dataArray);

        setTimeout(() => {

          var sql = 'SELECT * from ' + this.globals.m_Add_Project;
          this.projectList = this.globals.selectTables(sql);

          if (this.globals.isNetworkConnected) {
            setTimeout(() => {

              this.storage.get('token').then((val) => {
                this.user.postMethod('project_sync', JSON.stringify(this.projectList), { 'Authorization': val }).subscribe((resp) => {
                  console.log("Sucessssssss" + JSON.stringify(resp));
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
          this.navCtrl.push(ProjectlistPage ,{val:'fromaddproject'});
        }, 200);
      })
      } else {

        let toast = this.toastCtrl.create({
          message: 'Please Enter mandatory fields',
          duration: 3000,
          position: 'bottom'
        });

        toast.present();

      }
 
    }
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your album',
      buttons: [
        {
          text: 'Gallery',
          handler: () => {
           this.cameraClicked(0);
            console.log('Destructive clicked');
          }
        },
        {
          text: 'Take Photo',
          handler: () => {

            this.cameraClicked(1);
            console.log('Archive clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
 
    actionSheet.present();
  }

 cameraClicked(sourceType){

  const options: CameraOptions = {
    quality: 100,
    targetWidth: 900,
    targetHeight: 600,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    saveToPhotoAlbum: false,
    allowEdit: true,
    sourceType: sourceType
  }

  this.camera.getPicture(options).then((imageData) => {
  this.baseimg = 'data:image/jpeg;base64,' + imageData;

  this.imagesArray.push(this.baseimg);

  // for(let i = 0 ; i < this.imagesArray.length ; i++){
    let cameraImageSelector = document.getElementById('camera-image');
    cameraImageSelector.setAttribute('src', this.baseimg);
  // }
 

  // this.imagesArray.push(this.baseimg);

    // this.user.postMethod('upload_profile', JSON.stringify({profile_picture:this.baseimg , }), { 'Content-Type': 'application/x-www-form-urlencoded' }).subscribe((resp) => {
    //   // console.log(JSON.stringify(resp));
    // }, (err) => {
    //   let toast = this.toastCtrl.create({
    //     message: 'Image Upload Issue',
    //     duration: 3000,
    //     position: 'bottom'
    //   });
    //   //  this.ng4LoadingSpinnerService.hide();
    //   toast.present();
    // });

  }, (err) => {
    alert("Failed to capture image");
  });


 }

}
