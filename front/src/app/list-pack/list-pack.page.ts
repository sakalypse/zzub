import { Component, OnInit, Inject } from '@angular/core';
import { HttpHeaders, HttpClient, HttpBackend } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-list-pack',
  templateUrl: './list-pack.page.html',
  styleUrls: ['./list-pack.page.scss'],
})
export class ListPackPage implements OnInit {
  API_URL = environment.API_URL_DEV;
  httpOptions;
  packs;
  editMode = true;

  constructor(
    @Inject(AuthService)
    public authService: AuthService,
    public http: HttpClient,
    handler: HttpBackend,
    public router: Router,
    activatedRoute:ActivatedRoute,
    public alertController: AlertController,
    public toastController: ToastController
  ){ 
    this.http = new HttpClient(handler);
    activatedRoute.params.subscribe(val => {
      this.init();
    });
  }

  ngOnInit(){
    this.init();
  }

  init() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.authService.getToken()
      })
    };
    let userId = this.authService.getLoggedUser().userId;
    this.http.get(`${this.API_URL}/user/${userId}/pack`, this.httpOptions)
    .subscribe(
      result => {
        this.packs = result;
      });
  }


  edit(packId){
    this.router.navigate(["/pack/edit/"+packId]);
  }

  create(){
    let dto = {author : this.authService.getLoggedUser().userId};
    this.http.post(`${this.API_URL}/pack`, dto, this.httpOptions)
    .subscribe(
      (result:any) => {
        this.router.navigate(["/pack/edit/"+result.packId]);
      },
      error=>{
        this.toastController.create({
          message: 'Error while trying to create a pack',
          duration: 2000
        }).then(toast=>toast.present());
    });
  }

  async alertConfirmDelete(packId) {
    const alert = await this.alertController.create({
      header: 'Confirm',
      message: 'Are you sure to delete this pack?',
      buttons: [
        {
          text: 'Cancel'
        }, {
          text: 'Delete',
          handler: () => {
            let dto = {pack : packId};
            this.http.delete(`${this.API_URL}/pack/${packId}`,this.httpOptions)
            .subscribe(
              (result:any) => {
                this.toastController.create({
                  message: 'Pack successfully deleted',
                  duration: 2000
                }).then(toast=>toast.present());
                
                this.packs = this.packs.filter(i => i.packId !== packId);
              },
              error=>{
                this.toastController.create({
                  message: 'Error while trying to create a pack',
                  duration: 2000
                }).then(toast=>toast.present());
            });
          }
        }
      ]
    });
    await alert.present();
  }

  toggleFilters(){
    let filterMenu = document.querySelector('.filters-mega-container') as HTMLElement;

    if(filterMenu.style.display == "none"){
      filterMenu.style.display = "block";
    }
    else{
      filterMenu.style.display = "none";
    }

  }

}
