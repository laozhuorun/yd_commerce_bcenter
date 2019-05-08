import {NgModule} from '@angular/core';

import {SharedModule} from '@shared/shared.module';
import {GoodsRoutingModule} from './goods-routing.module';

import {GoodsListComponent} from './list/list.component';

import {GoodsEditComponent} from './edit/edit.component';

import {GoodsAttributeListComponent} from './attribute/list/list.component';
import {GoodsAttributeEditComponent} from './attribute/edit/edit.component';

import {GoodsCategoryListComponent} from './category/list/list.component';
import {GoodsCategoryAddComponent} from './category/add/add.component';
import {GoodsCategoryEditComponent} from './category/edit/edit.component';

import {GoodsSkuAttrComponent} from './sku/attr.component';
import {GoodsSkuAttrValueComponent} from './sku/value/value.component';

const COMPONENTS = [
  GoodsListComponent,
  GoodsEditComponent,
  GoodsCategoryListComponent,
  GoodsCategoryAddComponent,
  GoodsCategoryEditComponent,
  GoodsAttributeListComponent,
  GoodsAttributeEditComponent
];

const COMPONENTS_NOROUNT = [
  GoodsSkuAttrComponent,
  GoodsSkuAttrValueComponent
];

@NgModule({
  imports: [SharedModule, GoodsRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT
})
export class GoodsModule {
}
