import { Component, OnInit, Inject } from '@angular/core';
import { HttpHeaders, HttpClient, HttpBackend } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-pack',
  templateUrl: './list-pack.page.html',
  styleUrls: ['./list-pack.page.scss'],
})
export class ListPackPage implements OnInit {
  API_URL = environment.API_URL_DEV;
  packs;

  constructor(
    @Inject(AuthService)
    public authService: AuthService,
    public http: HttpClient,
    handler: HttpBackend,
    public router: Router
  ){ 
    this.http = new HttpClient(handler);
  }

  ngOnInit() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.authService.getToken()
      })
    };
    let userId = this.authService.getLoggedUser().userId;
    this.http.get(`${this.API_URL}/user/${userId}/pack`, httpOptions)
    .subscribe(
      result => {
        this.packs = result;
      });
  }

  edit(packId){
    this.router.navigate(["/edit-pack/"+packId]);
  }

}
