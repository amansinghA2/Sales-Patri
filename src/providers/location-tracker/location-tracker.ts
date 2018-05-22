import { User } from './../user/user';
import { Globals } from './../../app/globals';
import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';
import { Storage } from '@ionic/storage';
/*
  Generated class for the LocationTrackerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationTrackerProvider {

  public watch: any;
  public lat: number = 0;
  public lng: number = 0;
  recordsList = [];

  constructor(public zone: NgZone, public geolocation: Geolocation, public backgroundGeolocation: BackgroundGeolocation , public globals:Globals , public storage:Storage , public user:User) {

  }

  startTracking() {

    // Background Tracking
    console.log('startTracking');

    let config = {
      desiredAccuracy: 0,
      stationaryRadius: 20,
      distanceFilter: 10,
      debug: true,
      interval: 2000
    };

    this.backgroundGeolocation.configure(config).subscribe((location) => {

      console.log('startagainTracking');
      console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);

        // var sql = 'SELECT * from ' + this.globals.m_Activities;
        // this.recordsList = this.globals.selectTables(sql);
        // setTimeout(() => {
        //   this.storage.get('token').then((val) => {
        //     this.user.postMethod('sync', JSON.stringify(this.recordsList), { 'Authorization': '' }).subscribe((resp) => {
        //       console.log("Respis" + JSON.stringify(resp));
        //     })
        //   })
        // }, 100);
 
      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.globals.curr_lat = location.latitude;
        this.globals.curr_lng = location.longitude;
      });

    }, (err) => {

      console.log(err);

    });

    // Turn ON the background-geolocation system.
    this.backgroundGeolocation.start();

    // Foreground Tracking

    let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };

    this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {

      console.log('startagainandagainTracking');
      console.log(JSON.stringify(position));

      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.globals.curr_lat = position.coords.latitude;
        this.globals.curr_lng = position.coords.longitude;
      });

    });

  }

  stopTracking() {

    console.log('stopTracking');

    this.backgroundGeolocation.finish();
    this.watch.unsubscribe();

  }

}
