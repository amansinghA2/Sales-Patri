import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TodoitemPage } from './todoitem';

@NgModule({
  declarations: [
    TodoitemPage,
  ],
  imports: [
    IonicPageModule.forChild(TodoitemPage),
  ],
})
export class TodoitemPageModule {}
