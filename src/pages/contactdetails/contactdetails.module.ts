import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactdetailsPage } from './contactdetails';

@NgModule({
  declarations: [
    ContactdetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactdetailsPage),
  ],
})
export class ContactdetailsPageModule {}
