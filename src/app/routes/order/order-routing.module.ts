import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderListComponent } from './list/list.component';
import { OrderEditComponent } from './edit/edit.component';
import { BatchShipComponent } from './batch-ship/batch-ship.component';

const routes: Routes = [
  {
    path: 'list',
    component: OrderListComponent,
  },
  {
    path: 'batchship',
    component: BatchShipComponent,
  },
  {
    path: 'edit/:id',
    component: OrderEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule {}
