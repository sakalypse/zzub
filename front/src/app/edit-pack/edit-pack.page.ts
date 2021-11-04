import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpHeaders, HttpClient, HttpBackend } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ToastController, AlertController } from '@ionic/angular';
import { PackService } from '../services/pack.service';

@Component({
  selector: 'app-edit-pack',
  templateUrl: './edit-pack.page.html',
  styleUrls: ['./edit-pack.page.scss'],
})

export class EditPackPage implements OnInit {
  httpOptions;
  pack;
  questionsForms;
  tags;

  packForm: FormGroup;
  name: FormControl;
  language: FormControl;
  tag: FormControl;
  isPublic: FormControl;

  API_URL = environment.API_URL_DEV;
  
  constructor(
    @Inject(AuthService)
    public authService: AuthService,
    @Inject(PackService)
    private packService:PackService,
    public http: HttpClient,
    handler: HttpBackend,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    public toastController: ToastController,
    public alertController: AlertController,
    private fb: FormBuilder
  ) {}


  ngOnInit(){
    this.init();
  }

  async init(){
    let packId = Number.parseInt(this.activatedRoute.snapshot.paramMap.get('id'));

    //Init control form
    this.name = new FormControl([Validators.required, Validators.minLength(1), Validators.maxLength(50)]);
    this.language = new FormControl();
    this.tag = new FormControl();
    this.isPublic = new FormControl();
    this.packForm = new FormGroup({
      name: this.name,
      language: this.language,
      tag: this.tag,
      isPublic: this.isPublic
    });

    let userId = this.authService.getLoggedUser().userId;
    this.pack = await this.packService.getPack(userId, packId);
    if(this.pack == null){
      this.router.navigate(["/pack/"]);
    }
    this.initQuestionsForms();

    //assign value
    this.name.setValue(this.pack.name);
    this.language.setValue(this.pack.language);
    if(this.pack.tag)
      this.tag.setValue(this.pack.tag.tagId);
    this.isPublic.setValue(this.pack.isPublic);
    let author = new FormControl(this.pack.author.userId);
    this.packForm.addControl("author", author)
        
    this.tags = await this.packService.getAllTags();
  }

  //#region Toggles
  expandAccordion(event){
    event.target.classList.toggle("active");

    let panel = event.target.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  }

  toggleAnswerType(event, roundId){
    //update value in questionsForms
    if(event.target.id=="multiple")
      this.questionsForms.get('questions').get(''+roundId)
          .get("isMultipleChoice").setValue(true);
    else if(event.target.id=="single")
      this.questionsForms.get('questions').get(''+roundId)
          .get("isMultipleChoice").setValue(false);
  }

  toggleExtraType(event, roundId){
    //update value in questionsForms
    switch (event.target.id){
      case 'noExtra':
        this.questionsForms.get('questions').get(''+roundId)
        .get("extraType").setValue(0);
        break;
      case 'audio':
        this.questionsForms.get('questions').get(''+roundId)
        .get("extraType").setValue(1);
        break;
      case 'video':
        this.questionsForms.get('questions').get(''+roundId)
        .get("extraType").setValue(2);
        break;
      case 'img':
        this.questionsForms.get('questions').get(''+roundId)
        .get("extraType").setValue(3);
        break;
    }
  }
  //#endregion

  //#region add/remove/init questions
  async addQuestion(){
    try{
      const dtoRound = {pack: this.pack.packId};
      let round:any = await this.packService.createRound(dtoRound);
    
      //Add Extra
      let dtoExtra ={round: round.roundId, extraType: 0, url: ""};
      let extra:any = await this.packService.createExtra(dtoExtra);

      //Add one choice which is the answer
      let dtoAnswer={round: round.roundId, choice: "", isAnswer: true};
      let choice:any = await this.packService.createChoice(dtoAnswer);
      
      let control = <FormArray>this.questionsForms.controls.questions;
      control.push(this.fb.group({
        roundId: [round.roundId],
        question: new FormControl(round.question, [Validators.required]),
        isMultipleChoice: [round.isMultipleChoice],
        extraId: [extra.extraId],
        extraType: 0,
        url:"",
        choices: this.fb.array([
          this.fb.group({
            choiceId: [choice.choiceId],
            choice: new FormControl(choice.choice, [Validators.required]),
            isAnswer: [true]
          })
        ])
      }));
    }
    catch(e){
      this.toastController.create({
        message: 'Error while adding a question',
        duration: 2000
      }).then(toast=>toast.present());
    }
  }

