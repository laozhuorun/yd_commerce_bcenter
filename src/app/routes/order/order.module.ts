import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { OrderRoutingModule } from './order-routing.module';

import { OrderListComponent } from './list/list.component';
import { OrderEditComponent } from './edit/edit.component';

import { OrderListViewComponent } from './view/view.component';
import { BatchShipComponent } from './batch-ship/batch-ship.component';
import { ShipTrackComponent } from './ship-track/ship-track.component';
import { QuickShipComponent } from './list/quick-ship/quick-ship.component';

const COMPONENTS = [OrderListComponent, OrderEditComponent];

const COMPONENTS_NOROUNT = [OrderListViewComponent, ShipTrackComponent, BatchShipComponent, QuickShipComponent];

@NgModule({
  imports: [SharedModule, OrderRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT, ShipTrackComponent],
  entryComponents: COMPONENTS_NOROUNT,
})
export class OrderModule {}
