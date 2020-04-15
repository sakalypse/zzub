import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListPackPageRoutingModule } from './list-pack-routing.module';

import { ListPackPage } from './list-pack.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListPackPageRoutingModule
  ],
  declarations: [ListPackPage]
})
export class ListPackPageModule {}
