import { ProjectinfoPage } from './../pages/projectinfo/projectinfo';
import { ProjectlistPage } from './../pages/projectlist/projectlist';
import { ContactlistPage } from './../pages/contactlist/contactlist';
import { AddprojectPage } from './../pages/addproject/addproject';
import { LocationTrackerProvider } from './../providers/location-tracker/location-tracker';
import { GoalsinfoPage } from './../pages/goalsinfo/goalsinfo';
import { LeadinfoPage } from './../pages/leadinfo/leadinfo';
import { SourceinfoPage } from './../pages/sourceinfo/sourceinfo';
import { ContactPage } from './../pages/contact/contact';
import { TodoitemPage } from './../pages/todoitem/todoitem';
import { FeedbackPage } from './../pages/feedback/feedback';
import { HeaderComponent } from './../components/header/header';
import { SourcelistPage } from './../pages/sourcelist/sourcelist';
import { LeadlistPage } from './../pages/leadlist/leadlist';
import { GoalsPage } from './../pages/goals/goals';
import { ProfilePage } from './../pages/profile/profile';
import { HttpModule } from '@angular/http';
import { Api } from './../providers/api/api';
import { User } from './../providers/user/user';
import { FloatingButtonComponent } from './../components/floating-button/floating-button';
import { FaqsPage } from './../pages/faqs/faqs';
import { DiaryPage } from './../pages/diary/diary';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, Component, ChangeDetectorRef } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MyApp } from './app.component';
import { SQLite } from '@ionic-native/sqlite';
import { LoginPage } from '../pages/login/login';
import { MeetingPage } from '../pages/meeting/meeting';
import { Globals } from './globals';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { MapPage } from '../pages/map/map';
import { Geolocation } from '@ionic-native/geolocation';
import { SchedulecallPage } from '../pages/schedulecall/schedulecall';
import { MeetinginfoPage } from '../pages/meetinginfo/meetinginfo';
import { MeetingupdatePage } from '../pages/meetingupdate/meetingupdate';
import { FooterbarComponent } from '../components/footerbar/footerbar';
import { IonicStorageModule } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Network } from '@ionic-native/network';
import { HttpClientModule } from '@angular/common/http';
import { Camera } from '@ionic-native/camera';
import { SettingsPage } from '../pages/settings/settings';
import { NotificationsPage } from '../pages/notifications/notifications';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { StatusBar } from '@ionic-native/status-bar';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { AppVersion } from '@ionic-native/app-version';
import { ContactdetailsPage } from '../pages/contactdetails/contactdetails';
import { CallNumber } from '@ionic-native/call-number';
import { EmailComposer } from '@ionic-native/email-composer';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { Firebase } from '@ionic-native/firebase';

@NgModule({
  declarations: [
    ProjectinfoPage,
    ProjectlistPage,
    ContactlistPage,
    ContactdetailsPage,
    AddprojectPage,
    GoalsinfoPage,
    LeadinfoPage,
    SourceinfoPage,
    NotificationsPage,
    ContactPage,
    TodoitemPage,
    FeedbackPage,
    SourcelistPage,
    LeadlistPage,
    SettingsPage,
    GoalsPage,
    ProfilePage,
    FaqsPage,
    MyApp,
    LoginPage,
    MeetingPage,
    DashboardPage,
    MapPage,
    SchedulecallPage,
    MeetinginfoPage,
    MeetingupdatePage,
    FloatingButtonComponent,
    FooterbarComponent,
    HeaderComponent,
    DiaryPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ProjectinfoPage,
    ProjectlistPage,
    ContactlistPage,
    ContactdetailsPage,
    AddprojectPage,
    GoalsinfoPage,
    LeadinfoPage,
    SourceinfoPage,
    NotificationsPage,
    ContactPage,
    TodoitemPage,
    FeedbackPage,
    SourcelistPage,
    LeadlistPage,
    SettingsPage,
    GoalsPage,
    ProfilePage,
    FaqsPage,
    MyApp,
    LoginPage,
    MeetingPage,
    DashboardPage,
    MapPage,
    SchedulecallPage,
    MeetinginfoPage,
    MeetingupdatePage,
    DiaryPage
  ],
  providers: [
    Firebase,
    NativeGeocoder,
    EmailComposer,
    CallNumber,
    AppVersion,
    OpenNativeSettings,
    StatusBar,
    LocationTrackerProvider,
    BackgroundGeolocation,
    Camera,
    Api,
    User,
    Network,
    LocalNotifications,
    Geolocation,
    Globals,
    SQLite,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    LocationTrackerProvider
  ]
})

export class AppModule { }
