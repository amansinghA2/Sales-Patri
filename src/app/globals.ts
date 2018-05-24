import { Geolocation } from '@ionic-native/geolocation';
import { Network } from '@ionic-native/network';
import { Http } from '@angular/http';
import { Injectable, OnInit, NgZone, ApplicationRef } from "@angular/core";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { Component ,Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Platform, NavController, ToastController, AlertController } from "ionic-angular";
import { Observable } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';

declare var google;

@Component({
    templateUrl: 'globals.html'
  })

@Injectable()
export class Globals {
subscription:any;

    constructor(public sqlite: SQLite, public platform: Platform, public http: Http, public network: Network, public storage: Storage, public geolocation: Geolocation, public ngZone: NgZone, public cdRef: ApplicationRef , public toastCtrl:ToastController , public openNativeSetting:OpenNativeSettings , public alertCtrl:AlertController) {
        this.ngZone = ngZone;
        this.platform.ready().then(() => {

            this.createTables();

        });

        
    
    }

    profileModal: any;
    footerSelectedItem = 'Home';

    dbName = "salespatri.db";

    lfdgsqarray: any;

    token: any;
    typesarray: any;
    keys: any;
    keyArray: any;

    results1: any;

    loading: any;

    m_EmployeeDetails = "m_EmployeeDetails";
    m_Activities = "m_Activities";
    Acitity_Person_Relationship = "Acitity_Person_Relationship";
    m_ContactDetails = "m_ContactDetails";
    m_Source_Master = "m_Source_Master";
    m_Lead_Master = "m_Lead_Master";
    m_Goals_Master = "m_Goals_Master";
    m_Para_Master = "m_Para_Master";
    m_Images = "m_Images";
    m_Lead_Screen = "m_Lead_Screen";
    m_HolidayList = "m_HolidayList";
    m_Attendance = "m_Attendance";
    m_WhatsNew = "m_WhatsNew";
    m_Notifications = "m_Notifications";
    m_user_session = "m_user_session";
    m_user_feedback = "m_user_feedback";
    m_user_goals = "m_user_goals";
    m_profile = "m_profile";

    curr_lat: any;
    curr_lng: any;
    curr_loc: any;

    notificationList = 11;


