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
export class PackService {
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
    
    //PACKS
    async createPack(dto: any): Promise<any> {
      return await this.http.post(`${this.API_URL}/pack`, dto, this.httpOptions).pipe(catchError(this.handleError)).toPromise();
    }

    async getAllPublicPacks(): Promise<any> {
      return await this.http.get<any>(`${this.API_URL}/pack/public`, this.httpOptions).pipe(catchError(this.handleError)).toPromise();
    }

    async getAllPrivatePacks(userId: number): Promise<any> {
      return await this.http.get<any>(`${this.API_URL}/user/${userId}/pack`, this.httpOptions).pipe(catchError(this.handleError)).toPromise();
    }

    async getPack(userId: number, packId: number): Promise<any> {
      return await this.http.get<any>(`${this.API_URL}/user/${userId}/pack/${packId}`, this.httpOptions).pipe(catchError(this.handleError)).toPromise();
    }

    async getAllTags(): Promise<any> {
      return await this.http.get<any>(`${this.API_URL}/tag`, this.httpOptions).pipe(catchError(this.handleError)).toPromise();
    }

    async savePack(packId: number, dto: any): Promise<any> {
      console.log(dto);
      return await this.http.put<any>(`${this.API_URL}/pack/${packId}`,
                    dto, this.httpOptions).pipe(catchError(this.handleError)).toPromise();
    }

    async deletePack(packId: number): Promise<any> {
      return await this.http.delete(`${this.API_URL}/pack/${packId}`,this.httpOptions).pipe(catchError(this.handleError)).toPromise();
    }

    //FAVORITES
    async getFavorites(userId: number): Promise<any> {
      return await this.http.get(`${this.API_URL}/user/${userId}/favorite`, this.httpOptions).pipe(catchError(this.handleError)).toPromise();
    }
    
    async addFavorite(userId: number, packId: number): Promise<any> {
      return await this.http.put(`${this.API_URL}/user/${userId}/favorite/${packId}`, null, this.httpOptions).pipe(catchError(this.handleError)).toPromise();
    }

    async deleteFavorite(userId: number, packId: number): Promise<any> {
      return await this.http.delete(`${this.API_URL}/user/${userId}/favorite/${packId}`,this.httpOptions).pipe(catchError(this.handleError)).toPromise();
    }

    //ROUNDS
    async createRound(dto: any): Promise<any> {
      return await this.http.post<any>(`${this.API_URL}/round`,dto,this.httpOptions).pipe(catchError(this.handleError)).toPromise();
    }

    async saveRound(roundId: number, dto: any): Promise<any> {
      this.http.put<any>(`${this.API_URL}/round/${roundId}`,
                          dto, this.httpOptions).pipe(catchError(this.handleError)).toPromise();
    }

    async deleteRound(roundId: number): Promise<any> {
      return await this.http.delete<any>(`${this.API_URL}/round/${roundId}`,this.httpOptions).pipe(catchError(this.handleError)).toPromise();
    }
    
    async createExtra(dto: any): Promise<any> {
      return await this.http.post<any>(`${this.API_URL}/extra`,dto,this.httpOptions).pipe(catchError(this.handleError)).toPromise();
    }

    async saveExtra(extraId: number, dto: any): Promise<any> {
      return await this.http.put<any>(`${this.API_URL}/extra/${extraId}`,
                    dto, this.httpOptions).pipe(catchError(this.handleError)).toPromise();
    }

    async createChoice(dto: any): Promise<any> {
      return await this.http.post<any>(`${this.API_URL}/choice`,dto,this.httpOptions).pipe(catchError(this.handleError)).toPromise();
    }

    async saveChoice(choiceId: number, dto: any): Promise<any> {
      return await this.http.put<any>(`${this.API_URL}/choice/${choiceId}`,
                    dto, this.httpOptions).pipe(catchError(this.handleError)).toPromise();
    }

    async deleteChoice(choiceId: number): Promise<any> {
      return await this.http.delete<any>(`${this.API_URL}/choice/${choiceId}`,this.httpOptions).pipe(catchError(this.handleError)).toPromise();
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