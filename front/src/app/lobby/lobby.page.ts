import { Component, OnInit, Inject } from '@angular/core';
import { HttpHeaders, HttpClient, HttpBackend } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.page.html',
  styleUrls: ['./lobby.page.scss'],
})
export class LobbyPage implements OnInit {
  API_URL = environment.API_URL_DEV;
  httpOptions;
  roomCode;
  room;
  owner;
  players;

  constructor(
    @Inject(AuthService)
    public authService: AuthService,
    public http: HttpClient,
    handler: HttpBackend,
    public router: Router,
    private activatedRoute:ActivatedRoute,
    public alertController: AlertController,
    public toastController: ToastController,
    public socket:Socket
  ){
    this.http = new HttpClient(handler);
    activatedRoute.params.subscribe(val => {
      this.init();
    });
  }

  ngOnInit() {
  }

  async init() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.authService.getToken()
      })
    };

    this.roomCode = this.activatedRoute.snapshot.paramMap.get('code');
    await this.http.get(`${this.API_URL}/game/code/${this.roomCode}`, this.httpOptions)
      .subscribe(
        (result:any) => {
          this.room = result;
          this.players = result.players;
          if(this.room.owner.userId == this.authService.getLoggedUser().userId)
            this.owner = true;
          else
            this.owner = false;

          //Add user in game if not already in
          if(!this.room.players.some(x=>x.userId == this.authService.getLoggedUser().userId)){
            this.http.put(`${this.API_URL}/game/${this.room.gameId}/adduser/${this.authService.getLoggedUser().userId}`, this.httpOptions)
                              .subscribe(
                                async (result:any) => {
                                  this.players.push(await this.http.get<any>(`${this.API_URL}/user/safeinfo/${this.authService.getLoggedUser().userId}`, this.httpOptions).toPromise());
                                },
                                error=>{
                                  this.router.navigate(["/homepage/"]);
                              });
          }
      },
      error => {
        //Game doesn't exist
        this.router.navigate(["/homepage/"]);
      });


    //initialize socket
    this.socket.emit('joinLobby', this.authService.getLoggedUser().userId, this.roomCode);

    //listen for new player
    this.socket.fromEvent('joinLobby').
    subscribe(async id => {
      await this.http.get<any>(`${this.API_URL}/user/safeinfo/${id}`, this.httpOptions)
      .subscribe((player:any)=>{
        if(!this.players.some(x=>x.userId == player.userId))
        {
          this.players.push(player);
        }
      })
    });

    //listen for player quitting
    this.socket.fromEvent('quitGame').
    subscribe(async id => {
      this.players = this.players.
                        filter(x => x.userId !== id);
    });

    //listen for session killed
    this.socket.fromEvent('killGame').
    subscribe(async id => {
      this.router.navigate(["/homepage/"]);
    });
  }

  exitRoom(){
    this.http.put(`${this.API_URL}/game/${this.room.gameId}/removeuser/${this.authService.getLoggedUser().userId}`, this.httpOptions)
      .subscribe(
        (result:any) => {
          this.socket.emit('quitGame', this.authService.getLoggedUser().userId, this.roomCode);
          this.router.navigate(["/homepage/"]);
        },
        error=>{
          this.router.navigate(["/homepage/"]);
      });
  }

  deleteRoom(){
    this.http.delete(`${this.API_URL}/game/delete/${this.room.gameId}`, this.httpOptions)
    .subscribe(
      (result:any) => {
        this.socket.emit('killGame', this.roomCode);
        this.router.navigate(["/homepage/"]);
      },
      error=>{
        this.toastController.create({
          message: 'Error while trying to delete the room',
          duration: 2000
        }).then(toast=>toast.present());
    });
  }

}
