import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TenantListComponent } from './list/list.component';
import { TenantEditComponent } from './edit/edit.component';
import { TenantFeatureComponent } from './feature/feature.component';
import { TenantSettingsComponent } from './settings/settings.component';

const routes: Routes = [
  {
    path: 'list', component: TenantListComponent,
  },
  {
    path: 'edit/:id', component: TenantEditComponent,
  },
  {
    path: 'feature', component: TenantFeatureComponent,
  },
  {
    path: 'settings', component: TenantSettingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TenantRoutingModule {
}
