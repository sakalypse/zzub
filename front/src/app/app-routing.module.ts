import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './auth/auth-guard.service';
import { GameGuardService } from './auth/game-guard.service';
import { AdminGuardService } from './auth/admin-guard.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./homepage/homepage.module').then( m => m.HomepagePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'sign',
    loadChildren: () => import('./sign/sign.module').then( m => m.SignPageModule)
  },
  {
    path: 'pack/edit/:id',
    loadChildren: () => import('./edit-pack/edit-pack.module').then( m => m.EditPackPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'pack',
    loadChildren: () => import('./list-pack/list-pack.module').then( m => m.ListPackPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'selectpack',
    loadChildren: () => import('./list-pack/list-pack.module').then( m => m.ListPackPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'lobby/:code',
    loadChildren: () => import('./lobby/lobby.module').then( m => m.LobbyPageModule)
  },
  {
    path: 'game/:code',
    loadChildren: () => import('./game/game.module').then( m => m.GamePageModule),
    canActivate: [GameGuardService]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then( m => m.AdminPageModule),
    canActivate: [AdminGuardService]
  }

  //TODO Guard pour lobby et game

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
