import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { LandfitnessDBService } from "./landfitness-db.service";


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private landFitnessDB:LandfitnessDBService
  ) {
    this.initializeApp();
  }

  contact = {
    idUs: "",
    name: "XXXXXXX",
    messages: "[]",
    time: this.landFitnessDB.getDateTime("dateTime"),
    status: false
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      
      this.setDefaultVariables()

      window.addEventListener('online', event=>{this.handleConnectionChange(event)});
      window.addEventListener('offline', event=>{this.handleConnectionChange(event)});
      
      if (navigator.onLine) {
        this.loadProfile();
      }else{
        this.landFitnessDB.presentToast("لا يوجد اتصال انترنت", 'danger')
      }


    });
  }

  loadProfile(){
    if (localStorage.getItem('user') !== null) {
      this.landFitnessDB.getOneData('users', JSON.parse(localStorage.getItem('user')).idUs).then(user=>{
        if (user['message'] == 'User Not Found!'){
          localStorage.setItem('user', 'deleted');
        }else{
          if (user['data'] !== undefined) {
            localStorage.setItem('user', JSON.stringify(user['data']));
          }
        }
      });
    }
  }

  handleConnectionChange(event){
    if (event.type == "offline") {
      this.landFitnessDB.presentToast("لا يوجد اتصال انترنت", 'danger')
    }else if (event.type == "online") {
      this.landFitnessDB.presentToast("عاد اتصال الانترنت", 'success')
      this.loadProfile();

      if (localStorage.getItem('localMessages') !== '[]') {
        this.landFitnessDB.updateMessages(JSON.parse(localStorage.getItem('contact')).idUs)
      }
    }
  }

  setDefaultVariables(){
    if (localStorage.getItem('localMessages') == null) {
      localStorage.setItem('localMessages', '[]');
    }
    if (localStorage.getItem('contact') == null) {
      this.contact.idUs = "2030-10-26" + this.landFitnessDB.getId();
      this.contact.name = "ضيف " + this.contact.idUs;
      localStorage.setItem('contact', JSON.stringify(this.contact));
    }else{
      this.landFitnessDB.getOneData('contacts', JSON.parse(localStorage.getItem('contact')).idUs).then(contact=>{
        if (contact['message'] !== "Contact Not Found!") {
          localStorage.setItem('contact', JSON.stringify(contact['data']));
        }
      })
    }
  }
  
}
