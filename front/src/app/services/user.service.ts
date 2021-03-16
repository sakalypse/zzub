import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, throwError,  } from 'rxjs';
import { catchError } from 'rxjs/internal/operators';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private API_URL = environment.API_URL_DEV;
    private httpOptions;
    
    constructor(@Inject(AuthService)
                public authService: AuthService,
                private http: HttpClient,) {
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer ' + this.authService.getToken()
        })
      };
    }
  
    async getSafeInfoUser(id: number): Promise<any> {
      return await this.http.get<any>(`${this.API_URL}/user/safeinfo/${id}`).pipe(catchError(this.handleError)).toPromise();
    }

    async getCurrentGame(id:number): Promise<any> {
      return await this.http.get<any>(`${this.API_URL}/user/${id}/game`, this.httpOptions).pipe(catchError(this.handleError)).toPromise();
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