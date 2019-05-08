import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import {
  CreateOrUpdateAttributeInput,
  CreateOrUpdateAttributeValueInput,
  ProductAttributeServiceProxy,
  ProductAttributeDto,
  ProductAttributeValueDto,
} from '@shared/service/service-proxies';

const isAttrsExist = (name, attrs) => {
  let res = false;
  if (attrs) {
    attrs.forEach(attr => {
      if (attr.name === name) {
        res = true;
      }
    });
  }
  return res;
};

@Component({
  selector: 'app-goods-sku-attr',
  templateUrl: './attr.component.html',
  styleUrls: ['./attr.component.scss'],
})
export class GoodsSkuAttrComponent implements OnInit {
  @Input() index = 0;
  @Input() attributes = [];
  @Output() attributeChange = new EventEmitter();
  @Input() attribute: ProductAttributeDto = new ProductAttributeDto({
    id: 0,
    name: '',
    values: [
      new ProductAttributeValueDto({
        id: 0,
        name: '',
        pictureId: 0,
        pictureUrl: '',
      }),
    ],
  });
  attributeValues;
  showPicture = false;

  constructor(private attributeSvc: ProductAttributeServiceProxy) {}

  ngOnInit() {
    if (this.attribute.id) {
      this.getValues();
    }
    if (this.attribute.values[0] && this.attribute.values[0].pictureUrl) {
      this.showPicture = true;
    }
  }

  onChange(item) {
    this.attribute.id = item.nzValue;
    this.attribute.name = item.nzLabel;
    this.attribute.values = [
      new ProductAttributeValueDto({
        id: 0,
        pictureId: 0,
        name: '',
        pictureUrl: '',
      }),
    ];
    this.getValues();
  }

  getValues() {
    this.attributeSvc.getAttributeValues(this.attribute.id).subscribe(res => {
      this.attributeValues = res;
    });
  }

  valueChange(e, i) {
    this.getValues();
    if (e) {
      this.attribute.values[i].id = e.id;
      this.attribute.values[i].name = e.name;
      this.attribute.values[i].pictureUrl = e.pictureUrl;
    } else {
      this.attribute.values = this.attribute.values.filter(value => value.id !== this.attribute.values[i].id);
    }
    this.attributeChange.emit(this.attribute.values);
  }

  addValue() {
    this.attribute.values.push(
      new ProductAttributeValueDto({
        id: 0,
        pictureId: 0,
        name: '',
        pictureUrl: '',
      }),
    );
  }

  editAttribute(name) {
    if (!name) {
      return false;
    }
    this.attribute.id = 0;
    this.attribute.name = name;
    /*this.attributeSvc.createOrUpdateAttribute(this.attribute).subscribe(res => {
      this.attribute.id = res.id;
      this.attributeChange.emit({
        id: this.attribute.id,
        displayOrder: 0,
        name: this.attribute.name,
        values: (() => {
          const attributeValues = [];
          this.attribute.values.map((item) => {
            attributeValues.push({
              pictureId: 0,
              displayOrder: 0,
              id: item.id,
              name: item.name,
              pictureUrl: item.pictureUrl
            });
          });
          return attributeValues;
        })(),
      });
    });*/
  }

  del() {
    this.attributeChange.emit(null);
  }

  onBlur(target) {
    if (!target.value) {
      return false;
    }
    if (isAttrsExist(target.value, this.attributes)) {
      return false;
    }
    this.editAttribute(target.value);
  }
}
