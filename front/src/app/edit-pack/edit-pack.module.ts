import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPackPageRoutingModule } from './edit-pack-routing.module';

import { EditPackPage } from './edit-pack.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditPackPageRoutingModule
  ],
  declarations: [EditPackPage]
})
export class EditPackPageModule {}
