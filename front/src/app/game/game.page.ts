import { Component, OnInit, OnDestroy, Inject, HostListener } from '@angular/core';
import { HttpHeaders, HttpClient, HttpBackend } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Socket, SocketIoModule, SocketIoConfig  } from 'ngx-socket-io';
import { GameService } from '../services/game.service';
import { UserService } from '../services/user.service';
import { Role } from '../services/role.enum';
import { PackService } from '../services/pack.service';
import { ExtraType } from '../services/shared.enum';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit, OnDestroy {
  enumExtraType = ExtraType;

  roomCode;
  room;
  userId;
  owner;
  listPlayer;

  indexCurrentPack = 0;
  currentPack;
  indexCurrentRound = 0;

  currentQuestion;
  currentChoices;
  currentExtra;

  currentPackName;
  currentNumberQuestion;
  currentIndexQuestion = 1;

  showQuestion = false;
  canAnswer;

  roundIsMultipleChoice;

  constructor(
    @Inject(AuthService)
    public authService: AuthService,
    @Inject(GameService)
    private gameService:GameService,
    @Inject(UserService)
    private userService:UserService,
    @Inject(PackService)
    private packService:PackService,
    public http: HttpClient,
    handler: HttpBackend,
    public router: Router,
    private activatedRoute:ActivatedRoute,
    public alertController: AlertController,
    public toastController: ToastController,
    public socket:Socket,
  ) { 
    this.http = new HttpClient(handler);
    activatedRoute.params.subscribe(val => {
      this.init();
    });
  }

  ngOnInit() { }

  async init(){
    const config: SocketIoConfig = { url: environment.API_URL_DEV, options: {}};
    this.socket = new Socket(config);

    this.roomCode = this.activatedRoute.snapshot.paramMap.get('code');
    this.room = await this.gameService.getGameByCode(this.roomCode).then(res => { return res});
    this.userId = this.authService.getLoggedUser().userId;
    this.owner = (this.room.owner.userId == this.userId) ? true : false;

    //handle refresh
    this.socket.emit('rejoin', this.roomCode);

    this.listPlayer = [];
    this.room.players.forEach(player => {
      this.listPlayer.push({ 'userId': player.userId, 'username': player.username, 'score': 0, 'wrong': false });
    });

    this.initPlayer();

    if(this.owner)
      this.initHost();
  }

  async initPlayer(){
    //listen for questions
    this.socket.fromEvent('sendQuestion').
    subscribe(async (data:any) => {
      //Remove score scene
      this.showQuestion = true;
      this.canAnswer = true;

      this.roundIsMultipleChoice = data.roundIsMultipleChoice;

      this.currentQuestion = data.question;
      this.currentChoices = data.choices;

      this.currentExtra = data.extra;

      this.currentPackName = data.packName;
      this.currentNumberQuestion = data.numberQuestion;
    });

    //Listen for end of round
    this.socket.fromEvent('endOfRound').
    subscribe(async (data:any) => {
      //Add point to winner
      let player = this.listPlayer.find(x => x.userId == data.userId);
      player.score++;
      //Sort list player by score before showing it
      this.listPlayer.sort(function(x, y) {
        return y.score - x.score;
      });

      this.currentIndexQuestion++;
      //Show score scene
      this.showQuestion = false;
    });

    //Listen for false answer
    this.socket.fromEvent('playerWrong').
    subscribe(async (data:any) => {
      if(this.userId == data.userId){
        this.canAnswer = false;
      }

      this.listPlayer.find(x => x.userId == data.userId).wrong = true;
    });


    //listen for player quitting
    this.socket.fromEvent('quitGame').
    subscribe(async id => {
      this.listPlayer = this.listPlayer.
                        filter(x => x.userId !== id);
    });

    //listen for session killed
    this.socket.fromEvent('killGame').
    subscribe(async id => {
      this.socket.emit('quitGame', this.userId, this.roomCode);

      //Delete itself if guest
      if(this.authService.getLoggedUser().role == Role.guest){
        await this.userService.deleteGuest(this.authService.getLoggedUser().userId);
        this.authService.clearStorage();
      }
      this.router.navigate(["/"]);
    });
  }

  //#region Host
  async initHost(){
    this.currentPack = this.room.packs[this.indexCurrentPack];
    //---Listen for responses
    //Multiple answer
    this.socket.fromEvent('playerSendChoice').
    subscribe(async (data:any) => {
      if(this.currentChoices.find(x => x.isAnswer == true).choiceId == data.choiceId){
        //Right response. End the round and emit the winner userId to all 
        this.socket.emit('endOfRound',
        { roomCode: this.roomCode,
          userId: data.userId});
      }
      else{
        //Wrong response
        //Tell player that he is wrong
        this.socket.emit('playerWrong',
        { roomCode: this.roomCode,
          userId: data.userId});
      }
    });

    //Typed answer
    this.socket.fromEvent('playerSendInputChoice').
    subscribe(async (data:any) => {
      if(this.currentChoices.find(x => x.isAnswer == true).choice.toLowerCase() == data.inputChoice.toLowerCase()){
        //Right response. End the round and emit the winner userId to all 
        this.socket.emit('endOfRound',
        { roomCode: this.roomCode,
          userId: data.userId});
      }
      else{
        //Wrong
        this.socket.emit('playerWrong',
        { roomCode: this.roomCode,
          userId: data.userId});
      }
    });
  }

  async sendNextQuestion(){
    if(this.owner){
      //Init question to send
      if(this.indexCurrentRound>=this.currentPack.rounds.length){
          //next pack
        if(this.indexCurrentPack>=this.room.packs.length-1){
          //TODO : Scene end game 
          //Show winner
          //console.log(this.listPlayerScore.sort((x,y) => x.score > y.score ? 1 : -1)[this.listPlayerScore.length-1]);
          return;
        }
        this.currentPack = this.room.packs[++this.indexCurrentPack];
        this.indexCurrentRound = 0;
      }
      var round = this.currentPack.rounds[this.indexCurrentRound++];

      if(round.isMultipleChoice){
        //shuffle choices
        for (let i = round.choices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [round.choices[i], round.choices[j]] = [round.choices[j], round.choices[i]];
        }
      }

      //Reinit players capacity to vote
      this.listPlayer.forEach(player => {
        player.wrong = false;
      });

      //Emit question
      this.socket.emit('sendQuestion',
        { roomCode: this.roomCode,
          question: round.question,
          roundIsMultipleChoice: round.isMultipleChoice,
          choices: round.choices,
          extra: round.extra,
          packName: this.currentPack.name,
          numberQuestion: this.currentPack.rounds.length});
    }
  }
  //#endregion

  //#region Player
  async playerSendChoice(choiceId){
    if(this.canAnswer){
      this.socket.emit('playerSendChoice',
          { roomCode: this.roomCode,
            choiceId: choiceId,
            userId: this.userId});
    }
  }

  async playerSendInputChoice(inputChoice){
    if(this.canAnswer){
      this.socket.emit('playerSendInputChoice',
          { roomCode: this.roomCode,
            inputChoice: inputChoice,
            userId: this.userId});
    }
  }
  //#endregion

  async exitRoom(){
    this.socket.emit('quitGame', this.userId, this.roomCode);
    await this.gameService.removeUserToGame(this.room.gameId, this.userId);
    this.router.navigate(["/"]);
  }

  async deleteRoom(){
    this.socket.emit('killGame', this.roomCode);
    await this.gameService.deleteGame(this.room.gameId); 
    this.router.navigate(["/"]);
  }

  @HostListener('unloaded')
  ngOnDestroy() {
    this.socket.disconnect();
  }
}