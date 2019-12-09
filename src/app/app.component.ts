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
    public landFitnessDB:LandfitnessDBService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.loadProfile();
    });
  }

  loadProfile(){
    if (localStorage.getItem('user') !== null) {
      this.landFitnessDB.getOneData('users', JSON.parse(localStorage.getItem('user')).idUs).then(user=>{
        if (user['message'] == 'User Not Found!'){
          localStorage.setItem('user', 'deleted');
        }else{
          localStorage.setItem('user', JSON.stringify(user['data']));
        }
      });
    }
  }

}
