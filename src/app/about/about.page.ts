import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }
  constructor() { }

  ngOnInit() {
  }

}