    createTables() {

        this.sqlite.create({
            name: this.dbName,
            location: 'default'
        }).then((db: SQLiteObject) => {

            db.executeSql('CREATE TABLE IF NOT EXISTS ' + this.m_EmployeeDetails
                + ' (id integer primary key AUTOINCREMENT, emp_id integer UNIQUE, password TEXT, emp_role TEXT , first_name TEXT , last_name TEXT , emp_profile_pic TEXT , emp_office_contact TEXT ,emp_personal_contact TEXT , emp_office_email TEXT , emp_personal_email TEXT , emp_contact_address TEXT , emp_personal_address TEXT , emp_active integer , emp_stat integer , emp_created_on TEXT , emp_updated_on TEXT)', {})

            db.executeSql('CREATE TABLE IF NOT EXISTS ' + this.m_Activities
                + ' (id integer primary key AUTOINCREMENT, dash_optionid integer , activity_date_time TEXT,activity_person_name TEXT , activity_type TEXT, activity_scheduled_type TEXT , activity_ref_id integer , activity_location TEXT , activity_description TEXT , activity_status integer ,activity_output_type TEXT , activity_output_remarks TEXT , activity_output_end_datetime TEXT , next_activity_id integer , activity_created_on TEXT , activity_updated_on TEXT , activity_created_by integer , activity_updated_by integer , activity_latitude TEXT , activity_longitude TEXT , current_lat TEXT , current_lng TEXT , current_loc TEXT , contact_id integer , team_leader integer)', {})

            db.executeSql('CREATE TABLE IF NOT EXISTS ' + this.Acitity_Person_Relationship
                + ' (id integer primary key AUTOINCREMENT, activity_id integer, person_type TEXT, person_id integer)', {})

            db.executeSql('CREATE TABLE IF NOT EXISTS ' + this.m_ContactDetails
                + ' (id integer primary key AUTOINCREMENT, ref_id integer, contact_name TEXT, contact_number_1 TEXT , contact_number_2 TEXT , contact_email_1 TEXT , contact_email_2 TEXT , contact_dob TEXT ,contact_created_on TEXT , contact_updated_on TEXT , contact_created_by integer , contact_updated_by integer , def_addr TEXT, def_lat TEXT , def_lng TEXT)', {})

            db.executeSql('CREATE TABLE IF NOT EXISTS ' + this.m_Source_Master
                + ' (id integer primary key AUTOINCREMENT, source_id integer, source_type TEXT, source_sub_type TEXT , source_name integer , source_address_1 TEXT , source_address_2 TEXT , source_address_3 TEXT ,source_location TEXT , source_city TEXT , source_pincode integer , source_active integer , source_latitude float , source_longitude float , source_tel_number_1 TEXT , source_tel_number_2 TEXT, source_tel_number_3 TEXT, source_created_on TEXT, source_updated_on TEXT, source_created_by integer , source_updated_by integer)', {})

            db.executeSql('CREATE TABLE IF NOT EXISTS ' + this.m_Lead_Master
                + ' (id integer primary key AUTOINCREMENT, lead_no integer, lead_company TEXT , name TEXT , branch TEXT , source_type TEXT , sub_source TEXT , last_action_date TEXT , lead_status_code TEXT, lead_status TEXT)', {})

            db.executeSql('CREATE TABLE IF NOT EXISTS ' + this.m_Goals_Master
                + ' (id integer primary key AUTOINCREMENT, goal_id integer, user_id integer , so_id integer , goal_title TEXT , goal_description TEXT , tasks TEXT , escalated_to_manager TEXT , goal_deadline TEXT , achieved_status TEXT , remarks TEXT , created_on TEXT , updated_on TEXT)', {})

            db.executeSql('CREATE TABLE IF NOT EXISTS ' + this.m_Para_Master
                + ' (id integer primary key AUTOINCREMENT, para_id integer, para_type TEXT, para_val TEXT , para_description TEXT , para_ref_1 TEXT , para_ref_2 TEXT , para_ref_3 TEXT ,para_display_order integer , para_active_flag integer , para_created_on TEXT , para_updated_on TEXT , para_created_by integer , para_updated_by integer)', {})

            db.executeSql('CREATE TABLE IF NOT EXISTS ' + this.m_Images
                + ' (id integer primary key AUTOINCREMENT, img_id integer, person_id integer, img_url TEXT , img_created_on TEXT, img_updated_on TEXT)', {})

            db.executeSql('CREATE TABLE IF NOT EXISTS ' + this.m_Lead_Screen
                + ' (id integer primary key AUTOINCREMENT, lead_id integer, source_id integer, lead_customer_name TEXT , lead_contact_no TEXT , lead_email TEXT , lead_income_source TEXT , lead_property_identity TEXT ,lead_project_location TEXT , lead_project_name TEXT , lead_lms_to_call TEXT , lead_expected_login_date TEXT , lead_expected_login_amount TEXT , lead_created_on TEXT , lead_updated_on TEXT)', {})

            db.executeSql('CREATE TABLE IF NOT EXISTS ' + this.m_HolidayList
                + ' (id integer primary key AUTOINCREMENT, holiday_date TEXT, holiday_occassion TEXT, holiday_created_on TEXT , holiday_updated_on TEXT)', {})

            db.executeSql('CREATE TABLE IF NOT EXISTS ' + this.m_Attendance
                + ' (id integer primary key AUTOINCREMENT, emp_id integer, is_present integer, attendance_date TEXT , attendance_intime TEXT , attendance_outtime TEXT , attendance_created_on TEXT , attendance_updated_on TEXT)', {})

            db.executeSql('CREATE TABLE IF NOT EXISTS ' + this.m_WhatsNew
                + ' (id integer primary key AUTOINCREMENT, whatsnew_date TEXT, whatsnew_emp_id integer, whatsnew_content TEXT , whatsnew_created_on TEXT , whatsnew_updated_on TEXT)', {})

            db.executeSql('CREATE TABLE IF NOT EXISTS ' + this.m_Notifications
                + ' (id integer primary key AUTOINCREMENT, notification_id integer, notification_from integer, notification_to integer , notification_redirect_url TEXT , notification_title TEXT, notification_descripiton TEXT , notification_is_unread integer , notification_created_on TEXT , notification_updated_on TEXT , notification_isread TEXT , notification_activitytype TEXT , notification_scheduled_type TEXT)', {})

            db.executeSql('CREATE TABLE IF NOT EXISTS ' + this.m_user_session
                + ' (id integer primary key AUTOINCREMENT, session_id integer, activity TEXT, user_id integer , device_name TEXT , device_os TEXT, device_full_serial_no TEXT, status integer , created_on TEXT)', {})

            db.executeSql('CREATE TABLE IF NOT EXISTS ' + this.m_user_feedback
                + ' (id integer primary key AUTOINCREMENT, emp_id integer, feedback_type TEXT, feedback_description TEXT , feedback_created_on TEXT)', {})

            db.executeSql('CREATE TABLE IF NOT EXISTS ' + this.m_user_goals
                + ' (id integer primary key AUTOINCREMENT, emp_id integer, title TEXT, description TEXT , created_on TEXT , updated_on TEXT)', {})

            db.executeSql('CREATE TABLE IF NOT EXISTS ' + this.m_profile
                + ' (id integer primary key AUTOINCREMENT, emp_id integer, username TEXT, profile_picture TEXT , office_number TEXT , personal_number TEXT , email TEXT , personal_email TEXT , office_address TEXT)', {})

                .then(res => console.log('Executed'))
                .catch(e => console.log(e));
        })


    }

   

