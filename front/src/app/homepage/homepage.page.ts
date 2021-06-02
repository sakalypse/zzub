import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ToastController } from '@ionic/angular';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.page.html',
  styleUrls: ['./homepage.page.scss'],
})
export class HomepagePage implements OnInit {

  codeForm: FormGroup;
  code: FormControl;
  username:FormControl;

  animationCreatePacks : object;
  animationConnectToPeople : object;
  animationRocketLaunch : object;

  constructor(
    public router: Router,
    @Inject(AuthService)
    public authService: AuthService,
    @Inject(GameService)
    private gameService:GameService,
    public toastController: ToastController) { }

  ngOnInit() {
    this.code = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]);
    this.username = new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]);
    if(!this.authService.isConnected())
    {
      this.codeForm = new FormGroup({
        code: this.code,
        username: this.username
      });
    }
    else
    {
      this.codeForm = new FormGroup({
        code: this.code,
      });
    }

    this.animationCreatePacks = {path: '/assets/animations/CreatePacks.json'};
    this.animationConnectToPeople = {path: '/assets/animations/ConnectToPeople.json'};
    this.animationRocketLaunch = {path: '/assets/animations/RocketLaunch.json'};
  }

  async joinLobby(){
    if (this.codeForm.invalid) {
      return;
    }

    //Create guest
    if(!this.authService.isConnected())
    {
      let game = await this.gameService.getGameByCode(this.codeForm.value['code']);
      this.codeForm.addControl("game", new FormControl(game, Validators.required));
      if (this.codeForm.invalid) {
        return;
      }

      this.authService.registerGuest(this.codeForm.value).subscribe(
        result => {
          this.authService.setToken(result.access_token)
        },
        error => {
          this.toastController.create({
            message: 'Error',
            duration: 2000
          }).then(toast=>toast.present());
        },
        () => {
          this.router.navigateByUrl("/lobby/"+this.codeForm.value['code']);
        })
    }
    else
      this.router.navigateByUrl("/lobby/"+this.codeForm.value['code']);
  }

  redirectToPacks(){
    this.router.navigateByUrl("/pack");
  }

  redirectToHostGame(){
    this.router.navigateByUrl("/selectpack");
  }
}
