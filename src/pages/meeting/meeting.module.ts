import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MeetingPage } from './meeting';
// import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';

@NgModule({
  declarations: [
    MeetingPage,
  ],
  imports: [
    // Ng4GeoautocompleteModule.forRoot(),
    IonicPageModule.forChild(MeetingPage),
  ],
})
export class MeetingPageModule {}
