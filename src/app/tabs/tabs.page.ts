import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AboutPage } from '../about/about.page';
import { ChatPage } from '../chat/chat.page';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(public modalController: ModalController, private splashScreen: SplashScreen) {}

  ngOnInit(){
    this.splashScreen.hide();
  }

  async presentModal(ModalPage) {
    const modal = await this.modalController.create({
      component: ModalPage
    });
    return await modal.present();
  }


  openModal(pageName: string){
    if (pageName == 'about') {
      this.presentModal(AboutPage);
    } else if (pageName == 'chat') {
      this.presentModal(ChatPage);
    }
  }

}
