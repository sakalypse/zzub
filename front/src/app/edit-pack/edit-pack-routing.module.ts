import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditPackPage } from './edit-pack.page';

const routes: Routes = [
  {
    path: '',
    component: EditPackPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditPackPageRoutingModule {}
