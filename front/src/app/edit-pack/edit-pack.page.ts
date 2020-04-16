import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-pack',
  templateUrl: './edit-pack.page.html',
  styleUrls: ['./edit-pack.page.scss'],
})
export class EditPackPage implements OnInit {
  id=null;
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
  }

}
