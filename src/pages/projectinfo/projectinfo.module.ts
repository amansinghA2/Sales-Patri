import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProjectinfoPage } from './projectinfo';

@NgModule({
  declarations: [
    ProjectinfoPage,
  ],
  imports: [
    IonicPageModule.forChild(ProjectinfoPage),
  ],
})
export class ProjectinfoPageModule {}
