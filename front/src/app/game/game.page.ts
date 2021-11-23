import { Component, OnInit, Inject } from '@angular/core';
import { HttpHeaders, HttpClient, HttpBackend } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
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
export class GamePage implements OnInit {
  enumExtraType = ExtraType;

  roomCode;
  room;
  userId;
  owner;
  listPlayerScore;

  indexCurrentPack = 0;
  currentPack;
  indexCurrentRound = 0;

  currentQuestion;
  currentChoices;
  currentExtra;

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
    this.userId = await this.authService.getLoggedUser().userId;
    this.roomCode = this.activatedRoute.snapshot.paramMap.get('code');
    this.room = await this.gameService.getGameByCode(this.roomCode);
    this.owner = (this.room.owner.userId == this.userId) ? true : false;

    this.listPlayerScore = [];
    this.room.players.forEach(player => {
      this.listPlayerScore.push({ 'userId': player.userId, 'username': player.username, 'score': 0 });
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
    });

    //Listen for end of round
    this.socket.fromEvent('endOfRound').
    subscribe(async (data:any) => {
      //Add point to winner
      let player = this.listPlayerScore.find(x => x.userId == data.userId);
      player.score++;

      //Show score scene
      this.showQuestion = false;
    });

    //Listen for false answer
    this.socket.fromEvent('playerWrong').
    subscribe(async (data:any) => {
      if(this.userId == data.userId){
        this.canAnswer = false;
      }
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
        //Wrong
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

      //Emit question
      this.socket.emit('sendQuestion',
        { roomCode: this.roomCode,
          question: round.question,
          roundIsMultipleChoice: round.isMultipleChoice,
          choices: round.choices,
          extra: round.extra});
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
    await this.gameService.removeUserToGame(this.room.gameId, this.userId);
    if(this.authService.getLoggedUser().role == Role.guest){
      await this.userService.deleteGuest(this.authService.getLoggedUser().userId);
      this.authService.clearStorage();
    }

    this.socket.emit('quitGame', this.userId, this.roomCode);
    this.router.navigate(["/homepage/"]);
  }

  async deleteRoom(){
    await this.gameService.deleteGame(this.room.gameId); 
    this.socket.emit('killGame', this.roomCode);
    this.router.navigate(["/homepage/"]);
  }
}
