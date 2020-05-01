import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpHeaders, HttpClient, HttpBackend } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ToastController, AlertController } from '@ionic/angular';

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
    public http: HttpClient,
    handler: HttpBackend,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    public toastController: ToastController,
    public alertController: AlertController,
    private fb: FormBuilder
  ) {}


  ngOnInit(){
    let packId = this.activatedRoute.snapshot.paramMap.get('id');

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

    //Fetch pack data
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.authService.getToken()
      })
    };
    let userId = this.authService.getLoggedUser().userId;
    this.http.get(`${this.API_URL}/user/${userId}/pack/${packId}`, this.httpOptions)
    .subscribe(
      result => {
        this.pack = result;
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
      });
    //Fetch tags data
    this.http.get(`${this.API_URL}/tag`, this.httpOptions)
    .subscribe(
        result => {
          this.tags = result;
        });
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
  addQuestion(){
    const dto = {pack: this.pack.packId};
    this.http.post<any>(`${this.API_URL}/round`,dto,this.httpOptions)
    .subscribe(
      (resultQuestion:any) => {
        //Add Extra
        let dto={round: resultQuestion.roundId, extraType: 0, url: ""};
        this.http.post<any>(`${this.API_URL}/extra`,dto,this.httpOptions)
        .subscribe((resultExtra:any) => {

          //Add one choice which is the answer
          let dto={round: resultQuestion.roundId, choice: "", isAnswer: true};
          this.http.post<any>(`${this.API_URL}/choice`,dto,this.httpOptions)
          .subscribe((resultChoice:any) => {
            let control = <FormArray>this.questionsForms.controls.questions;
            control.push(this.fb.group({
              roundId: [resultQuestion.roundId],
              question: new FormControl(resultQuestion.question, [Validators.required]),
              isMultipleChoice: [resultQuestion.isMultipleChoice],
              extraId: [resultExtra.extraId],
              extraType: 0,
              url:"",
              choices: this.fb.array([
                this.fb.group({
                  choiceId: [resultChoice.choiceId],
                  choice: new FormControl(resultChoice.choice, [Validators.required]),
                  isAnswer: [true]
                })
              ])
            }));
          });
        });
      },
      (error) => {
        this.toastController.create({
          message: 'Error while adding a question',
          duration: 2000
        }).then(toast=>toast.present());
    });
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
          handler: () => {
            this.http.delete<any>(`${this.API_URL}/round/${roundId}`,this.httpOptions)
            .subscribe(
              (result) => {
                this.toastController.create({
                  message: 'Question removed',
                  duration: 2000
                }).then(toast=>toast.present());
                //remove dynamicaly the question from the form
                let control = <FormArray>this.questionsForms.controls.questions;
                control.removeAt(control.value
                  .findIndex(i => i.roundId == roundId))
              },
              (error) => {
                this.toastController.create({
                  message: 'Error while removing the question',
                  duration: 2000
                }).then(toast=>toast.present());
            });
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
  addChoice(controlId, roundId){
    let control = <FormArray>this.questionsForms.get('questions').at(controlId).get('choices');
    if(control.length>=4)
      return;
      
    let dto={round: roundId, choice: "", isAnswer: false};
    this.http.post<any>(`${this.API_URL}/choice`,dto,this.httpOptions)
    .subscribe((resultChoice:any) => {
      control.push(this.fb.group({
        choiceId: [resultChoice.choiceId],
        choice: [resultChoice.choice, Validators.required],
        isAnswer: [resultChoice.isAnswer]
      }));
    });
  }

  removeChoice(controlId, choiceControlId, choiceId){
    this.http.delete<any>(`${this.API_URL}/choice/${choiceId}`,this.httpOptions)
    .subscribe(
      (result) => {
        //remove dynamicaly the choice from the form
        let control = <FormArray>this.questionsForms.get('questions')
                                  .at(controlId).get('choices');
        control.removeAt(control.value
          .findIndex(i => i.choiceId == choiceId))
      },
      (error) => {
        this.toastController.create({
          message: 'Error while removing the choice',
          duration: 2000
        }).then(toast=>toast.present());
    });
  }
  //#endregion

  savePack(){
    //stop if form invalid
    if (this.packForm.invalid) {
      return;
    }

    //save each question
    this.questionsForms.get('questions').controls.forEach(question => {
      if(question.invalid)
        return;

      //save extra of question 
      let extraDTO = { extraType: question.value.extraType,
                       url: question.value.url};
      this.http.put<any>(`${this.API_URL}/extra/${question.value.extraId}`,
                        extraDTO, this.httpOptions).subscribe((result) => {});

      //save each choices of question
      question.value.choices.forEach(choice => {
        let choiceDTO = { choice: choice.choice,
                          isAnswer: choice.isAnswer};
        this.http.put<any>(`${this.API_URL}/choice/${choice.choiceId}`,
                    choiceDTO, this.httpOptions).subscribe((result) => {});
      });
      
      //save question
      let questionDTO = {question: question.value.question,
                         isMultipleChoice : question.value.isMultipleChoice};
      this.http.put<any>(`${this.API_URL}/round/${question.value.roundId}`,
                          questionDTO, this.httpOptions)
      .subscribe(
      (result) => {},
      (error) => {
        this.toastController.create({
          message: 'Error while saving the question : '+question.roundId+1,
          duration: 2000
        }).then(toast=>toast.present());
      });
    });

    //save the pack
    this.http.put<any>(`${this.API_URL}/pack/${this.pack.packId}`,
                        this.packForm.value, this.httpOptions)
    .subscribe(
      (result) => {
        this.toastController.create({
          message: 'Pack saved',
          duration: 2000
        }).then(toast=>toast.present());
        this.router.navigateByUrl("/pack");
      },
      (error) => {
        this.toastController.create({
          message: 'Error while saving',
          duration: 2000
        }).then(toast=>toast.present());
    });
  }
  
}
