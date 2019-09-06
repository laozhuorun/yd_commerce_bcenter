import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComprehensiveStatisticsComponent } from './compre/compre.component';

const routes: Routes = [{ path: 'compre', component: ComprehensiveStatisticsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatisticsRoutingModule {}
