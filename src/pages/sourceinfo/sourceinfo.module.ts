import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SourceinfoPage } from './sourceinfo';

@NgModule({
  declarations: [
    SourceinfoPage,
  ],
  imports: [
    IonicPageModule.forChild(SourceinfoPage),
  ],
})
export class SourceinfoPageModule {}
