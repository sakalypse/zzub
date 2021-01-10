import { Component, OnInit, Inject } from '@angular/core';
import { HttpHeaders, HttpClient, HttpBackend } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { GameService } from '../services/game.service';
import { UserService } from '../services/user.service';

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
  userId;

  constructor(
    @Inject(AuthService)
    public authService: AuthService,
    @Inject(GameService)
    private gameService:GameService,
    @Inject(UserService)
    private userService:UserService,
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
    this.init();
  }

  async init() {
    this.userId = this.authService.getLoggedUser().userId;
    this.roomCode = this.activatedRoute.snapshot.paramMap.get('code');
    this.room = await this.gameService.getGameByCode(this.roomCode);
    this.players = this.room.players;
    this.owner = (this.room.owner.userId == this.userId) ? true : false;

    //Add user in game if not already in
    if(!this.room.players.some(x=>x.userId == this.userId)){
      await this.gameService.addUserToGame(this.room.gameId, this.userId);
      this.players.push(await this.userService.getSafeInfoUser(this.userId));
    }

    //initialize socket
    this.socket.emit('joinLobby', this.authService.getLoggedUser().userId, this.roomCode);

    //listen for new player
    this.socket.fromEvent('joinLobby').
    subscribe(async (id:number) => {
      let newUser:any = await this.userService.getSafeInfoUser(id);
      if(!this.players.some(x=>x.userId == newUser.userId))
      {
        this.players.push(newUser);
      }
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

  async exitRoom(){
    await this.gameService.removeUserToGame(this.room.gameId, this.userId);
    this.socket.emit('quitGame', this.userId, this.roomCode);
    this.router.navigate(["/homepage/"]);
  }

  async deleteRoom(){
    await this.gameService.deleteGame(this.room.gameId);
    this.socket.emit('killGame', this.roomCode);
    this.router.navigate(["/homepage/"]);
  }
}
