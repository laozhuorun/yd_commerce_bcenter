import {NgModule} from '@angular/core';

import {SharedModule} from '@shared/shared.module';
import {ShippingRoutingModule} from './shipping-routing.module';

import {ShippingListComponent} from './list/list.component';

const COMPONENTS = [
  ShippingListComponent,
];

const COMPONENTS_NOROUNT = [
];

@NgModule({
  imports: [SharedModule, ShippingRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT
})
export class ShippingModule {
}
