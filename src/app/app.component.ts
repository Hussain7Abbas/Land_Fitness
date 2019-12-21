import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Network } from '@ionic-native/network/ngx';

import { LandfitnessDBService } from "./landfitness-db.service";


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private landFitnessDB:LandfitnessDBService,
    private network: Network
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
      



      this.setDefaultVariables()

      localStorage.setItem('isOnline', '1')
      // watch network for a disconnection
      // this.network.onDisconnect().subscribe(() => {
      //   if (localStorage.getItem('isOnline') == '1') {
      //     this.landFitnessDB.presentToast("لا يوجد اتصال انترنت", 'danger')
      //     localStorage.setItem('isOnline', '0')
      //   }
      // });

      // watch network for a connection
      this.network.onConnect().subscribe(() => {
        // if (localStorage.getItem('isOnline') == '1') {
          // this.landFitnessDB.presentToast("عاد اتصال الانترنت", 'success')
          localStorage.setItem('isOnline', '1')
          this.loadProfile();
    
          if (localStorage.getItem('localMessages') !== '[]') {
            this.landFitnessDB.updateMessages(JSON.parse(localStorage.getItem('contact')).idUs)
          }
        // }
      });
      
      if (localStorage.getItem('isOnline') == '1') {
        this.loadProfile();
      }else{
        // this.landFitnessDB.presentToast("لا يوجد اتصال انترنت", 'danger')
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
