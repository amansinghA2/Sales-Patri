import { Observable } from 'rxjs/Observable';
import { NgZone } from '@angular/core';
import { SQLite } from '@ionic-native/sqlite';
import { Globals } from './../../app/globals';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { NotificationsPage } from './../notifications/notifications';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import moment from 'moment';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  MarkerCluster,
  Marker
} from "@ionic-native/google-maps";

declare var google;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  recordsList = [];
  sourceListArray = [];
  notificationList: any;
  address = '';
  autocomplete: any;
  GoogleAutocomplete: any;
  autocompleteItems: any;
  markers = [];
  latLng: any;
  profileArray = [];
  whichone = false;
  marker: any;
  marker1: any;
  allcount = [];
  schedulecount = [];
  sourcescount = [];
  curr_lat: any;
  curr_lng: any;

  currenTime: any;
  pendingscheduled = 0;

  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;

  constructor(public navCtrl: NavController, private sqlite: SQLite, public navParams: NavParams, public geolocation: Geolocation, public globals: Globals, public zone: NgZone, private nativeGeocoder: NativeGeocoder) {

    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];

    var sql = 'SELECT * from ' + this.globals.m_Notifications;
    this.notificationList = this.globals.selectTables(sql);

    var sql = 'SELECT * from ' + this.globals.m_Activities;
    this.recordsList = this.globals.selectTables(sql);

    this.currenTime = moment.utc().local().format('YYYY-MM-DD') + " " + moment.utc().local().format('HH:mm');

    var sql1 = 'SELECT * from ' + this.globals.m_Activities + " where activity_type != 'To-Do' ;";
    var sql2 = 'SELECT * from ' + this.globals.m_Activities + " where activity_output_end_datetime > '" + this.currenTime + "' and activity_type != 'To-Do' ;";
    var sql3 = 'SELECT * from ' + this.globals.m_Activities + " where activity_output_end_datetime <= '" + this.currenTime + "' and activity_type != 'To-Do' ;";

    this.allcount = this.globals.selectTables(sql1);
    this.schedulecount = this.globals.selectTables(sql2);
    this.sourcescount = this.globals.selectTables(sql3);

    setTimeout(() => {
      this.loadMap();
      this.currLocAndMarker();
    }, 200);

    Observable.interval(1000 * 15).subscribe(x => {
      this.currenTime = moment.utc().local().format('YYYY-MM-DD') + " " + moment.utc().local().format('HH:mm');
      this.currLocAndMarker();
    });

  }

  currLocAndMarker() {

    this.geolocation.getCurrentPosition().then((position) => {

      this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      this.curr_lat = position.coords.latitude;
      this.curr_lng = position.coords.longitude;

      this.marker1 = new google.maps.Marker({
        map: this.map,
        icon: 'assets/imgs/place.png',
        // animation: google.maps.Animation.DROP,
        position: this.latLng
      })
    })

  }

  showNotifications() {
    this.navCtrl.push(NotificationsPage);
  }

  updateSearchResults() {
    if (this.address == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.address },
      (predictions, status) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction);
          });
        });
      });
  }

  selectSearchResult(item) {

    this.address = item['description'];
    this.autocompleteItems = [];
    var geocoder = new google.maps.Geocoder;

    geocoder.watchPosition(function (position) {
      console.log("i'm tracking you!");
    },
      function (error) {
        if (error.code == error.PERMISSION_DENIED)
          console.log("you denied me :-(");
      });

    geocoder.geocode({ 'placeId': item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        let position = {
          lat: results[0].geometry.location.lat,
          lng: results[0].geometry.location.lng
        };
        // let marker = new google.maps.Marker({
        // position: results[0].geometry.location,
        // map: this.map,
        // });
        // this.markers.push(marker);
        this.map.setCenter(results[0].geometry.location);
      }
    })


  }

  ionViewDidLoad() {

  }

  toggleCLicked() {


    this.currenTime = moment.utc().local().format('YYYY-MM-DD') + " " + moment.utc().local().format('HH:mm');


    if (this.whichone == true) {

      this.recordsList = [];
      var sql1 = 'SELECT * from ' + this.globals.m_Source_Master;
      this.sourceListArray = this.globals.selectTables(sql1);

      setTimeout(() => {
        this.loadMap();
        this.currLocAndMarker();
      }, 200);

    } else {

      this.sourceListArray = [];
      var sql = 'SELECT * from ' + this.globals.m_Activities;
      this.recordsList = this.globals.selectTables(sql);

      setTimeout(() => {
        this.loadMap();
      }, 200);

    }
  }

  loadMap() {


    // this.latLng = new google.maps.LatLng(18.9403, 72.8353);

    // let mapOptions = {
    //   center: this.latLng,
    //   zoom: 12,
    //   mapTypeId: google.maps.MapTypeId.ROADMAP
    // }

    // this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    // this.map.getMyLocation().then(res => {
    //   console.log('Give it to me' +  res.latLng);

    // });

    // this.addMarker();

    this.geolocation.getCurrentPosition().then((position) => {

      this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: this.latLng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.directionsDisplay.setMap(this.map);
      this.directionsDisplay.setOptions({ suppressMarkers: true });

      if (this.whichone == true) {
        this.addMarker(1);
      } else {
        this.addMarker(0);
      }

    }, (err) => {
      console.log(err);
    });

  }

  addMarker(pgn) {

    if (pgn == 0) {

      for (var i = 0; i < this.recordsList.length; i++) {

        this.marker = new google.maps.Marker({
          map: this.map,
          label: {
            text: "M " + (i + 1),
            fontWeight: "bold",
            color: 'white',
            fontSize: '8px',
            x: '200',
            y: '100',
          },
          // animation: google.maps.Animation.DROP,
          position: { lat: +this.recordsList[i]['activity_latitude'], lng: +this.recordsList[i]['activity_longitude'] }
        });


<<<<<<< HEAD
        if (this.pendingscheduled == 0) {
          if (this.recordsList[i]['activity_output_end_datetime'] > this.currenTime) {
            this.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
          } else if (this.recordsList[i]['activity_output_end_datetime'] <= this.currenTime) {
            this.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png')
          }
        } else if (this.pendingscheduled == 1) {
          this.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
        } else if (this.pendingscheduled == 2) {
          this.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png')
        }


        let content = '<div id="contentname">' + "Meeting Person : " + this.recordsList[i]['activity_person_name'] + '</div><div id="contentlocation">' + "Meeting time : " + this.recordsList[i]['activity_output_end_datetime'] + '</div>'
        this.addInfoWindow(this.marker, content);


      }

      // if(this.recordsList[0]['activity_latitude'] != ''){
      // this.calculateAndDisplayRoute(this.directionsService, this.directionsDisplay, this.recordsList[0]);
      // }

    } else if (pgn == 1) {

      for (var i = 0; i < this.sourceListArray.length; i++) {

        this.marker = new google.maps.Marker({
=======
     
      // let mapOptions = {
      //   center: new google.maps.LatLng(18.9403, 72.8353),
      //   zoom: 12,
      //   mapTypeId: google.maps.MapTypeId.ROADMAP
      // }
  
      // this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      for (var i = 0; i < this.recordsList.length; i++) {

        let marker = new google.maps.Marker({
>>>>>>> 31ca1165e25ea9d073fc438ccb9b79fa9441d40c
          map: this.map,
          // icon:'assets/imgs/flag.png', 
          label: {
            text: "S " + (i + 1),
            color: 'white',
            fontWeight: "bold",
            fontSize: '8px',
            x: '200',
            y: '100'
          },
          // animation: google.maps.Animation.DROP,
          position: { lat: +this.sourceListArray[i]['source_latitude'], lng: +this.sourceListArray[i]['source_longitude'] }
        });

<<<<<<< HEAD
        let content = '<div id="contentname">' + "Source Name : " + this.sourceListArray[i]['source_name'] + '</div>'
        this.addInfoWindow(this.marker, content);
        // this.calculateAndDisplayRoute(this.directionsService, this.directionsDisplay , this.sourceListArray[i]);
=======
      
        let content = '<div id="contentname">' + "Client Name : " + this.recordsList[i]['activity_person_name'] + '</div><div id="contentlocation">' + "Meeting time : " + this.recordsList[i]['activity_output_end_datetime'] + '</div>'
        this.addInfoWindow(marker, content);
>>>>>>> 31ca1165e25ea9d073fc438ccb9b79fa9441d40c
      }

    }

  }

  activitySearchClicked(pgn) {

    this.currenTime = moment.utc().local().format('YYYY-MM-DD') + " " + moment.utc().local().format('HH:mm');


    this.pendingscheduled = pgn;

    var sql;
    if (this.pendingscheduled == 0) {
      sql = 'SELECT * from ' + this.globals.m_Activities + " where activity_output_end_datetime > '" + this.currenTime + "' OR activity_output_end_datetime <= '" + this.currenTime + "' ;";
    } else if (this.pendingscheduled == 1) {
      sql = 'SELECT * from ' + this.globals.m_Activities + " where activity_output_end_datetime > '" + this.currenTime + "' ;";
    } else if (this.pendingscheduled == 2) {
      sql = 'SELECT * from ' + this.globals.m_Activities + " where activity_output_end_datetime <= '" + this.currenTime + "' ;";
    }

    this.recordsList = this.globals.selectTables(sql);

    setTimeout(() => {
      this.loadMap();
      this.currLocAndMarker();
    }, 200);

  }

  addInfoWindow(marker, content) {

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }

  calculateAndDisplayRoute(directionsService, directionsDisplay, location) {

    var x = +location['activity_latitude'];
    var y = +location['activity_longitude'];

    var latLng2 = new google.maps.LatLng(x, y);

    this.nativeGeocoder.reverseGeocode(x, y)
      .then((result: NativeGeocoderReverseResult) => {

        directionsService.route({
          origin: this.latLng,
          destination: latLng2,
          travelMode: google.maps.TravelMode.DRIVING
        }, function (response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            // window.alert('Directions request failed due to ' + status);
          }
        });

      })
      .catch((error: any) => {
        // alert(error);
      });

  }


  addCluster(data) {

    let markerCluster: MarkerCluster = this.map.addMarkerClusterSync({
      markers: {
        "position": {
          "lat": data['activity_latitude'],
          "lng": data['activity_longitude']
        },
        "name": "Starbucks - HI - Aiea  03641",
        "address": "Aiea Shopping Center_99-115\nAiea Heights Drive #125_Aiea, Hawaii 96701",
        "icon": "assets/markercluster/marker.png"
      },
      icons: [
        {
          min: 3,
          max: 9,
          url: "./assets/markercluster/small.png",
          label: {
            color: "white"
          }
        },
        {
          min: 10,
          url: "./assets/markercluster/large.png",
          label: {
            color: "white"
          }
        }
      ]
    });

    markerCluster.on(GoogleMapsEvent.MARKER_CLICK).subscribe((params) => {
      let marker: Marker = params[1];
      marker.setTitle(marker.get("name"));
      marker.setSnippet(marker.get("address"));
      marker.showInfoWindow();
    });

  }



}
