import { Component, OnInit,ViewChild  } from '@angular/core';

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

  constructor() { }

  ngOnInit() {}

  openModal(userName){
    document.getElementById('heroModal').style.display = 'flex';
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
  closeModal(){document.getElementById('heroModal').style.display = 'none';}

}
