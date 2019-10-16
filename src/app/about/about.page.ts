import { Component, OnInit,ViewChild  } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
 
  category="landfitness"

  constructor() { }

  ngOnInit() {
  }
  
  segmentChanged(category: any) {
    console.log('Segment changed', category);
}

}
