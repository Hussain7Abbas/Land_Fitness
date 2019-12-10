import { Component } from '@angular/core';
import { LandfitnessDBService } from "../landfitness-db.service";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  apiUrl = this.landFitnessDB.apiUrl;

  isUser = false;
  signInIdUs = "";

  trainings = [];
  courceDay = 1;
  cources = [];

  training = {
    idTr: '',
    name: '',
    count: '',
    body: '',
    videoUrl: ''
  }

  user = {
    idUs: "000",
    name: "",
    joinType: "",
    joinDay: this.landFitnessDB.getDateTime("date"),
    details: "",
    cource: "[[],[]]",
    joinDate: this.landFitnessDB.getDateTime("dateTime")
  };

  userDetails = {
    wieght: "",
    tall: "",
    waistDiameter: "",
    legDiameter: "",
    armDiameter: "",
    backWidth: ""
  };

  constructor(private landFitnessDB:LandfitnessDBService, public sanitizer: DomSanitizer) {}

  ngOnInit(){
    this.loadData()
  }
  
  // ============== Back End ==============

  doRefresh(event){
    this.loadData().then(result=>{
      event.target.complete();
    })
  }



  loadData(){
    this.trainings = [];
    return new Promise((resolve)=>{
      if (localStorage.getItem("user") == "deleted"){
        this.landFitnessDB.presentAlert('اشتراك القاعة', 'لقد تم حذف حسابك من القاعة من قبل الادارة.');
        this.isUser = false;
      }else if (localStorage.getItem("user") !== null) {
        this.isUser = true;
        this.user = JSON.parse(localStorage.getItem("user"));
        if (this.userDays(this.user.joinDay) < 0) {
          this.landFitnessDB.presentAlert('اشتراك القاعة', 'لقد انتهى اشتراكك في القاعة يرجى تجديد الاشتراك لتتمكن من استخدام حسابك فيها.');
        }else{
          this.cources =  JSON.parse(this.user.cource);
          this.trainings = this.cources[this.courceDay - 1];
        }
      }else{
        this.isUser = false;
      }
      resolve('Success');
    });
  }
  signIn(){
    if (this.signInIdUs.length == 27) {
      this.landFitnessDB.getOneData('users', this.signInIdUs).then(user=>{
        if (user['message'] == 'User Not Found!'){
          this.landFitnessDB.presentAlert('اشتراك القاعة', 'معرف اللاعب غير موجود يرجى التأكد من كتابته بصورة صحيحة.');
        }else{
          localStorage.setItem('user', JSON.stringify(user['data']));
        }
        this.loadData();
      })
    }else{this.landFitnessDB.presentAlert('اشتراك القاعة', 'خطأ في معرف اللاعب، يجب ان يتكون من 27 حرف ورقم.')}
  }

  isUserModal = true;
  openModal(training, type: string){
    document.getElementById('profileModal').style.display = 'flex';
    if (type == "user") {
      this.userDetails = JSON.parse(this.user.details);
      document.getElementById('modalHeader').innerHTML = "معلومات اللاعب";
      this.isUserModal = true;
    } else {
      this.training = {idTr: training.idTr, name: training.name, count: training.count, body: '', videoUrl: ''}
      document.getElementById('modalHeader').innerHTML = "معلومات التمرين";
      this.isUserModal = false;
      this.landFitnessDB.getOneData('trainings', training.idTr).then(theTraining=>{
        this.training = {
          idTr: training.idTr,
          name: training.name,
          count: training.count,
          body: JSON.parse(theTraining['data'].details).body,
          videoUrl: JSON.parse(theTraining['data'].details).videoUrl
        }
      })
      console.log(this.training);
    }
  }

  closeModal(){document.getElementById('profileModal').style.display = 'none';}

  userDays(joinDay: string){
    let date = new Date();
    let joinDayArray = joinDay.valueOf().toString().split("/");
    let realJoinDay: Number = Number(joinDayArray[2] + joinDayArray[1] + joinDayArray[0]);
    return 30 - (Number(String(date.getFullYear()) + String(date.getMonth() + 1).padStart(2, '0') + String(date.getDate()).padStart(2, '0')) - Number(realJoinDay));
  }

  openDay(day){    
    this.courceDay = day;
    this.loadData();
  }

  getImg(idTr: string){if (navigator.onLine) {return this.apiUrl + "api/img/trainings/" + idTr;
              }else{return "assets/imgs/trainings.png"}}
  getImgU(idUs: string){if (navigator.onLine) {return this.apiUrl + "api/img/users/" + idUs;
              }else{return "assets/imgs/users.png"}}
  
  checkTraining(idTr: string){
    if (document.getElementById('CHECK' + idTr).getAttribute('src') == "../../assets/imgs/checkedImg.png") {
      document.getElementById('CHECK' + idTr).setAttribute('src', "../../assets/imgs/uncheckedImg.png");
      document.getElementById(idTr).style.backgroundColor = "white";
    }else{
      document.getElementById('CHECK' + idTr).setAttribute('src', "../../assets/imgs/checkedImg.png");
      document.getElementById(idTr).style.backgroundColor = "#F2FFF2";
    }
  }

  checkYoutubeUrl(url: string){
    if (url.length > 0) {
      if (url.indexOf('watch?v=') !== -1) {
        let img = new Image();
        img.src = "http://img.youtube.com/vi/" + String(url).split('watch?v=')[1].substr(0, 11) + "/mqdefault.jpg";
        return (img.width !== 120)
      }else{return false}
    }
  }

  getVideoUrl(url: string){
    return this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/" + String(url).split('watch?v=')[1].substr(0, 11))
  }

}
