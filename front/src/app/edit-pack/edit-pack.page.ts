import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpHeaders, HttpClient, HttpBackend } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-pack',
  templateUrl: './edit-pack.page.html',
  styleUrls: ['./edit-pack.page.scss'],
})

export class EditPackPage implements OnInit {
  pack;
  API_URL = environment.API_URL_DEV;

  constructor(
    @Inject(AuthService)
    public authService: AuthService,
    public http: HttpClient,
    handler: HttpBackend,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    let packId = this.activatedRoute.snapshot.paramMap.get('id');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.authService.getToken()
      })
    };
    let userId = this.authService.getLoggedUser().userId;
    this.http.get(`${this.API_URL}/user/${userId}/pack/${packId}`, httpOptions)
    .subscribe(
      result => {
        this.pack = result;

        if(this.pack == null){
          this.router.navigate(["/pack/"]);
        }
      });
  }

  expandAccordion(event){
    event.target.classList.toggle("active");

    let panel = event.target.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  }

  toggleAnswerType(event){

    let answerTypes = document.querySelectorAll(".answer-edit");
    let selected;

    answerTypes.forEach((answerType) => {
      selected = document.querySelector(".selected");
    });

    let selectedId = selected.id;

    if(selectedId != event.target.id){

      //Getting selected type
      let type = event.target.id;

      //Hide all panels
      let answerTypes = document.querySelectorAll(".answer-edit");
      answerTypes.forEach((answerType) => {
        answerType.classList.add("hidden");
      });

      //Show panel coresponding to the right id
      document.querySelector("#answer-"+type).classList.remove("hidden");

      //Displaying current type selected in toggle
      event.target.classList.toggle("selected");
      
      if(event.target.nextElementSibling){
        event.target.nextElementSibling.classList.toggle("selected");
      }

      if(event.target.previousElementSibling){
        event.target.previousElementSibling.classList.toggle("selected");
      }  

    }
      
  }

  toggleExtraType(event){

    let extraTypes = document.querySelectorAll(".extra-edit");
    let selected;

    extraTypes.forEach((answerType) => {
      selected = document.querySelector(".selected");
    });

    let selectedId = selected.id;

    if(selectedId != event.target.id){

      //Getting selected type
      let type = event.target.id;

      //Hide all panels
      let extraTypes = document.querySelectorAll(".extra-edit");
      extraTypes.forEach((extraTypes) => {
        extraTypes.classList.add("hidden");
      });

      //Show panel coresponding to the right id
      document.querySelector("#extra-"+type).classList.remove("hidden");

      //Displaying current type selected in toggle
      document.querySelectorAll(".toggle-extra").forEach((extraEdits) => {
        extraEdits.classList.remove("selected");
      });
      event.target.classList.add("selected");

    }
      
  }

}
