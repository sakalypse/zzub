import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { GameService } from '../services/game.service';
import { Role } from '../services/role.enum';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GameGuardService {
  constructor(
    private router: Router,
    private authService: AuthService,
    private gameService: GameService
  ) { }

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const roomCode = route.paramMap.get('code');

    //If user is not a player of the game
    let game = await this.gameService.getGameByCode(roomCode);
    if (!game.players.some(x=>x.userId == this.authService.getLoggedUser().userId)) {
      this.router.navigate(["homepage"]);
      return false;
    }

    return true;
  }
}
