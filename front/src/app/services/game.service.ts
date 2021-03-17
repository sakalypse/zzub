import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Inject, Injectable, Output } from '@angular/core';
import { Observable, throwError,  } from 'rxjs';
import { catchError } from 'rxjs/internal/operators';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
    private API_URL = environment.API_URL_DEV;
    private httpOptions;
    
    //Service properties
    public hasGame:boolean;
    public codeGame:string;

    constructor(@Inject(AuthService)
                public authService: AuthService,
                @Inject(UserService)
                public userService: UserService,
                private http: HttpClient,) {
      this.initHasCurrentGameMenu();
    }
    
    async getGameByCode(code: string): Promise<any> {
      return await this.http.get<any>(`${this.API_URL}/game/code/${code}`).pipe(catchError(this.handleError)).toPromise();
    }

    async addUserToGame(gameId: string, userId: number): Promise<any> {
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer ' + this.authService.getToken()
        })
      };
      let res = await this.http.put(`${this.API_URL}/game/${gameId}/adduser/${userId}`, this.httpOptions).pipe(catchError(this.handleError)).toPromise();
      this.initHasCurrentGameMenu();
      return res;
    }

    async removeUserToGame(gameId: string, userId: number): Promise<any> {
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer ' + this.authService.getToken()
        })
      };
      let res = await this.http.put(`${this.API_URL}/game/${gameId}/removeuser/${userId}`, this.httpOptions).pipe(catchError(this.handleError)).toPromise();
      this.initHasCurrentGameMenu();
      return res;
    }

    async createGame(dto: any): Promise<any> {
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer ' + this.authService.getToken()
        })
      };
      let res = await this.http.post(`${this.API_URL}/game/create`, dto, this.httpOptions).pipe(catchError(this.handleError)).toPromise();
      this.initHasCurrentGameMenu();
      return res;
    }

    async deleteGame(gameId: string): Promise<any> {
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer ' + this.authService.getToken()
        })
      };
      let res = await this.http.delete(`${this.API_URL}/game/delete/${gameId}`, this.httpOptions).pipe(catchError(this.handleError)).toPromise();
      this.initHasCurrentGameMenu();
      return res;
    }

    async initHasCurrentGameMenu(){
      if(this.authService.isConnected()){
        let game = await this.userService.getCurrentGame(this.authService.getLoggedUser().userId);
        if(game != null && game.code != ""){
          this.hasGame = true;
          this.codeGame = game.code;
          return;
        }
      }
      this.hasGame = false;
    }

    private handleError(error: HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`);
      }
      // return an observable with a user-facing error message
      return throwError(error.error.message);
    };
  }