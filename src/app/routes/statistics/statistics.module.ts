import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { StatisticsRoutingModule } from './statistics-routing.module';
import { ComprehensiveStatisticsComponent } from './compre/compre.component';

const COMPONENTS = [ComprehensiveStatisticsComponent];

const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, StatisticsRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class StatisticsModule {}
