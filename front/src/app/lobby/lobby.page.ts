import { Component, OnInit, Inject } from '@angular/core';
import { HttpHeaders, HttpClient, HttpBackend } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

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

  constructor(
    @Inject(AuthService)
    public authService: AuthService,
    public http: HttpClient,
    handler: HttpBackend,
    public router: Router,
    private activatedRoute:ActivatedRoute,
    public alertController: AlertController,
    public toastController: ToastController
  ){
    this.http = new HttpClient(handler);
    activatedRoute.params.subscribe(val => {
      this.init();
    });
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.authService.getToken()
      })
    };

    this.roomCode = this.activatedRoute.snapshot.paramMap.get('code');
    this.http.get(`${this.API_URL}/game/code/${this.roomCode}`, this.httpOptions)
      .subscribe(
        result => {
          console.log("result:"+result);
          this.room = result;
      });
  }

  deleteRoom(){
    this.http.delete(`${this.API_URL}/game/delete/${this.room.gameId}`, this.httpOptions)
    .subscribe(
      (result:any) => {
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