  async removeQuestion(roundId){
    const alert = await this.alertController.create({
      header: 'Confirm',
      message: 'Are you sure to delete this question?',
      buttons: [
        {
          text: 'Cancel'
        }, {
          text: 'Delete',
          handler: async () => {
            try{
              await this.packService.deleteRound(roundId);
              this.toastController.create({
                message: 'Question removed',
                duration: 2000
              }).then(toast=>toast.present());
              //remove dynamicaly the question from the form
              let control = <FormArray>this.questionsForms.controls.questions;
              control.removeAt(control.value
                .findIndex(i => i.roundId == roundId))
            }
            catch(e){
              this.toastController.create({
                message: 'Error while removing the question',
                duration: 2000
              }).then(toast=>toast.present());
            }
          }
        }
      ]
    });
    await alert.present();
  }

  initQuestionsForms(){
    this.questionsForms = this.fb.group({
      questions: this.fb.array([])
    })
    let control = <FormArray>this.questionsForms.controls.questions;
    
    this.pack.rounds.forEach(round => {
      //init form control
      let newQuestion = this.fb.group({
        roundId: [round.roundId],
        question: new FormControl(round.question, [Validators.required]),
        isMultipleChoice: [round.isMultipleChoice],
        extraId: [round.extra.extraId],
        extraType: [round.extra.extraType],
        url: [round.extra.url],
        choices: this.fb.array([])
      })
      
      //init and add form control for each choices
      round.choices.forEach(choice => {
        (<FormArray>newQuestion.controls.choices).push(
          this.fb.group({
          choiceId: [choice.choiceId],
          choice: [choice.choice, Validators.required],
          isAnswer: [choice.isAnswer]
        }));
      });
      control.push(newQuestion);
    });
  }
  //#endregion

  //#region add/remove choices
  async addChoice(controlId, roundId){
    let control = <FormArray>this.questionsForms.get('questions').at(controlId).get('choices');
    if(control.length>=4)
      return;
      
    let dto={round: roundId, choice: "", isAnswer: false};
    let choice:any = await this.packService.createChoice(dto);
    control.push(this.fb.group({
      choiceId: [choice.choiceId],
      choice: [choice.choice, Validators.required],
      isAnswer: [choice.isAnswer]
    }));
  }

  async removeChoice(controlId, choiceControlId, choiceId){
    try{
      await this.packService.deleteChoice(choiceId);
      //remove dynamicaly the choice from the form
      let control = <FormArray>this.questionsForms.get('questions')
                                .at(controlId).get('choices');
      control.removeAt(control.value
        .findIndex(i => i.choiceId == choiceId))
    }
    catch(e){
      this.toastController.create({
        message: 'Error while removing the choice',
        duration: 2000
      }).then(toast=>toast.present());
    }
  }
  //#endregion

  async savePack(){
    //stop if form invalid
    if (this.packForm.invalid) {
      return;
    }

    //save each question
    this.questionsForms.get('questions').controls.forEach(async question => {
      if(question.invalid)
        return;

      //save extra of question 
      let extraDTO = { extraType: question.value.extraType,
                       url: question.value.url};
      await this.packService.saveExtra(question.value.extraId, extraDTO);

      //save each choices of question
      question.value.choices.forEach(async choice => {
        let choiceDTO = { choice: choice.choice,
                          isAnswer: choice.isAnswer};
        await this.packService.saveChoice(choice.choiceId, choiceDTO);
      });
      
      //save question
      let questionDTO = {question: question.value.question,
                         isMultipleChoice : question.value.isMultipleChoice};
      try{
        await this.packService.saveRound(question.value.roundId, questionDTO);
      }
      catch(e){
        this.toastController.create({
          message: 'Error while saving the question : '+question.roundId+1,
          duration: 2000
        }).then(toast=>toast.present());
      }
    });

    //save the pack
    try{
      await this.packService.savePack(this.pack.packId, this.packForm.value);
      this.toastController.create({
        message: 'Pack saved',
        duration: 2000
      }).then(toast=>toast.present());
      this.router.navigateByUrl("/pack");
    }
    catch(e){
      this.toastController.create({
        message: 'Error while saving',
        duration: 2000
      }).then(toast=>toast.present());
    }
  }
  
}
