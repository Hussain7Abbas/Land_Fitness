import { Component} from '@angular/core';
import { LandfitnessDBService } from "../landfitness-db.service";


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {


  posts = [];

  constructor(public landFitnessDB:LandfitnessDBService) {}
  ngOnInit(){
    this.loadData("2700-10-26")
  }
  
  // ============== Back End ==============

  doScroll(event){
    this.loadData(this.posts[this.posts.length -1].idPo).then(()=>{
      event.target.complete();
    });
  }
  doRefresh(event){
    this.posts = [];
    this.loadData('2700-10-26').then(result=>{
      event.target.complete();
    })
  }

  loadData(idPo: string){
    return new Promise((resolve)=>{
      document.getElementById('loadingSVG').style.display= "block";
      this.landFitnessDB.getData("posts", idPo).then(posts=>{
        posts["data"].forEach(post => {
          let newPost = JSON.parse(post["details"]);
          this.posts.push({
            "idPo" : post["idPo"],
            "title" : newPost.title,
            "body" : newPost.body,
            "imgURL" : newPost.imgURL,
            "date" : newPost.date,
          })
        });
        console.log(this.posts);
      }).then(()=>{resolve('success'), document.getElementById('loadingSVG').style.display= "none";})
    })
  }


  // ============== Front End ==============
  showMore(idPo: string){if(document.getElementById("cardButton" + idPo).innerHTML == "عرض المزيد"){document.getElementById("cardButton"  + idPo).innerHTML = "عرض اقل"; document.getElementById("cardBody" + idPo).style.maxHeight = "max-content";
            }else{document.getElementById("cardButton" + idPo).innerHTML = "عرض المزيد"; document.getElementById("cardBody"  + idPo).style.maxHeight = "70px";} }

}
