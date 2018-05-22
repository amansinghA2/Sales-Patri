import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeadinfoPage } from './leadinfo';

@NgModule({
  declarations: [
    LeadinfoPage,
  ],
  imports: [
    IonicPageModule.forChild(LeadinfoPage),
  ],
})
export class LeadinfoPageModule {}
