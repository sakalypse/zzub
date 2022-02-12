import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { GameService } from '../services/game.service';
import { Role } from '../services/role.enum';
import { AuthService } from './auth.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class LobbyGuardService {
  constructor(
    private router: Router,
    private gameService: GameService,
    private authService: AuthService,
    private userService: UserService
  ) { }

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const roomCode = route.paramMap.get('code');

    if(!this.authService.isConnected()){
      this.router.navigate([""]);
      return false;
    }

    //If game doesn't exist or if already started
    let game = await this.gameService.getGameByCode(roomCode);
    if (game == null ||
      (!game.players.some(x=>x.userId == this.authService.getLoggedUser().userId) && game.isStarted)){
      
      if(this.authService.getLoggedUser().role == Role.guest){
        this.userService.deleteGuest(this.authService.getLoggedUser().userId);
        this.authService.clearStorage();
      }

      this.router.navigate([""]);
      return false;
    }
    //If game already started but already a player in it
    if(game.players.some(x=>x.userId == this.authService.getLoggedUser().userId) && game.isStarted)
    {
      this.router.navigate(["/game/" + roomCode]);
      return false;
    }

    return true;
  }
}
