import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductListComponent } from './list/list.component';
import { ProductEditComponent } from './edit/edit.component';

import { ProductCategoryListComponent } from './category/list/list.component';
import { ProductCategoryAddComponent } from './category/add/add.component';
import { ProductCategoryEditComponent } from './category/edit/edit.component';

import { ProductAttributeListComponent } from './attribute/list/list.component';
import { ProductAttributeEditComponent } from './attribute/edit/edit.component';

const routes: Routes = [
  {
    path: 'list',
    component: ProductListComponent,
  },
  {
    path: 'edit/:id',
    component: ProductEditComponent,
  },
  {
    path: 'category/list',
    component: ProductCategoryListComponent,
  },
  {
    path: 'category/add',
    component: ProductCategoryAddComponent,
  },
  {
    path: 'category/edit/:id',
    component: ProductCategoryEditComponent,
  },
  {
    path: 'attribute/list',
    component: ProductAttributeListComponent,
  },
  {
    path: 'attribute/edit/:id',
    component: ProductAttributeEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
