import { Component, OnInit, Inject} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../services/user.service';
import { Role } from '../services/role.enum';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  enumRole = Role;

  listUser;
  listGame;

  constructor(
    @Inject(AuthService)
    public authService: AuthService,
    @Inject(UserService)
    public userService: UserService,
    @Inject(GameService)
    private gameService:GameService,
  ) { }

  ngOnInit() {
    this.loadData();
  }

  async loadData(){
    this.listUser = await this.userService.getAllUsers();
    this.listGame = await this.gameService.getAllGames();
  }

  joinPlayersUsername(players:any){
    return players.map(o => o.username).join(', ')
  }
}
