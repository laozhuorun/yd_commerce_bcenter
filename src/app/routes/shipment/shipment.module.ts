import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { ShipmentRoutingModule } from './shipment-routing.module';

import { ShipmentListComponent } from './list/list.component';
import { ShipmentListImportComponent } from './list/import.component';
import { ShipmentEditComponent } from './edit/edit.component';
import { LogisticsComponent } from './logistics/logistics.component';

const COMPONENTS = [ShipmentListComponent, ShipmentEditComponent, LogisticsComponent];

const COMPONENTS_NOROUNT = [ShipmentListImportComponent];

@NgModule({
  imports: [SharedModule, ShipmentRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class ShipmentModule {}
