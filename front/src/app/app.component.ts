import { Component, OnInit, Inject } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { sharedStylesheetJitUrl } from '@angular/compiler';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Home',
      url: 'homepage',
      icon: 'home'
    },
    {
      title: 'How to play',
      url: 'homepage',
      icon: 'information'
    },
    {
      title: 'Question packs',
      url: 'pack',
      icon: 'help'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public route: Router,
    public toastController: ToastController,
    @Inject(AuthService)
    public authService: AuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  toggleMobileMenu() {
    document.querySelector('.main-menu--mobile').classList.toggle("closed");
    document.querySelector('.background').classList.toggle("closed");
  }

  ngOnInit() {
  }

  async logout(){
    this.authService.clearStorage();
    await this.route.navigateByUrl('/');
    this.toastController.create({
      message: 'Logout successful',
      duration: 2000
    }).then(toast=>toast.present());
  }
}
