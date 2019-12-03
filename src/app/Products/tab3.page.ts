import { Component } from '@angular/core';
import { LandfitnessDBService } from "../landfitness-db.service";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  products = [];

  constructor(public landFitnessDB:LandfitnessDBService) {}
  
  ngOnInit(){
    this.loadData("2700-10-26")
  }
  
  // ============== Back End ==============

  doScroll(event){
    this.loadData(this.products[this.products.length -1].idPr).then(()=>{
      event.target.complete();
    });
  }
  doRefresh(event){
    this.products = [];
    this.loadData('2700-10-26').then(result=>{
      event.target.complete();
    })
  }

  loadData(idPr: string){
    return new Promise((resolve)=>{
      document.getElementById('loadingSVG').style.display= "block";
      this.landFitnessDB.getData("products", idPr).then(products=>{
        products["data"].forEach(product => {
          let newProduct = JSON.parse(product["details"]);
          this.products.push({
            "idPr" : product["idPr"],
            "name" : newProduct.name,
            "price" : newProduct.price,
            "body" : newProduct.body,
            "imgURL" : newProduct.imgURL
          })
        });
        console.log(this.products);
      }).then(()=>{resolve('success'), document.getElementById('loadingSVG').style.display= "none";})
    })
  }


  // ============== Front End ==============
  showMore(idPr: string){if(document.getElementById("cardButton" + idPr).innerHTML == "&nbsp;&nbsp;المزيد"){document.getElementById("cardButton"  + idPr).innerHTML = "&nbsp;&nbsp;اقل"; document.getElementById("cardBody" + idPr).style.display = "block";
            }else{document.getElementById("cardButton" + idPr).innerHTML = "&nbsp;&nbsp;المزيد"; document.getElementById("cardBody"  + idPr).style.display = "none";} }

}
