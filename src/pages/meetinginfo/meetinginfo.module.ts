import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MeetinginfoPage } from './meetinginfo';

@NgModule({
  declarations: [
    MeetinginfoPage,
  ],
  imports: [
    IonicPageModule.forChild(MeetinginfoPage),
  ],
})
export class MeetinginfoPageModule {}
