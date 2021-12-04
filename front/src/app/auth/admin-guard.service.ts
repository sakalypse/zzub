import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { Role } from '../services/role.enum';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService {
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let authInfo = {
      authenticated: (this.authService.isConnected())
    };

    if (!authInfo.authenticated || this.authService.getLoggedUser().role != Role.admin) {
      this.router.navigate([""]);
      return false;
    }

    return true;
  }
}
