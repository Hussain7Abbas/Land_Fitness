import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { ToastController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LandfitnessDBService {

  headers = new HttpHeaders({
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT, DELETE',
    'Accept' : 'application/json',
    'content-type' : 'application/json'
  });

  apiUrl = "https://landfitnessapi.herokuapp.com/";

  constructor(private _HttpClient:HttpClient, private toastCtrl:ToastController, private alertCtrl:AlertController) { }

  getDateTime(type: string){
    let date = new Date();
    if (type == "date"){
      return String(date.getDate()).padStart(2, '0') + '/' +
                  String(date.getMonth() + 1).padStart(2, '0') + '/' +
                  date.getFullYear();
    }else if (type == "dateTime"){
      return String(date.getDate()).padStart(2, '0') + '/' +
                  String(date.getMonth() + 1).padStart(2, '0') + '/' +
                  date.getFullYear() + '-' +
                  String(date.getHours()).padStart(2, '0') + ':' +
                  String(date.getMinutes()).padStart(2, '0') + ':' +
                  String(date.getSeconds()).padStart(2, '0');
    }
  }

  // ===================== make random id ========================
  getId(){
    let characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomString = ""
    for (let i = 0; i < 7 + 1; i++) {
        let index = Math.floor(Math.random() * characters.length);
        randomString += characters[index];
    }
    return randomString;
  }

  getData(pageName: string, lastDataId: string){
    return new Promise((resolve, reject) => {
      if (localStorage.getItem('isOnline') == '1') {
        let headers = new HttpHeaders({
          'content-type' : 'application/json'
        });
        this._HttpClient.get(this.apiUrl + 'api/' + pageName + '/all/' + lastDataId, {headers:headers})
        .subscribe(res => {          
          resolve(res);
          if (lastDataId == '2700-10-26') {
            localStorage.setItem(pageName, JSON.stringify(res['data']))
          }
        }, (err) => {
          console.log(err);
          reject(err);
        });
      }else{
        if (localStorage.getItem(pageName) == null) {
          localStorage.setItem(pageName, '');
        }
        this.presentToast('لا يوجد اتصال انترنت، تم تفعيل وضع عدم الاتصال', 'dark')
        resolve({'message': 'offline', 'data': JSON.parse(localStorage.getItem(pageName))});
      }
      
    });
  }

  getOneData(pageName: string, dataId: string){
    return new Promise((resolve, reject) => {
      this._HttpClient.get(this.apiUrl + 'api/' + pageName + '/' + dataId, {headers:this.headers})
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        resolve(err['error']);
      });
    });
  }

  addData(pageName: string, data: object){
    return new Promise((resolve, reject) => {
      this._HttpClient.post(this.apiUrl + 'api/' + pageName, JSON.stringify(data), {headers:this.headers})
      .subscribe(res => {
        console.log(res['data']);
        resolve(res['data']);
      }, (err) => {
        console.log(err['error']);
        reject(err['error']);
      });
    });
  }

  updateData(pageName: string, data: object, dataId: string){
    return new Promise((resolve, reject) => {
      this._HttpClient.put(this.apiUrl + 'api/' + pageName + '/' + dataId, JSON.stringify(data), {headers:this.headers})
      .subscribe(res => {
        console.log(res['data']);
        resolve(res['data']);
      }, (err) => {
        console.log(err['error']);
        reject(err['error']);
      });
    });
  }

  deleteData(pageName: string, dataId: string){
    return new Promise((resolve, reject) => {
      this._HttpClient.delete(this.apiUrl + 'api/' + pageName + '/' + dataId, {headers:this.headers})
      .subscribe(res => {
        console.log(res);
        resolve(res);
      }, (err) => {
        console.log(err);
        reject(err);
      });
    });
  }


  updateMessages(dataId: string){
    console.log(dataId);
    if (localStorage.getItem('localMessages') !== '[]') {
      let newMessages = JSON.parse(localStorage.getItem('localMessages'))
      console.log(newMessages);
      newMessages.forEach(message => {
        message.time = this.getDateTime("dateTime");
      });
      console.log(newMessages);
      
      return new Promise((resolve, reject) => {
        this._HttpClient.put(this.apiUrl + 'api/contacts/messages/' + dataId, JSON.stringify({messages: JSON.stringify(newMessages), status: false}), {headers:this.headers})
        .subscribe(res => {
          console.log(res['data']);
          localStorage.setItem('localMessages', '[]');
          resolve(res['data']);
        }, (err) => {
          console.log(err['error']);
          reject(err['error']);
        });
      });
    }
  }

  // saveTrainingImgs(){
  //   let cources = JSON.parse(localStorage.getItem('user')).cource;
  //   let courcesImgs = [[],[],[],[]]
  //   for (let i = 0; i < cources.length; i++) {
  //     cources[i].forEach(training => {
  //       courcesImgs[i][training.idUs] = this.imgToBase64(this.apiUrl + 'img/training/' + training.idUs);
  //     });
  //   }
  // }

   imgToBase64(img: File){
    new Promise((resolve, reject) => {
      // var xhr = new XMLHttpRequest();
      // xhr.open('get', imgUrl);
      // xhr.responseType = 'blob';
      // xhr.onload = ()=>{
        const reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = () => resolve(reader.result);
        console.log(reader.result);
        reader.onerror = error => reject(error);
      // }
    }).then(base64 => {return base64});
  }
  

  async presentToast(message, color) {  
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 1000,
      color: color
    });
    toast.present();
  }

  async presentAlert(title, message) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  // searchData(pageName: string, searchCol: string, searchText: string){
  //   return new Promise((resolve, reject) => {
  //     this._HttpClient.post(this.apiUrl + 'api/' + pageName + '/search', JSON.stringify(
  //                           {'searchCol': searchCol, 'searchText': searchText}), {headers:this.headers})
  //     .subscribe(res => {
  //       console.log(res);
  //       resolve(res);
  //     }, (err) => {
  //       console.log(err['error']);
  //       reject(err['error']);
  //     });
  //   });
  // }

}
