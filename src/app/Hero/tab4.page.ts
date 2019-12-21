import { Component } from '@angular/core';
import { LandfitnessDBService } from "../landfitness-db.service";

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page {

  apiUrl = this.landFitnessDB.apiUrl;

  heroes = [];

  hero = {
    idUs: '000',
    name: '',
    details: ''
  };

  heroDetails = {
    wieght: "",
    tall: "",
    waistDiameter: "",
    legDiameter: "",
    armDiameter: "",
    backWidth: ""
  }

  constructor(public landFitnessDB:LandfitnessDBService) {}

  ngOnInit(){
    this.loadData("2700-10-26")
  }
  
  // ============== Back End ==============

  doScroll(event){
    this.loadData(this.heroes[this.heroes.length -1].idUs).then(()=>{
      event.target.complete();
    });
  }
  doRefresh(event){
    this.heroes = [];
    this.loadData('2700-10-26').then(result=>{
      event.target.complete();
    })
  }

  loadData(idUs: string){
    return new Promise((resolve)=>{
      document.getElementById('loadingSVG').style.display= "block";
      this.landFitnessDB.getData("heroes", idUs).then(heroes=>{
        if (heroes['message'] == 'offline') {this.heroes = []}
        heroes["data"].forEach(hero => {
          this.heroes.push(hero);
        });
        console.log(this.heroes);
      }).then(()=>{resolve('success'), document.getElementById('loadingSVG').style.display= "none";})
    })
  }

  openModal(hero){
    document.getElementById('heroModal').style.display = 'flex';
    this.hero = hero;
    this.heroDetails = JSON.parse(hero.details);
  }
  closeModal(){document.getElementById('heroModal').style.display = 'none';}

  getImg(idUs: string){if (localStorage.getItem('isOnline') == '1') {return this.apiUrl + "api/img/usersR/" + idUs;
              }else{return "assets/imgs/usersR.png"}}

  getWieght(details){return JSON.parse(details)['wieght']}

}
