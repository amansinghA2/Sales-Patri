import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GoalsinfoPage } from './goalsinfo';

@NgModule({
  declarations: [
    GoalsinfoPage,
  ],
  imports: [
    IonicPageModule.forChild(GoalsinfoPage),
  ],
})
export class GoalsinfoPageModule {}
