import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.page.html',
  styleUrls: ['./sign.page.scss'],
})
export class SignPage implements OnInit {
  //Params Form
  userForm: FormGroup;
  username: FormControl;
  email: FormControl;
  password: FormControl;
  password2: FormControl;

  constructor(
    @Inject(AuthService)
    public authService: AuthService,
    public toastController: ToastController,
    public router: Router) { }

  ngOnInit() {
    this.username = new FormControl('', [Validators.required, Validators.minLength(6)]);
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(6)]);
    this.password2 = new FormControl('', [Validators.required, Validators.minLength(6)]);
    this.userForm = new FormGroup({
      username: this.username,
      email: this.email,
      password: this.password,
      password2: this.password2
    });
  }

  sign(){
    //stop if userForm invalid
    if (this.userForm.invalid) {
      return;
    }
    if (this.password.value != this.password2.value) {
      //this.toastr.warning('Passwords are not matching')
      return;
    }

    this.userForm.removeControl("password2");
    this.authService.signup(this.userForm.value)
    .subscribe(x => {
      let formLogin = {
                        username: this.userForm.value.username,
                        password: this.userForm.value.password
                      }
      this.authService.login(formLogin).subscribe(
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
          this.toastController.create({
            message: 'Sign up successful',
            duration: 2000
          }).then(toast=>toast.present());
          this.router.navigateByUrl("/");
        })
      },
      error =>
      {
        this.toastController.create({
          message: 'Error',
          duration: 2000
        }).then(toast=>toast.present());
      }
    );
  }
}
