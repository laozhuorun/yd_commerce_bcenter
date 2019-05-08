import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {GoodsListComponent} from './list/list.component';
import {GoodsEditComponent} from './edit/edit.component';

import {GoodsCategoryListComponent} from './category/list/list.component';
import {GoodsCategoryAddComponent} from './category/add/add.component';
import {GoodsCategoryEditComponent} from './category/edit/edit.component';

import {GoodsAttributeListComponent} from './attribute/list/list.component';
import {GoodsAttributeEditComponent} from './attribute/edit/edit.component';


const routes: Routes = [
  {
    path: 'list', component: GoodsListComponent
  },
  {
    path: 'edit/:id', component: GoodsEditComponent
  },
  {
    path: 'category/list', component: GoodsCategoryListComponent
  },
  {
    path: 'category/add', component: GoodsCategoryAddComponent
  },
  {
    path: 'category/edit/:id', component: GoodsCategoryEditComponent
  },
  {
    path: 'attribute/list', component: GoodsAttributeListComponent
  },
  {
    path: 'attribute/edit/:id', component: GoodsAttributeEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoodsRoutingModule {
}
