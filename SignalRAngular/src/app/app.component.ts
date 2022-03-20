import { Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{

  public hubConnection: HubConnection;

  public ngOnInit() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:44306/chatHub').build();

    this.hubConnection.start().then(() => {
      console.log('connection started');
      this.hubConnection.invoke('GetClientId').then((res: any)=> console.log('ConnectionId => ',res));
    }).catch(err => console.log(err));

    this.hubConnection.onclose(() => {
      setTimeout(() => {
        console.log('try to re start connection');
        this.hubConnection.start().then(() => {
          console.log('connection re started');
        }).catch(err => console.log(err));
      }, 5000);
    });
    
    // this.hubConnection.send('GetClientId').then((res: any)=> console.log('ConnectionId => ',res));
    // this.hubConnection.on('publicMessageMethodName', (data) => {
    //   console.log('public Message:' + data);
    // });

    // this.hubConnection.on('clientMethodName', (data) => {
    //   console.log('server message:' + data);
    // });

    // this.hubConnection.on('WelcomeMethodName', (data) => {
    //   console.log('client Id:' + data);
    //   this.hubConnection.invoke('GetDataFromClient', 'abc@abc.com', data).catch(err => console.log(err));
    // });
  }

  public stopConnection() {
    this.hubConnection.stop().then(() => {
      console.log('stopped');
    }).catch(err => console.log(err));
  }

}
