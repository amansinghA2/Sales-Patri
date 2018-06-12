import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactlistPage } from './contactlist';

@NgModule({
  declarations: [
    ContactlistPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactlistPage),
  ],
})
export class ContactlistPageModule {}
