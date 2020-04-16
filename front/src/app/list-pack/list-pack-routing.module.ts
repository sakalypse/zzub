import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListPackPage } from './list-pack.page';

const routes: Routes = [
  {
    path: '',
    component: ListPackPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListPackPageRoutingModule {}
