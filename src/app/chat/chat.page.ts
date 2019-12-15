import { Component, OnInit, ViewChild } from '@angular/core';
import { LandfitnessDBService } from "../landfitness-db.service";
import { IonContent  } from "@ionic/angular";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  apiUrl = this.landFitnessDB.apiUrl;

  contact = {
    idUs: "",
    name: "XXXXXXX",
    messages: "[]",
    time: this.landFitnessDB.getDateTime("dateTime"),
    status: false
  }

  newMessage = {
    user: "1",
    body: "",
    time: this.landFitnessDB.getDateTime("dateTime"),
  }

  messages = []

  isSending = false;

  textareaOldScrollHeight = 37;

  loadMessagesInterval

  constructor(public landFitnessDB: LandfitnessDBService) { }

  @ViewChild('content', {static: false}) content: IonContent;

  onScroll(event){
    if (event.detail.scrollTop + window.innerHeight + 100 < document.getElementById('chat-container').scrollHeight){
      document.getElementById('scrollDownButton').style.bottom = "11%";
    }else{
      document.getElementById('scrollDownButton').style.bottom = "-5%";
      this.newMessagesNo = 0;
    }
  }

  ngOnInit() {
    clearInterval(this.loadMessagesInterval);
    this.loadMessagesInterval = setInterval(()=>{
      this.loadData(false);
    }, 5000);
  }

  ionViewDidLeave(){clearInterval(this.loadMessagesInterval);}

  ionViewDidEnter(){
    if (localStorage.getItem('localMessages') !== '[]') {
      if (JSON.parse(localStorage.getItem('contact')).messages !== []) {
        this.uploadMessages();
      }
    }
    this.contact = JSON.parse(localStorage.getItem('contact'));
    this.loadMessages(true)
    setTimeout(() => {
      this.loadData(false);
    }, 1000);
  }

  loadData(scroll: boolean){
    this.contact = JSON.parse(localStorage.getItem('contact'));
    this.landFitnessDB.getOneData("contacts", this.contact.idUs).then(contact=>{
      console.log('Load Data');
      if (contact['message'] !== 'Contact Not Found!'){
        if (contact['message'] == "Contact Read Succesfully") {
          this.contact = contact['data'];
          localStorage.setItem('contact', JSON.stringify(this.contact));     
          this.loadMessages(scroll);
        }
      }
    })
  }

  newMessagesNo: number = 0;
  loadMessages(scroll: boolean){
    document.getElementById('sendMessageTextarea').removeAttribute('disabled');
    setTimeout(() => {document.getElementById('loadingSVGMessages').style.display= "none";}, 1000);
    if (scroll) {
      setTimeout(() => {
        this.scrollBottom();
      }, 100);
    }else{
      if (JSON.parse(this.contact.messages).length > this.messages.length) {
        if (document.getElementById('scrollDownButton').style.bottom == "11%"){
          this.newMessagesNo += JSON.parse(this.contact.messages).length - this.messages.length;
          this.landFitnessDB.presentToast("توجد " + this.newMessagesNo + " رسالة جديدة", "success");
        }else{
          this.scrollBottom();
        }
      }

    }
    this.messages = [];
    this.messages = this.messages.concat(JSON.parse(this.contact.messages), JSON.parse(localStorage.getItem('localMessages')))    
    this.isSending = false;
    console.log('Load Messages: Messages Loaded');
  }

  newMessages = [];
  sendMessage(){
    this.isSending = true;
    document.getElementById('sendMessageTextarea').setAttribute('disabled','')
    this.newMessage.time = "في انتظار الشبكة ...";

    this.newMessages = JSON.parse(localStorage.getItem('localMessages'));
    this.newMessages.push(this.newMessage);
    localStorage.setItem('localMessages', JSON.stringify(this.newMessages))

    this.loadMessages(true);
    
    this.checkUser().then(()=>{
      this.uploadMessages();
    })
  }

  uploadMessages(){
    console.log('uploadMessages');
    
    if (navigator.onLine) {
      this.landFitnessDB.updateMessages(this.contact.idUs).then(contact=>{
        this.newMessages = [];
        this.contact = Object(contact);
        localStorage.setItem('contact', JSON.stringify(this.contact));
        this.loadMessages(true);
        document.getElementById('sendMessageTextarea').style.height = "36px";
        this.scrollBottom();
      });
    }
    this.newMessage.body = "";
  }

  checkUser(){
    return new Promise((resolve)=>{
        if (localStorage.getItem('user') == null || localStorage.getItem('user') == 'deleted') {
          if (JSON.parse(localStorage.getItem('contact')).messages == "[]") {
            this.landFitnessDB.addData('contacts', this.contact).then(contact=>{
              console.log('checkUser: User Added');
              resolve('NotExist');
            })
          }
        }
        resolve('Exist');
    })
  }

  textAreaEnter(e:KeyboardEvent){
    let sendMessageTextarea = (<HTMLTextAreaElement>document.getElementById('sendMessageTextarea'));
    if (e.keyCode === 13){
      if (sendMessageTextarea.scrollHeight > this.textareaOldScrollHeight){
        if (sendMessageTextarea.scrollHeight < 102){sendMessageTextarea.style.height = String(sendMessageTextarea.scrollHeight) + "px"; this.textareaOldScrollHeight = sendMessageTextarea.scrollHeight;}
      }
      return true
    }
  }

  scrollBottom(){this.content.scrollToBottom(500);}

}
