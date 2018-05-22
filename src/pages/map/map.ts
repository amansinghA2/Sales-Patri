import { NgZone } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Globals } from './../../app/globals';
import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { NotificationsPage } from './../notifications/notifications';
declare var google;

/**
* Generated class for the MapPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  recordsList = [];
  notificationList: any;
  address = '';
  autocomplete: any;
  GoogleAutocomplete: any;
  autocompleteItems: any;
  markers = [];
  latLng: any;

  constructor(public navCtrl: NavController, private sqlite: SQLite, public navParams: NavParams, public geolocation: Geolocation, public globals: Globals, public zone: NgZone) {

    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];

    var sql = 'SELECT * from ' + this.globals.m_Notifications;
    this.notificationList = this.globals.selectTables(sql);

    setTimeout(() => {
      this.loadMap();
    }, 200);




  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
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

    geocoder.watchPosition(function(position) {
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
    // this.loadMap();
  }

  loadMap() {

    this.geolocation.getCurrentPosition().then((position) => {

      this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: this.latLng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      // var directionsService = new google.maps.DirectionsService;
      // var directionsDisplay = new google.maps.DirectionsRenderer;

      // this.map = new google.maps.Map(document.getElementById('map'), {
      //   zoom: 12,
      //   center: this.latLng
      // });

      // directionsDisplay.setMap(map);

      // this.calculateAndDisplayRoute(directionsService, directionsDisplay);

      this.addMarker();
    }, (err) => {
      console.log(err);
    });

  }



  addMarker() {

    this.recordsList = [];
    var sql = 'SELECT * from ' + this.globals.m_Activities;
    this.recordsList = this.globals.selectTables(sql);

    setTimeout(() => {

      for (var i = 0; i < this.recordsList.length; i++) {
        let marker = new google.maps.Marker({
          map: this.map,
          // icon:'assets/imgs/flag.png', 
          label: {
            text: "M " + (i + 1),
            color: 'white',
            fontSize: '6px',
            x: '200',
            y: '100'
          },
          animation: google.maps.Animation.DROP,
          position: { lat: +this.recordsList[i]['activity_latitude'], lng: +this.recordsList[i]['activity_longitude'] }
        });

        let content = '<div id="contentname">' + "Client Name : " + this.recordsList[i]['activity_person_name'] + '</div><div id="contentlocation">' + "Meeting time : " + this.recordsList[i]['activity_output_end_datetime'] + '</div>'
        this.addInfoWindow(marker, content);
      }
    }, 300);
  }

  addInfoWindow(marker, content) {

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }

  calculateAndDisplayRoute(directionsService, directionsDisplay) {

    var geocoder = new google.maps.Geocoder;
    var latlng2 = new google.maps.LatLng('1.255555', '66.4433333');
    if (geocoder) {

      geocoder.geocode({ 'latLng': this.latLng }, function (results, status) {

        if (status == google.maps.GeocoderStatus.OK) {

          if (results[1]) {
            directionsService.route({
              origin: results[1]['formatted_address'],
              destination: "Koparkhairane Bus Depot, Gyan Vikas Road, Sector 3, Kopar Khairane, Navi Mumbai, Maharashtra, India",
              travelMode: 'DRIVING'
            }, function (response, status) {
              if (status === 'OK') {
                directionsDisplay.setDirections(response);
              } else {
                window.alert('Directions request failed due to ' + status);
              }
            });
          } else {
            alert("No results found");
          }
        } else {
          alert("Geocoder failed due to: " + status);
        }
      });
    }
  }




}
