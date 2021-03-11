import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.page.html',
  styleUrls: ['./homepage.page.scss'],
})
export class HomepagePage implements OnInit {

  codeForm: FormGroup;
  code: FormControl;

  animationCreatePacks : object;
  animationConnectToPeople : object;
  animationRocketLaunch : object;

  constructor(public router: Router) { }

  ngOnInit() {
    this.code = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]);
    this.codeForm = new FormGroup({
      code: this.code
    });

    this.animationCreatePacks = {path: '/assets/animations/CreatePacks.json'};
    this.animationConnectToPeople = {path: '/assets/animations/ConnectToPeople.json'};
    this.animationRocketLaunch = {path: '/assets/animations/RocketLaunch.json'};
  }

  joinLobby(){
    if (this.codeForm.invalid) {
      return;
    }
    this.router.navigateByUrl("/lobby/"+this.codeForm.value['code']);
  }

  redirectToPacks(){
    this.router.navigateByUrl("/editpack");
  }

  redirectToHostGame(){
    this.router.navigateByUrl("/selectpack");
  }
}
