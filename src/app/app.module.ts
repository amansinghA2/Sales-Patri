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
import { Http, HttpModule } from '@angular/http';
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
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
import { Geolocation } from '@ionic-native/geolocation';
import { SchedulecallPage } from '../pages/schedulecall/schedulecall';
import { MeetinginfoPage } from '../pages/meetinginfo/meetinginfo';
import { MeetingupdatePage } from '../pages/meetingupdate/meetingupdate';
import { FooterbarComponent } from '../components/footerbar/footerbar';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Network } from '@ionic-native/network';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { SettingsPage } from '../pages/settings/settings';
import { AutoCompleteModule } from 'ionic2-auto-complete';
import { NotificationsPage } from '../pages/notifications/notifications';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { StatusBar } from '@ionic-native/status-bar';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';

@NgModule({
  declarations: [
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
    AutoCompleteModule,
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    Ng4GeoautocompleteModule.forRoot(),
    IonicStorageModule.forRoot(),
    HttpClientModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
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
