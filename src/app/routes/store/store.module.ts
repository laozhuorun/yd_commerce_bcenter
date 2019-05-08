import { NgModule } from '@angular/core';

import {SharedModule} from '@shared/shared.module';
import { StoreRoutingModule } from './store-routing.module';

import { StoreListComponent } from './list/list.component';
import { StoreAddComponent } from './add/add.component';
import { StoreEditComponent } from './edit/edit.component';
import { StoreLogoComponent } from './logo/logo.component';

const COMPONENTS = [
  StoreListComponent,
  StoreAddComponent,
  StoreEditComponent,
  StoreLogoComponent,
];

const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, StoreRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class StoreModule {
}
