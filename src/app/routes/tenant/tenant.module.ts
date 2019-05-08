import {NgModule} from '@angular/core';

import {SharedModule} from '@shared/shared.module';
import {TenantRoutingModule} from './tenant-routing.module';

import {TenantListComponent} from './list/list.component';
import {TenantEditComponent} from './edit/edit.component';
import {TenantFeatureComponent} from './feature/feature.component';
import {TenantSettingsComponent} from './settings/settings.component';


const COMPONENTS = [
  TenantListComponent,
  TenantEditComponent,
  TenantFeatureComponent,
  TenantSettingsComponent
];

const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, TenantRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT
})
export class TenantModule {
}
