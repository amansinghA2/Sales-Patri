import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeadlistPage } from './leadlist';

@NgModule({
  declarations: [
    LeadlistPage,
  ],
  imports: [
    IonicPageModule.forChild(LeadlistPage),
  ],
})
export class LeadlistPageModule {}
