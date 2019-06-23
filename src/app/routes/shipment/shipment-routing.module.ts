import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShipmentListComponent } from './list/list.component';
import { LogisticsComponent } from './logistics/logistics.component';

const routes: Routes = [
  {
    path: 'list',
    component: ShipmentListComponent,
  },
  {
    path: 'logistics',
    component: LogisticsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShipmentRoutingModule {}
