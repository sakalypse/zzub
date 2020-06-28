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
  tags;
  tagFilter;
  nameFilter="";
  editMode;
  ownPackFilter=false;

  //params for hosting a game
  listPacksHost=[];

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
    if(this.router.url==='/selectpack'){
      this.editMode=false;
      //get all public packs
      this.http.get(`${this.API_URL}/pack/public`, this.httpOptions)
      .subscribe(
        result => {
          this.packs = result;
      });
    }
    else{
      this.editMode=true;
      //get own packs
      this.http.get(`${this.API_URL}/user/${userId}/pack`, this.httpOptions)
      .subscribe(
        result => {
          this.packs = result;
      });
    }
    
    //get tags
    this.http.get(`${this.API_URL}/tag`, this.httpOptions)
    .subscribe(
      result => {
        this.tags = result;
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

  //#region Filter
  toggleFilters(){
    let filterMenu = document.querySelector('.filters-mega-container') as HTMLElement;

    if(filterMenu.style.display == "none"){
      filterMenu.style.display = "block";
    }
    else{
      filterMenu.style.display = "none";
    }

  }

  filterName(event:any){
    const val = event.target.value;

    if (val && val.trim() != '')
      this.nameFilter = val.toLowerCase();
    else
      this.nameFilter="";
    this.filter();
  }

  /*
  * Triggered when clicked on "My packs" button
  */
  filterOwnPacks(){
    this.ownPackFilter = !this.ownPackFilter;
    this.filter();
  }

  filter(){
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.authService.getToken()
      })
    };
    let userId = this.authService.getLoggedUser().userId;
    //get packs
    let pathToPackAPI;
    if(this.editMode || this.ownPackFilter)
      pathToPackAPI = `${this.API_URL}/user/${userId}/pack`;
    else
      pathToPackAPI = `${this.API_URL}/pack/public`;

    this.http.get(pathToPackAPI, this.httpOptions)
    .subscribe(
      result => {
        this.packs = result;
      },
      error=>{},
      ()=>{
        //filter tag
        if(this.tagFilter && this.tagFilter.length!=0)
          this.packs = this.packs.filter(pack => this.tagFilter.includes(pack.tag.name));
        //filter name
        if(this.nameFilter!=""){
          this.packs = this.packs.filter(pack => {
            return (pack.name.toLowerCase().indexOf(this.nameFilter) > -1);
          });
        }
      }
    );
  }
  //#endregion

  //#region List pack to host
  addToListPacksHost(packId){
    if(this.listPacksHost.length == 0 || !this.listPacksHost.some(x => x.packId == packId))
      this.listPacksHost.push(this.packs.find(x => x.packId == packId));
  }

  removeToListPacksHost(packId){
    if(this.listPacksHost.length != 0 && this.listPacksHost.some(x => x.packId == packId))
      this.listPacksHost.splice(this.listPacksHost.indexOf(this.packs.find(x => x.packId == packId)), 1);
  }
  //#endregion
}