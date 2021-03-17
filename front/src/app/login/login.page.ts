import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  userForm: FormGroup;
  username: FormControl;
  password: FormControl;

  constructor(
    @Inject(AuthService)
    public authService: AuthService,
    @Inject(GameService)
    public gameService: GameService,
    public toastController: ToastController,
    public router: Router) { }

  ngOnInit() {
    this.username = new FormControl('', Validators.required);
    this.password = new FormControl('', Validators.required);
    this.userForm = new FormGroup({
      username: this.username,
      password: this.password
    });
  }

  login(){
    //stop if userForm invalid
    if (this.userForm.invalid) {
      return;
    }
    
    this.authService.login(this.userForm.value).subscribe(
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
        this.gameService.initHasCurrentGameMenu();
        this.toastController.create({
          message: 'Login successful',
          duration: 2000
        }).then(toast=>toast.present());
        this.router.navigateByUrl("/");
      })
  }
}
