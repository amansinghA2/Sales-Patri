import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SourcelistPage } from './sourcelist';

@NgModule({
  declarations: [
    SourcelistPage,
  ],
  imports: [
    IonicPageModule.forChild(SourcelistPage),
  ],
})
export class SourcelistPageModule {}
