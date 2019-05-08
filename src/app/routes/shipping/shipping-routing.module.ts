import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ShippingListComponent} from './list/list.component';

const routes: Routes = [
  {
    path: 'list', component: ShippingListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShippingRoutingModule {
}
