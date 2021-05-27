import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { Role } from '../services/role.enum';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let authInfo = {
      authenticated: (this.authService.isConnected())
    };

    if (!authInfo.authenticated || this.authService.getLoggedUser().role == Role.guest) {
      this.authService.clearStorage();
      this.router.navigate(["login"]);
      return false;
    }

    return true;
  }
}
