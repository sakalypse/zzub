import { Component, OnInit, Inject } from '@angular/core';
import { HttpHeaders, HttpClient, HttpBackend } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { GameService } from '../services/game.service';
import { UserService } from '../services/user.service';
import { Role } from '../services/role.enum';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  roomCode;
  room;
  userId;
  owner;

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
  ) { 
    this.http = new HttpClient(handler);
    activatedRoute.params.subscribe(val => {
      this.init();
    });
  }

  ngOnInit() {
    this.init();
  }

  async init(){
    this.userId = await this.authService.getLoggedUser().userId;
    this.roomCode = this.activatedRoute.snapshot.paramMap.get('code');
    this.room = await this.gameService.getGameByCode(this.roomCode);
    this.owner = (this.room.owner.userId == this.userId) ? true : false;
  }


  async exitRoom(){
    await this.gameService.removeUserToGame(this.room.gameId, this.userId);
    if(this.authService.getLoggedUser().role == Role.guest){
      await this.userService.deleteGuest(this.authService.getLoggedUser().userId);
      this.authService.clearStorage();
    }

    this.socket.emit('quitGame', this.userId, this.roomCode);
    this.router.navigate(["/homepage/"]);
  }

  async deleteRoom(){
    await this.gameService.deleteGame(this.room.gameId); 
    this.socket.emit('killGame', this.roomCode);
    this.router.navigate(["/homepage/"]);
  }
}
