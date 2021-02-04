import { Component, OnInit, Inject } from '@angular/core';
import { HttpHeaders, HttpClient, HttpBackend } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { PackService } from '../services/pack.service';
import { GameService } from '../services/game.service';

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
  favoriteFilter=false;
  editMode;
  ownPackFilter=false;
  listFavorites;

  //params for hosting a game
  listPacksHost=[];

  constructor(
    @Inject(AuthService)
    public authService: AuthService,
    @Inject(PackService)
    public packService: PackService,
    @Inject(GameService)
    public gameService: GameService,
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

  async init() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.authService.getToken()
      })
    };
    let userId = this.authService.getLoggedUser().userId;
    if(this.router.url==='/selectpack'){
      this.editMode=false;
      this.packs = await this.packService.getAllPublicPacks();
    }
    else{
      this.editMode=true;
      this.packs = await this.packService.getAllPrivatePacks(userId);
    }

    this.tags = await this.packService.getAllTags();
    this.loadListFav();
  }

  async loadListFav(){
    let favorites:any = await this.packService.getFavorites(this.authService.getLoggedUser().userId); 
    let buf = [];
    favorites.forEach(pack => {
      buf.push(pack.packId);
    });
    this.listFavorites = buf;
  }


  edit(packId){
    this.router.navigate(["/pack/edit/"+packId]);
  }

  async create(){
    let dto = {author : this.authService.getLoggedUser().userId};
    let packCreated:any = await this.packService.createPack(dto);
    this.router.navigate(["/pack/edit/"+packCreated.packId]);
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
          handler: async () => {
            let dto = {pack : packId};
            try{
              await this.packService.deletePack(987);
              this.toastController.create({
                message: 'Pack successfully deleted',
                duration: 2000
              }).then(toast=>toast.present());
              this.packs = this.packs.filter(i => i.packId !== packId);
            }catch(e){
              this.toastController.create({
                message: 'Error while deleting pack',
                duration: 2000
              }).then(toast=>toast.present());
            }
          }
        }
      ]
    });
    await alert.present();
  }

  //#region Action on a pack
  async favPack(packId){
    let alreadyFav = false;
    let userId = this.authService.getLoggedUser().userId;
    let favorites = await this.packService.getFavorites(userId);

    favorites.forEach(favorite => {
      if(favorite.packId == packId)
        alreadyFav=true;
    });
        
    if(alreadyFav){
      try{
        await this.packService.deleteFavorite(userId, packId);
        this.loadListFav();
        this.toastController.create({
          message: 'Pack removed from favorites',
          duration: 2000
        }).then(toast=>toast.present());
      }
      catch(e){
        this.toastController.create({
          message: "Couldn't remove the pack from the favorites",
          duration: 2000
        }).then(toast=>toast.present());
      }
    }
    else{
      try{
        await this.packService.addFavorite(userId, packId);
        this.loadListFav();
        this.toastController.create({
          message: 'Pack added to favorites',
          duration: 2000
        }).then(toast=>toast.present());
      }
      catch(e){
        this.toastController.create({
          message: "Couldn't add the pack to the favorites",
          duration: 2000
        }).then(toast=>toast.present());
      }
    }
  }
  //#endregion

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
  filterFavorite(){
    this.favoriteFilter = !this.favoriteFilter;
    this.filter();
  }

  async filter(){
    let userId = this.authService.getLoggedUser().userId;
    //Filter own packs
    if(this.editMode || this.ownPackFilter)
      this.packs = await this.packService.getAllPrivatePacks(userId);
    else
      this.packs = await this.packService.getAllPublicPacks();

    //filter tag
    if(this.tagFilter && this.tagFilter.length!=0)
      this.packs = this.packs.filter(pack => this.tagFilter.includes(pack.tag.name));

    //filter name
    if(this.nameFilter!=""){
      this.packs = this.packs.filter(pack => {
        return (pack.name.toLowerCase().indexOf(this.nameFilter) > -1);
      });
    }

    //filter favorite
    if(this.favoriteFilter && this.listFavorites.length!=0){
      this.packs = this.packs.filter(pack => this.listFavorites.includes(pack.packId));
    }
  }
  //#endregion

  //#region List pack to host
  addToListPacksHost(packId){
    if(this.listPacksHost.length == 0 || !this.listPacksHost.some(x => x.packId == packId))
      this.listPacksHost.push(this.packs.find(x => x.packId == packId));
  }

  removeToListPacksHost(packId){
    if(this.listPacksHost.length != 0 && this.listPacksHost.some(x => x.packId == packId))
      this.listPacksHost.splice(this.listPacksHost.indexOf(this.listPacksHost.find(x => x.packId == packId)), 1);
  }

  async hostGame(){
    if(this.listPacksHost.length == 0){
      this.toastController.create({
        message: "Can't host a room without any pack",
        duration: 2000
      }).then(toast=>toast.present());
      return;
    }

    //Trying to create a room
    let dto = {owner : this.authService.getLoggedUser().userId,
               pack : this.listPacksHost};
    try{
      let gameCreated = await this.gameService.createGame(dto);
        this.router.navigate(["/lobby/"+gameCreated.code]);
    }
    catch(e){
        this.toastController.create({
          message: 'Error while trying to create a room',
          duration: 2000
        }).then(toast=>toast.present());
    }
  }

  toggleSelectedPacks(){
    let gameInfos = document.querySelector('.game-infos') as HTMLElement;
    gameInfos.classList.toggle('showMobile');
  }
  
  //#endregion
}