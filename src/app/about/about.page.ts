import { Component, OnInit  } from '@angular/core';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ModalController } from '@ionic/angular';
import { LandfitnessDBService } from "../landfitness-db.service";
@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
 
  category="landfitness"

  developer = {
    engName: 'hussain',
    name: 'حسين عباس عبد الجليل',
    phone: '07804834849',
    details: 'رئيس الفريق، مطور ومبرمج لتطبيقات الهواتف الذكية ومواقع الانترنت وبرامج سطح المكتب، ومصمم جرافك.'
  }

  constructor(private clipboard: Clipboard, private modalController: ModalController, private landFitnessDB: LandfitnessDBService) { }

  ngOnInit() {}

  openModal(userName){
    document.getElementById('devModal').style.display = 'flex';
    if (userName ==  'hussain') {
      this.developer = {
        engName: userName,
        name: 'حسين عباس عبد الجليل',
        phone: '07804834849',
        details: 'رئيس الفريق، مطور ومبرمج لتطبيقات الهواتف الذكية ومواقع الانترنت وبرامج سطح المكتب، ومصمم جرافك.'
      }
    }else{
      this.developer = {
        engName: userName,
        name: 'حلا حازم عبود',
        phone: '',
        details: 'مطورة ومبرمجة لتطبيقات الهواتف الذكية ومواقع الانترنت.'
      }
    }

  }
  closeModal(){document.getElementById('devModal').style.display = 'none';}

  copyToClipboard(value){
    this.clipboard.copy(value);
    this.landFitnessDB.presentToast('تم نسخ ' + value + ' الى الحافظة', 'dark')
  }

  dismiss() {this.modalController.dismiss({'dismissed': true});}

}
