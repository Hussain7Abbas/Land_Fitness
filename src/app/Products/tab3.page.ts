import { Component } from '@angular/core';
import { LandfitnessDBService } from "../landfitness-db.service";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  apiUrl = this.landFitnessDB.apiUrl;

  products = [];

  constructor(private landFitnessDB:LandfitnessDBService) {}
  
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
        if (products['message'] == 'offline') {this.products = []}
        products["data"].forEach(product => {
          let newProduct = JSON.parse(product["details"]);
          this.products.push({
            "idPr" : product["idPr"],
            "name" : newProduct.name,
            "price" : String(newProduct.price).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            "body" : newProduct.body
          })
        });
        console.log(this.products);
      }).then(()=>{resolve('success'), document.getElementById('loadingSVG').style.display= "none";})
    })
  }


  // ============== Front End ==============
  showMore(idPr: string){if(document.getElementById("cardButton" + idPr).innerHTML == "&nbsp;&nbsp;المزيد"){document.getElementById("cardButton"  + idPr).innerHTML = "&nbsp;&nbsp;اقل"; document.getElementById("cardBody" + idPr).style.display = "block";
            }else{document.getElementById("cardButton" + idPr).innerHTML = "&nbsp;&nbsp;المزيد"; document.getElementById("cardBody"  + idPr).style.display = "none";} }

  getImg(idPr: string){if (navigator.onLine) {return this.apiUrl + "api/img/products/" + idPr;
                      }else{return "assets/imgs/products.png"}}

}
