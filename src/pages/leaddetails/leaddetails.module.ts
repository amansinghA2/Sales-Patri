import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeaddetailsPage } from './leaddetails';

@NgModule({
  declarations: [
    LeaddetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(LeaddetailsPage),
  ],
})
export class LeaddetailsPageModule {}