    codeLatLng() {

        var json: any;

        this.geolocation.getCurrentPosition().then((position) => {

            let location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            var geocoder = new google.maps.Geocoder;

            if (geocoder) {
                geocoder.geocode({ 'latLng': location }, function (results, status) {

                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            this.curr_loc = results[1];
                            this.hello(this.curr_loc);
                        } else {
                            alert("No results found");
                        }
                    } else {
                        alert("Geocoder failed due to: " + status);
                    }
                });
            }

            this.curr_lat = position.coords.latitude;
            this.curr_lng = position.coords.longitude;

        })

    }

    updateTables(type: string, tablename: string, dataArray: any, prevID?: string, updateItems?: any) {

        this.sqlite.create({
            name: this.dbName,
            location: 'default'
        }).then((db: SQLiteObject) => {

            var geocoder = new google.maps.Geocoder;

            switch (tablename) {

                case this.m_EmployeeDetails:
                    //  var dataArray = {"emp_id": 1 ,"password":this.dateTime , "emp_role":this.whichtype, "first_name":this.meetingPerson ,"last_name":'AB',"emp_profile_pic":'1',"emp_office_contact":this.locationDescription,"emp_personal_contact":this.dateTime,"emp_office_email":'1',"emp_personal_email":'',"emp_contact_address":'' ,"emp_personal_address":this.dateTime ,"emp_active":'2' ,"emp_stat":this.dateTime ,"emp_created_on":this.dateTime ,"emp_updated_on":'1'}
                    db.executeSql('INSERT OR REPLACE INTO ' + this.m_EmployeeDetails + ' (emp_id, password ,emp_role, first_name ,last_name, emp_profile_pic ,emp_office_contact, emp_personal_contact ,emp_office_email, emp_personal_email ,emp_contact_address, emp_personal_address ,emp_active, emp_stat , emp_created_on , emp_updated_on) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [dataArray['emp_id'], dataArray['password'], dataArray['emp_role'], dataArray['first_name'], dataArray['last_name'], dataArray['emp_profile_pic'], dataArray['emp_office_contact'], dataArray['emp_personal_contact'], dataArray['emp_office_email'], dataArray['emp_personal_email'], dataArray['emp_contact_address'], dataArray['emp_personal_address'], dataArray['emp_active'], dataArray['emp_stat'], dataArray['emp_created_on'], dataArray['emp_updated_on']])
                        .then(res => {
                            console.log("m_EmployeeDetails inserted");
                        })
                    break;

                case this.m_Activities:

                    db.executeSql('INSERT INTO ' + this.m_Activities + ' (dash_optionid , activity_date_time,activity_person_name, activity_type ,activity_scheduled_type, activity_ref_id ,activity_location, activity_description ,activity_status, activity_output_type ,activity_output_remarks, activity_output_end_datetime ,next_activity_id, activity_created_on ,activity_updated_on, activity_created_by , activity_updated_by , activity_latitude , activity_longitude,current_lat , current_lng , current_loc ,contact_id ,team_leader) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [dataArray['dash_optionid'], dataArray['activity_date_time'], dataArray['activity_person_name'], dataArray['activity_type'], dataArray['activity_scheduled_type'], dataArray['activity_ref_id'], dataArray['activity_location'], dataArray['activity_description'], dataArray['activity_status'], dataArray['activity_output_type'], dataArray['activity_output_remarks'], dataArray['activity_output_end_datetime'], dataArray['next_activity_id'], dataArray['activity_created_on'], dataArray['activity_updated_on'], dataArray['activity_created_by'], dataArray['activity_updated_by'], dataArray['activity_latitude'], dataArray['activity_longitude'], dataArray['current_lat'], dataArray['current_lng'], dataArray['current_loc'], dataArray['contact_id'] ,dataArray['team_leader']])
                        .then(res => {
                            if (updateItems) {

                                db.executeSql('UPDATE m_Activities SET next_activity_id=? WHERE id=?', [res['insertId'], prevID])
                                    .then(res => {
                                        console.log("m_Activitiesupdate inserted");
                                    })
                            }

                            console.log("m_Activities inserted");
                        })

                    break;
                case this.Acitity_Person_Relationship:
                    //  var dataArray = {"activity_id": 1 ,"person_type":this.dateTime , "person_id":this.whichtype}
                    db.executeSql('INSERT OR REPLACE INTO ' + this.Acitity_Person_Relationship + ' (activity_id ,person_type, person_id ) VALUES (?,?,?)', [dataArray['activity_id'], dataArray['person_type'], dataArray['person_id']])
                        .then(res => {
                            console.log("Acitity_Person_Relationship inserted");
                        })
                    break;
                case this.m_ContactDetails:
                    //  var dataArray = {"ref_id": 1 ,"contact_name":this.dateTime , "contact_number_1":this.whichtype, "contact_number_2":this.meetingPerson ,"contact_email_1":'AB',"contact_email_2":'1',"contact_dob":this.locationDescription,"contact_created_on":this.dateTime,"contact_updated_on":'1',"contact_created_by":'',"contact_updated_by":'' }
                    db.executeSql('INSERT OR REPLACE INTO ' + this.m_ContactDetails + ' (ref_id, contact_name ,contact_number_1, contact_number_2 ,contact_email_1, contact_email_2 ,contact_dob, contact_created_on ,contact_updated_on, contact_created_by ,contact_updated_by , def_addr , def_lat  , def_lng ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [dataArray['ref_id'], dataArray['contact_name'], dataArray['contact_number_1'], dataArray['contact_number_2'], dataArray['contact_email_1'], dataArray['contact_email_2'], dataArray['contact_dob'], dataArray['contact_created_on'], dataArray['contact_updated_on'], dataArray['contact_created_by'], dataArray['contact_updated_by'] , dataArray['def_addr'] , dataArray['def_lat'] , dataArray['def_lng']])
                        .then(res => {
                            console.log("m_ContactDetails inserted");
                        })
                    break;
                case this.m_Source_Master:
                    //  var dataArray = {"source_id": 1 ,"source_type":this.dateTime , "source_sub_type":this.whichtype, "source_name":this.meetingPerson ,"source_address_1":'AB',"source_address_2":'1',"source_address_3":this.locationDescription,"source_location":this.dateTime,"source_city":'1',"source_pincode":'',"source_active":'',"source_latitude":this.dateTime,"source_longitude":'1',"source_tel_number_1":'',"source_tel_number_2":'',"source_tel_number_3":'',"source_created_on":'',"source_updated_on":'',"source_created_by":'' ,source_updated_by:''}
                    db.executeSql('INSERT OR REPLACE INTO ' + this.m_Source_Master + ' (source_id, source_type ,source_sub_type, source_name ,source_address_1, source_address_2 ,source_address_3, source_location ,source_city, source_pincode ,source_active, source_latitude ,source_longitude, source_tel_number_1 , source_tel_number_2 , source_tel_number_3 ,source_created_on , source_updated_on, source_created_by , source_updated_by) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [dataArray['source_id'], dataArray['source_type'], dataArray['source_sub_type'], dataArray['source_name'], dataArray['source_address_1'], dataArray['source_address_2'], dataArray['source_address_3'], dataArray['source_location'], dataArray['source_city'], dataArray['source_pincode'], dataArray['source_active'], dataArray['source_latitude'], dataArray['source_longitude'], dataArray['source_tel_number_1'], dataArray['source_tel_number_2'], dataArray['source_tel_number_3'], dataArray['source_created_on'], dataArray['source_updated_on'], dataArray['source_created_by'], dataArray['source_updated_by']])
                        .then(res => {
                            console.log("m_Source_Master inserted");
                        })
                    break;
                case this.m_Lead_Master:
 
    //   var dataArray = {"lead_no": 1 ,"lead_company":this.dateTime , "name":this.whichtype, "branch":'' ,"source_type":'AB',"sub_source":'1',"last_action_date":this.locationDescription}

                db.executeSql('INSERT OR REPLACE INTO ' + this.m_Lead_Master + ' (lead_no, lead_company, name , branch , source_type ,sub_source,last_action_date , lead_status_code , lead_status) VALUES (?,?,?,?,?,?,?,?,?)', [dataArray['lead_no'], dataArray['lead_company'],dataArray['name'], dataArray['branch'],dataArray['source_type'], dataArray['sub_source'],dataArray['last_action_date'] , dataArray['lead_status_code'] , dataArray['lead_status'] ])
                        .then(res => {
                            console.log("m_Lead_Master inserted");
                        })
                    break;
                case this.m_Goals_Master:
                    //  var dataArray = {"goal_id": 1 ,"user_id":this.dateTime , "source_name":this.whichtype, "goal_title":this.meetingPerson ,"goal_description":'AB',"tasks":'1',"escalated_to_manager":this.locationDescription,"goal_deadline":this.dateTime,"achieved_status":'1',"remarks":'',"source_active":'',"created_on":this.dateTime,"updated_on":'1'}
                    db.executeSql('INSERT OR REPLACE INTO ' + this.m_Goals_Master + ' (goal_id, user_id , so_id, goal_title ,goal_description, tasks ,escalated_to_manager, goal_deadline ,achieved_status, remarks ,created_on, updated_on) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', [dataArray['goal_id'], dataArray['user_id'] ,dataArray['so_id'], dataArray['goal_title'] ,dataArray['goal_description'], dataArray['tasks'],dataArray['escalated_to_manager'], dataArray['goal_deadline'],dataArray['achieved_status'], dataArray['remarks'],dataArray['created_on'], dataArray['updated_on']])
                        .then(res => {
                            console.log("m_Goals_Master inserted");
                        })
                    break;
                case this.m_Para_Master:
                    //  var dataArray = {"para_id": 1 ,"para_type":this.dateTime , "para_val":this.whichtype, "para_description":this.meetingPerson ,"para_ref_1":'AB',"para_ref_2":'1',"para_ref_3":this.locationDescription,"para_display_order":this.dateTime,"para_active_flag":'1',"para_created_on":'',"para_updated_on":'',"para_created_by":this.dateTime,"para_updated_by":'1'}
                    db.executeSql('INSERT OR REPLACE INTO ' + this.m_Para_Master + ' (para_id, para_type ,para_val, para_description ,para_ref_1, para_ref_2 ,para_ref_3, para_display_order ,para_active_flag, para_created_on ,para_updated_on, para_created_by ,para_updated_by) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', [dataArray['para_id'], dataArray['para_type'], dataArray['para_val'], dataArray['para_description'], dataArray['para_ref_1'], dataArray['para_ref_2'], dataArray['para_ref_3'], dataArray['para_display_order'], dataArray['para_active_flag'], dataArray['para_created_on'], dataArray['para_updated_on'], dataArray['para_created_by'], dataArray['para_updated_by']])
                        .then(res => {
                            console.log("m_Para_Master inserted");
                        })
                    break;
                case this.m_Images:
                    //  var dataArray = {"img_id": 1 ,"person_id":this.dateTime , "img_url":this.whichtype, "img_created_on":this.meetingPerson ,"img_updated_on":'AB'}
                    db.executeSql('INSERT OR REPLACE INTO ' + this.m_Images + ' (img_id, person_id ,img_url, img_created_on ,img_updated_on) VALUES (?,?,?,?,?)', [dataArray['img_id'], dataArray['person_id'], dataArray['img_url'], dataArray['img_created_on'], dataArray['img_updated_on']])
                        .then(res => {
                            console.log("m_Images inserted");
                        })
                    break;
                case this.m_Lead_Screen:
                    //  var dataArray = {"lead_id": 1 ,"source_id":this.dateTime , "lead_customer_name":this.whichtype, "lead_contact_no":this.meetingPerson ,"lead_email":'AB',"lead_income_source":'AB',"lead_property_identity":'AB',"lead_project_location":'AB',"lead_project_name":'',"lead_lms_to_call":'',"lead_expected_login_date":'',"lead_expected_login_amount":'',"lead_created_on":'',"lead_updated_on":''}
                    db.executeSql('INSERT OR REPLACE INTO ' + this.m_Lead_Screen + ' (lead_id, source_id ,lead_customer_name, lead_contact_no ,lead_email, lead_income_source ,lead_property_identity, lead_project_location ,lead_project_name, lead_lms_to_call ,lead_expected_login_date, lead_expected_login_amount ,lead_created_on, lead_updated_on) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [dataArray['lead_id'], dataArray['source_id'], dataArray['lead_customer_name'], dataArray['lead_contact_no'], dataArray['lead_email'], dataArray['lead_income_source'], dataArray['lead_property_identity'], dataArray['lead_project_location'], dataArray['lead_project_name'], dataArray['lead_lms_to_call'], dataArray['lead_expected_login_date'], dataArray['lead_expected_login_amount'], dataArray['lead_created_on'], dataArray['lead_updated_on']])
                        .then(res => {
                            console.log("m_Lead_Screen inserted");
                        })
                    break;
                case this.m_HolidayList:
                    //  var dataArray = {"holiday_date": 1 ,"holiday_occassion":this.dateTime , "holiday_created_on":this.whichtype, "holiday_updated_on":this.meetingPerson}
                    db.executeSql('INSERT OR REPLACE INTO ' + this.m_HolidayList + ' (holiday_date, holiday_occassion ,holiday_created_on, holiday_updated_on) VALUES (?,?,?,?)', [dataArray['holiday_date'], dataArray['holiday_occassion'], dataArray['holiday_created_on'], dataArray['holiday_updated_on']])
                        .then(res => {
                            console.log("m_HolidayList inserted");
                        })
                    break;
                case this.m_Attendance:
                    //  var dataArray = {"emp_id": 1 ,"is_present":this.dateTime , "attendance_date":this.whichtype, "attendance_intime":this.meetingPerson ,"attendance_outtime":'AB',"attendance_created_on":'AB',"attendance_updated_on":'AB'}
                    db.executeSql('INSERT OR REPLACE INTO ' + this.m_Attendance + ' (emp_id, is_present ,attendance_date, attendance_intime ,attendance_outtime, attendance_created_on ,attendance_updated_on) VALUES (?,?,?,?,?,?,?)', [dataArray['emp_id'], dataArray['is_present'], dataArray['attendance_date'], dataArray['attendance_intime'], dataArray['attendance_outtime'], dataArray['attendance_created_on'], dataArray['attendance_updated_on']])
                        .then(res => {
                            console.log("m_Attendance inserted");
                        })
                    break;
                case this.m_WhatsNew:
                    //  var dataArray = {"whatsnew_date": 1 ,"whatsnew_emp_id":this.dateTime , "whatsnew_content":this.whichtype, "whatsnew_created_on":this.meetingPerson ,"whatsnew_updated_on":'AB'}
                    db.executeSql('INSERT OR REPLACE INTO ' + this.m_WhatsNew + ' (whatsnew_date, whatsnew_emp_id ,whatsnew_content, whatsnew_created_on ,whatsnew_updated_on) VALUES (?,?,?,?,?)', [dataArray['whatsnew_date'], dataArray['whatsnew_emp_id'], dataArray['whatsnew_content'], dataArray['whatsnew_created_on'], dataArray['whatsnew_updated_on']])
                        .then(res => {
                            console.log("m_WhatsNew inserted");
                        })
                    break;
                case this.m_Notifications:
                    //  var dataArray = {"notification_id": 1 ,"notification_from":this.dateTime , "notification_to":this.whichtype, "notification_redirect_url":this.meetingPerson ,"notification_title":'AB',"notification_descripiton":'AB',"notification_is_unread":'AB',"notification_created_on":'AB',"notification_updated_on":''}
                    db.executeSql('INSERT OR REPLACE INTO ' + this.m_Notifications + ' (notification_id, notification_from ,notification_to, notification_redirect_url ,notification_title, notification_descripiton ,notification_is_unread, notification_created_on ,notification_updated_on ,notification_isread , notification_activitytype ,notification_scheduled_type) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', [dataArray['notification_id'], dataArray['notification_from'], dataArray['notification_to'], dataArray['notification_redirect_url'], dataArray['notification_title'], dataArray['notification_descripiton'], dataArray['notification_is_unread'], dataArray['notification_created_on'], dataArray['notification_updated_on'] , dataArray['notification_isread'] , dataArray['notification_activitytype'] , dataArray['notification_scheduled_type'] ])
                        .then(res => {
                            console.log("m_Notifications inserted");
                        })
                    break;
                case this.m_user_session:
                    //  var dataArray = {"session_id": 1 ,"activity":this.dateTime , "user_id":this.whichtype, "device_name":this.meetingPerson ,"device_os":'AB',"device_full_serial_no":'AB',"status":'AB',"created_on":'AB'}
                    db.executeSql('INSERT OR REPLACE INTO ' + this.m_user_session + ' (session_id, activity ,user_id, device_name ,device_os, device_full_serial_no ,status, created_on ) VALUES (?,?,?,?,?,?,?,?)', [dataArray['session_id'], dataArray['activity'], dataArray['user_id'], dataArray['device_name'], dataArray['device_os'], dataArray['device_full_serial_no'], dataArray['status'], dataArray['created_on']])
                        .then(res => {
                            console.log("m_user_session inserted");
                        })
                    break;
                case this.m_user_feedback:
                    //  var dataArray = {"emp_id": 1 ,"feedback_type":this.dateTime , "feedback_description":this.whichtype, "feedback_created_on":this.meetingPerson }
                    db.executeSql('INSERT OR REPLACE INTO ' + this.m_user_feedback + ' (emp_id, feedback_type ,feedback_description, feedback_created_on) VALUES (?,?,?,?)', [dataArray['emp_id'], dataArray['feedback_type'], dataArray['feedback_description'], dataArray['feedback_created_on']])
                        .then(res => {
                            console.log("m_user_feedback inserted");
                        })
                    break;
                case this.m_user_goals:
                    //  var dataArray = {"emp_id": 1 ,"title":this.dateTime , "description":this.whichtype, "created_on":this.meetingPerson ,"updated_on":'AB'}
                    db.executeSql('INSERT OR REPLACE INTO ' + this.m_user_goals + ' (emp_id, title ,description, created_on ,updated_on) VALUES (?,?,?,?,?)', [dataArray['emp_id'], dataArray['title'], dataArray['description'], dataArray['created_on'], dataArray['updated_on']])
                        .then(res => {
                            console.log("m_user_goals inserted");
                        })
                    break;
                case this.m_profile:
                    //  var dataArray = {"emp_id": 1 ,"title":this.dateTime , "description":this.whichtype, "created_on":this.meetingPerson ,"updated_on":'AB'}
                    db.executeSql('INSERT OR REPLACE INTO ' + this.m_profile + ' (emp_id, username ,profile_picture, office_number ,personal_number,email, personal_email ,office_address) VALUES (?,?,?,?,?,?,?,?)', [dataArray['emp_id'], dataArray['username'], dataArray['profile_picture'], dataArray['office_number'], dataArray['personal_number'], dataArray['email'], dataArray['personal_email'], dataArray['office_address']])
                        .then(res => {
                            console.log("m_profile inserted");
                        })
                    break;

            }

        })

    }

    selectTables(sql) {

        var array = [];
        this.sqlite.create({
            name: this.dbName,
            location: 'default'
        }).then((db: SQLiteObject) => {
            db.executeSql(sql, []).then((data) => {
                if (data != null && data.rows != null) {
                    for (var i = 0; i < data.rows.length; i++) {
                        array[i] = data.rows.item(i);
                    }
                }
            })
        });

        return array;
    }

    deleteTable(tablename) {

        this.sqlite.create({
            name: this.dbName,
            location: 'default'
        }).then((db: SQLiteObject) => {

            db.executeSql('DELETE FROM ' + tablename, {})
                .then(res => console.log('deleted ' + tablename))
                .catch(e => console.log(e));

        })

    }

    public getDate(tobeFormat: String, dateFormat: string) {
        var datePipe = new DatePipe('en-US');
        // formattedDate = datePipe.transform(tobeFormat, 'dd/MM/yyyy');
        return datePipe.transform(tobeFormat, dateFormat);
    }

    public isNetworkConnected() {

        let type = this.network.type;

        var online: any;

        console.log("Connection type: ", this.network.type);
        // Try and find out the current online status of the device
        if (type == "unknown" || type == "none" || type == undefined) {
            //console.log("The device is not online");
            online = false;
        } else {
            //console.log("The device is online!");
            online = true;
        }

        this.network.onDisconnect().subscribe(() => {
            online = false;
            //console.log('network was disconnected :-(');
        });

        this.network.onConnect().subscribe(() => {
            online = true;
            //console.log('network was connected :-)');
        });

        return online;

    }


    setStorage(name: string, value: string) {
        this.storage.set(name, value);
    }

    loader(loadingCtrl, ispresent: boolean) {

        this.loading = loadingCtrl.create({
            content: 'Please wait...'
        });

        switch (ispresent) {
            case true:
                return true;
            case false:
                return false;
        }

        return ispresent;

    }

    getJSON(http) {

        this.getcallmettingtypeJSON(http).subscribe(data => {

            this.typesarray = data['MeetingType'];
            this.keys = Object.keys(this.typesarray);

        }, error => console.log( JSON.stringify("aa" + error)));

        this.getsubsrcjson(http).subscribe(data => {
            var keyArray1: string[] = [];

            for (let keyname in data) {
                keyArray1.push(keyname);
            }

            this.keyArray = keyArray1;
        }, error => console.log(error));


    }

    getcallmettingtypeJSON(http): Observable<any> {
        return http.get("assets/callmeetingleadtype.json")
            .map((res: any) => res.json());
    }

    getsubsrcjson(http): Observable<any> {
        return http.get("assets/srcsubsrc.json")
            .map((res: any) => res.json());
    }

    typeSelect(whichtp) {

        var whichtype: string;
        var sql;

        switch (whichtp) {
            case 'L':
                whichtype = 'Lead Activity';
                break;
            case 'F':
                whichtype = 'File Activity';
                break;
            case 'D':
                whichtype = 'Disbursement Related';
                break;
            case 'G':
                whichtype = 'Goal Specific';
                break;
            case 'S':
                whichtype = 'Source Follow-Up';
                break;
            case 'Q':
                whichtype = 'Query Resolve';
                break;

        }

        return whichtype;

    }


    locationConfirm() {
        let alert = this.alertCtrl.create({
          title: 'Logout',
          message: 'First enable location to continue with app.',
          buttons: [
            {
              text: 'OPEN',
              handler: () => {
                this.openNativeSetting.open('location');
                console.log('Confirm clicked');
              }
            }
          ]
        });
        alert.present();
      }




}