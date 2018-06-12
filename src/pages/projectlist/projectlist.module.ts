import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProjectlistPage } from './projectlist';

@NgModule({
  declarations: [
    ProjectlistPage,
  ],
  imports: [
    IonicPageModule.forChild(ProjectlistPage),
  ],
})
export class ProjectlistPageModule {}
