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

  apiUrl = "http://localhost:8000/";

  constructor(private _HttpClient:HttpClient, private toastCtrl:ToastController, private alertCtrl:AlertController) { }

  getDateTime(type1: string){
    let date = new Date();
    if (type1 == "date"){
      return String(date.getDate()).padStart(2, '0') + '/' +
                  String(date.getMonth() + 1).padStart(2, '0') + '/' +
                  date.getFullYear();
    }else if (type1 == "dateTime"){
      return String(date.getDate()).padStart(2, '0') + '/' +
                  String(date.getMonth() + 1).padStart(2, '0') + '/' +
                  date.getFullYear() + '-' +
                  String(date.getHours() + 1).padStart(2, '0') + ':' +
                  String(date.getMinutes() + 1).padStart(2, '0') + ':' +
                  String(date.getSeconds() + 1).padStart(2, '0');
    }

  }

  getData(pageName: string, lastDataId: string){
    return new Promise((resolve, reject) => {
      if (navigator.onLine) {
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

  getOneData(pageName: string, lastDataId: string){
    return new Promise((resolve, reject) => {
      this._HttpClient.get(this.apiUrl + 'api/' + pageName + '/' + lastDataId, {headers:this.headers})
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        resolve(err['error']);
      });
    });
  }

  addData(pageName: string, data: object){
    return new Promise((resolve, reject) => {
      this._HttpClient.post(this.apiUrl + 'api/' + pageName + '/', JSON.stringify(data), {headers:this.headers})
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


  async presentToast(message, color) {  
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
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
