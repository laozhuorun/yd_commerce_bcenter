import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdvertListComponent } from './list/list.component';
import { AdvertEditComponent } from './edit/edit.component';
import { AdvertStatisticsComponent } from './statistics/statistics.component';

const routes: Routes = [
  { path: 'list', component: AdvertListComponent },
  { path: 'edit/:id', component: AdvertEditComponent },
  { path: 'statistics', component: AdvertStatisticsComponent },
  { path: 'auth', component: AdvertListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvertRoutingModule {}
