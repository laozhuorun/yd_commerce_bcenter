import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ShipmentListComponent} from './list/list.component';
import {ShipmentSupportListComponent} from './support/list/list.component';

const routes: Routes = [
  {
    path: 'list', component: ShipmentListComponent
  },
  {
    path: 'support/list', component: ShipmentSupportListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShipmentRoutingModule {
}
