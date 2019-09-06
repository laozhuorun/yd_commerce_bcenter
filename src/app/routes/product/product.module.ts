import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { ProductRoutingModule } from './product-routing.module';

import { ProductListComponent } from './list/list.component';
import { ProductEditComponent } from './edit/edit.component';
import { ProductAttributeListComponent } from './attribute/list/list.component';
import { ProductAttributeEditComponent } from './attribute/edit/edit.component';
import { ProductCategoryListComponent } from './category/list/list.component';
import { ProductCategoryAddComponent } from './category/add/add.component';
import { ProductCategoryEditComponent } from './category/edit/edit.component';
import { ProductSkuAttrComponent } from './sku/attr.component';
import { ProductSkuAttrValueComponent } from './sku/value/value.component';

const COMPONENTS = [
  ProductListComponent,
  ProductEditComponent,
  ProductCategoryListComponent,
  ProductCategoryAddComponent,
  ProductCategoryEditComponent,
  ProductAttributeListComponent,
  ProductAttributeEditComponent,
];

const COMPONENTS_NOROUNT = [ProductSkuAttrComponent, ProductSkuAttrValueComponent];

@NgModule({
  imports: [SharedModule, ProductRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class ProductModule {}
