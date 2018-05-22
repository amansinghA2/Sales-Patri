import { SchedulecallPage } from './../schedulecall/schedulecall';
import { MeetingPage } from './../meeting/meeting';
import { DashboardPage } from './../dashboard/dashboard';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { Globals } from '../../app/globals';
import { TodoitemPage } from './../todoitem/todoitem';
import { Storage } from '@ionic/storage';
import { NotificationsPage } from './../notifications/notifications';


/**
 * Generated class for the MeetingupdatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-meetingupdate',
  templateUrl: 'meetingupdate.html',
})
export class MeetingupdatePage {

  options:any;
  selected:any;
  outputdescriptiontext = '';
  whichtype:any;
  meetingbuttoncolor = '#0E0438';
  callbuttoncolor = '#0E0438';
  meetingbuttontext = 'Schedule Meeting'
  callbuttontext = 'Schedule Call';
  // whichtypeArray = [{name:"L" , selected:false} , {name:"F" , selected:false} , {name:"D" , selected:false} , {name:"G" , selected:false} , {name:"S" , selected:false} , {name:"Q" , selected:false}];
  whichtypeArray = ["L" , "F" , "D" , "G"  , "S"  , "Q"];
  item:any;
  changecolor:any;
  cancellingReasons = ['Not well' , 'Need Help' , 'Option 3']
  descriptiontext = '';
  notificationList:any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams , public globals:Globals , public modalCtrl:ModalController,public storage:Storage , public loadingCtrl:LoadingController ,public toastCtrl:ToastController) {

    this.options = "attended";
    this.item = this.navParams.get('item');
    this.changecolor = this.navParams.get('val');

    this.selected = 'L';

    if(this.changecolor == 'meeting'){
      this.meetingbuttoncolor = 'green';
      this.meetingbuttontext = 'Meeting Scheduled';
    }else if(this.changecolor == 'call'){
      this.callbuttoncolor = 'green';
      this.callbuttontext = 'Call Scheduled';
    }

    var sql = 'SELECT * from ' + this.globals.m_Notifications;
    this.notificationList = this.globals.selectTables(sql);
  

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MeetingupdatePage');
  }

  showNotifications(){
    this.navCtrl.push(NotificationsPage);
    }

  whichTypeClicked(type){
    this.selected = type; 
  }

  isActive(item) {
    return this.selected === item;
  }

  scheduleMeeting(){
    var item = this.item;
    this.navCtrl.push(MeetingPage , {item});
  }

  scheduleCall(){
    var item = this.item;
    this.navCtrl.push(SchedulecallPage , {item});
  }

  modalPage(page:any , val){
    this.globals.profileModal = this.modalCtrl.create(page , val);
    this.globals.profileModal.present();
  }
  
  reSchedule(){

    var updateItems = {type:this.selected , description:this.outputdescriptiontext ,val: 'POSTPONE'};
      if(this.item['activity_type'] == 'Meeting'){
        // this.modalPage(MeetingPage , {val: 'POSTPONE'} );
        this.navCtrl.push(MeetingPage , {params: updateItems , rescitem:this.item});
      }else if(this.item['activity_type'] == 'Call'){
        // this.modalPage(SchedulecallPage ,{val: 'POSTPONE'});
        this.navCtrl.push(SchedulecallPage ,{params: updateItems , rescitem:this.item});
      }else{
        // this.modalPage(TodoitemPage ,{val: 'POSTPONE'});
        this.navCtrl.push(TodoitemPage ,{params: updateItems , rescitem:this.item});
      }

  }

  updateCancelSubmitCalled(){

    var loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

   if(this.selected != '' &&  this.outputdescriptiontext != ''){

    var updateItems = {type:this.selected , description:this.outputdescriptiontext ,val: ''};

   if(this.options == 'attended'){
    var dataArray = {"dash_optionid": this.item['dash_optionid'] ,"activity_date_time":this.item['activity_date_time'], "activity_type":this.item['activity_type'], "activity_person_name":this.item['activity_person_name'] ,"activity_scheduled_type":this.item['activity_scheduled_type'],"activity_ref_id":this.item['activity_ref_id'],"activity_location":this.item['activity_location'],"activity_description":this.item['activity_description'],"activity_status":"ATTENDED","activity_output_type":this.selected,"activity_output_remarks":this.outputdescriptiontext ,"activity_output_end_datetime":this.item['activity_output_end_datetime'] ,"next_activity_id":'' ,"activity_created_on":this.item['activity_created_on'] ,"activity_updated_on":this.item['activity_updated_on'] ,"activity_created_by":this.item['activity_created_by'] ,"activity_updated_by":this.item['activity_updated_by'],"activity_latitude":this.item['activity_latitude'],"activity_longitude":this.item['activity_longitude'], "current_lat": this.globals.curr_lat, "current_lng": this.globals.curr_lng, "current_loc": "" , "contact_id":this.item['contact_id'],"team_leader":this.item['team_leader']}
    this.globals.updateTables('meeting'  , this.globals.m_Activities  , dataArray , this.item['id'], updateItems);
   }

   setTimeout(() => {
    loading.dismiss();
    this.navCtrl.push(DashboardPage);
  }, 1000);

  }else if(this.whichtype != '' && this.selected != ''  && this.descriptiontext != '' ){
      var updateItems = {type:this.selected , description:this.descriptiontext ,val: ''};
    if(this.options != 'attended'){
      var dataArray = {"dash_optionid": this.item['dash_optionid'] ,"activity_date_time":this.item['activity_date_time'], "activity_type":this.item['activity_type'], "activity_person_name":this.item['activity_person_name'] ,"activity_scheduled_type":this.item['activity_scheduled_type'],"activity_ref_id":this.item['activity_ref_id'],"activity_location":this.item['activity_location'],"activity_description":this.item['activity_description'],"activity_status":"CANCEL","activity_output_type":this.selected,"activity_output_remarks":this.descriptiontext ,"activity_output_end_datetime":this.item['activity_output_end_datetime'] ,"next_activity_id":'' ,"activity_created_on":this.item['activity_created_on'] ,"activity_updated_on":this.item['activity_updated_on'] ,"activity_created_by":this.item['activity_created_by'] ,"activity_updated_by":this.item['activity_updated_by'],"activity_latitude":this.item['activity_latitude'],"activity_longitude":this.item['activity_longitude'] , "current_lat": this.globals.curr_lat, "current_lng": this.globals.curr_lng, "current_loc": "" , "contact_id":this.item['contact_id'],"team_leader":this.item['team_leader'] }
      this.globals.updateTables('meeting'  , this.globals.m_Activities  , dataArray , this.item['id'], updateItems);
     }

     setTimeout(() => {
      loading.dismiss();
      this.navCtrl.push(DashboardPage);
    }, 1000);
    
  }else{

    let toast = this.toastCtrl.create({
      message: 'Please Enter mandatory fields',
      duration: 3000,
      position: 'bottom'
    });
    loading.dismiss();
    toast.present();

  }

  }

}
