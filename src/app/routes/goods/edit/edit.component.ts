import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationStrategy } from '@angular/common';

import { NzMessageService } from 'ng-zorro-antd';

export interface Interface {
  _id?: string;
  name: string;
}

import {
  CreateOrUpdateProductInput,
  ProductAttributeServiceProxy,
  ProductAttributeDto,
  CategoryServiceProxy,
  ProductCategoryDto,
  AttributeCombinationDto,
  ProductAttributeValueDto,
  ProductPictureDto,
  ProductServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { deepCopy } from '@delon/util';

@Component({
  selector: 'app-goods-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less'],
})
export class GoodsEditComponent implements OnInit {
  loading = false;
  categories;
  attributes; // 可选属性

  product = new CreateOrUpdateProductInput({
    id: parseInt(this.route.snapshot.params['id'], 10),
    name: '',
    shortDescription: '',
    fullDescription: '',
    sku: undefined,
    thirdPartySku: undefined,
    stockQuantity: undefined,
    notifyQuantityBelow: undefined,
    price: undefined,
    goodCost: undefined,
    weight: undefined,
    length: undefined,
    width: undefined,
    height: undefined,
    categories: [],
    pictures: [],
    attributes: [
      new ProductAttributeDto({
        id: 0,
        values: [],
        name: undefined,
      }),
    ],
    attributeCombinations: [],
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: LocationStrategy,
    private msgSvc: NzMessageService,
    private categorySvc: CategoryServiceProxy,
    private attributeSvc: ProductAttributeServiceProxy,
    private productSvc: ProductServiceProxy,
  ) {
    categorySvc.getCategorySelectList().subscribe(res => {
      const categories = [];
      res.forEach(item => {
        categories.push(
          new ProductCategoryDto({
            id: item.value,
            name: item.text,
          }),
        );
      });
      this.categories = categories;
    });
    this.getAttributes();
  }

  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.id === o2.id : o1 === o2);

  ngOnInit() {
    if (this.product.id) {
      this.productSvc.getProductForEdit(this.product.id).subscribe(res => {
        this.product = res;
      });
    }
  }

  EditorEvent(e) {
    console.log(e);
  }

  getAttributes() {
    this.attributeSvc.getAttributes().subscribe(res => {
      this.attributes = res;
    });
  }

  addAttribute() {
    this.product.attributes.push(
      new ProductAttributeDto({
        id: 0,
        values: [],
        name: undefined,
      }),
    );
  }

  createSku() {
    //创建sku
    // 过滤掉空值
    const attributes = this.product.attributes.filter(item => item.values.length > 0);
    // 创建的属性sku
    const combinations: AttributeCombinationDto[] = [];
    let values = [];
    const inFn = index => {
      for (let i = 0; i < attributes[index].values.length; i++) {
        const item: ProductAttributeDto = new ProductAttributeDto({
          id: attributes[index].id,
          values: [new ProductAttributeValueDto(attributes[index].values[i])],
          name: attributes[index]['name'],
        });
        values[index] = item;
        if (index === attributes.length - 1) {
          combinations.push(
            new AttributeCombinationDto({
              id: 0,
              attributes: deepCopy(values),
              stockQuantity: undefined,
              sku: undefined,
              thirdPartySku: undefined,
              overriddenPrice: undefined,
              overriddenGoodCost: undefined,
            }),
          );
          continue;
        }
        if (i === attributes[index].values.length - 1 && index === attributes.length - 1) {
          return;
        } else {
          inFn(index + 1);
        }
      }
    };
    if (attributes.length > 0) {
      inFn(0);
    }
    this.product.attributeCombinations = combinations;
  }

  attributeChange(e, i) {
    if (e) {
      this.product.attributes[i].values = e;
      this.getAttributes();
    } else {
      this.product.attributes = this.product.attributes.filter(
        attribute => attribute.id !== this.product.attributes[i].id,
      );
    }
    this.createSku();
  }

  getProductImages(files: { url: string; id: number }[]) {
    const pictures = [];
    files.forEach(file => {
      pictures.push(
        new ProductPictureDto({
          id: file.id,
          url: file.url,
        }),
      );
    });
    this.product.pictures = pictures;
  }

  save() {
    if (this.loading) {
      return false;
    }
    this.productSvc.createOrUpdateProduct(this.product).subscribe(res => {
      console.log(res);
    });
  }

  cancel() {
    this.location.back();
  }
}
