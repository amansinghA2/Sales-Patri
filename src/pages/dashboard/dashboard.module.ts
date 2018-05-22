import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardPage } from './dashboard';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    HttpModule,
    DashboardPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(DashboardPage),
  ],
})
export class DashboardPageModule {}
