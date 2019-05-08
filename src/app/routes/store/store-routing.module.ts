import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoreListComponent } from './list/list.component';
import { StoreAddComponent } from './add/add.component';
import { StoreEditComponent } from './edit/edit.component';


const routes: Routes = [
  {
    path: 'list', component: StoreListComponent,
  },
  {
    path: 'add', component: StoreAddComponent,
  },
  {
    path: 'edit/:id', component: StoreEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoreRoutingModule {
}
