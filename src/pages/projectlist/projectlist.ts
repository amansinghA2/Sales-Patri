import { ProjectinfoPage } from './../projectinfo/projectinfo';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Globals } from '../../app/globals';

/**
 * Generated class for the ProjectlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-projectlist',
  templateUrl: 'projectlist.html',
})
export class ProjectlistPage {

  showListsubtype = false;
  projectList = [];
  selectedProjectListArray = [];

  projectname = '';
  sourcename = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public globals: Globals ,public toastCtrl:ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjectlistPage');
  }

  ngOnInit() {

    var sql = "SELECT * from " + this.globals.m_Add_Project;
    this.selectedProjectListArray = this.globals.selectTables(sql);


    if (this.navParams.get('val')) {
      if(this.navParams.get('val') == 'fromaddproject'){

        let toast = this.toastCtrl.create({
          message: 'Project added successfully',
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      }
    }

    
  }

  projectClicked(item) {
    this.navCtrl.push(ProjectinfoPage, { val: item });
  }

  updateProjectSearchResult(ev: any) {

    

    var sql;

    if (this.sourcename != '') {
      sql = "SELECT * from " + this.globals.m_Add_Project + " where project_name LIKE '%" + ev.target.value + "%' and source_name LIKE '%" + this.sourcename + "%' ;";
    } else {
      sql = "SELECT * from " + this.globals.m_Add_Project + " where project_name LIKE '%" + ev.target.value + "%';";
    }

    this.selectedProjectListArray = this.globals.selectTables(sql);

    console.log(this.selectedProjectListArray)
    // this.showListsubtype = false;
    // setTimeout(() => {
    //   let val = ev.target.value;

    //   // if the value is an empty string don't filter the items
    //   if (val && val.trim() != '') {
    //     this.showListsubtype = true;
    //     this.projectList = this.projectList.filter((item) => {
    //       return (item['project_name'].toLowerCase().indexOf(val.toLowerCase()) > -1);
    //     })
    //   } else {
    //     this.showListsubtype = false;
    //   }

    // }, 100);

  }

  updateSourceSearchResult(ev: any) {

    var sql;

    if (this.projectname != '') {
      sql = "SELECT * from " + this.globals.m_Add_Project + " where project_name LIKE '%" + this.projectname + "%' and source_name LIKE '%" + ev.target.value + "%' ;";
    } else {
      sql = "SELECT * from " + this.globals.m_Add_Project + " where source_name LIKE '%" + ev.target.value + "%';";
    }

    this.selectedProjectListArray = this.globals.selectTables(sql);

  }


}
