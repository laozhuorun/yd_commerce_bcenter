import {NgModule} from '@angular/core';

import {SharedModule} from '@shared/shared.module';
import {AdvertRoutingModule} from './advert-routing.module';

import {AdvertListComponent} from './list/list.component';
import {AdvertEditComponent} from './edit/edit.component';
import {AdvertStatisticsComponent} from './statistics/statistics.component';

const COMPONENTS = [AdvertListComponent, AdvertEditComponent, AdvertStatisticsComponent];

const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    AdvertRoutingModule
  ],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT
})
export class AdvertModule {
}
