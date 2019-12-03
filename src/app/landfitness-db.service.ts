import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

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

  apiKey = "http://localhost:8000/";

  constructor(public _HttpClient:HttpClient) { }

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
      let headers = new HttpHeaders({
        'content-type' : 'application/json'
      });
      this._HttpClient.get(this.apiKey + 'api/' + pageName + '/all/' + lastDataId, {headers:headers})
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        console.log(err);
        reject(err);
      });
    });
  }

  getOneData(pageName: string, lastDataId: string){
    return new Promise((resolve, reject) => {
      this._HttpClient.get(this.apiKey + 'api/' + pageName + '/' + lastDataId, {headers:this.headers})
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err.error);
      });
    });
  }

  addData(pageName: string, data: object){
    return new Promise((resolve, reject) => {
      this._HttpClient.post(this.apiKey + 'api/' + pageName + '/', JSON.stringify(data), {headers:this.headers})
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
      this._HttpClient.put(this.apiKey + 'api/' + pageName + '/' + dataId, JSON.stringify(data), {headers:this.headers})
      .subscribe(res => {
        console.log(res['data']);
        resolve(res['data']);
      }, (err) => {
        console.log(err['error']);
        reject(err['error']);
      });
    });
  }

  // searchData(pageName: string, searchCol: string, searchText: string){
  //   return new Promise((resolve, reject) => {
  //     this._HttpClient.post(this.apiKey + 'api/' + pageName + '/search', JSON.stringify(
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
