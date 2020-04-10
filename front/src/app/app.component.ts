import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

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
      title: 'Login',
      url: 'login',
      icon: 'log-in'
    },
    {
      title: 'Sign-up',
      url: 'sign',
      icon: 'pencil'
    },
    {
      title: 'How to play',
      url: 'fun',
      icon: 'information'
    },
    {
      title: 'Question packs',
      url: 'fun',
      icon: 'help'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
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
  }

  ngOnInit() {
  }
}
