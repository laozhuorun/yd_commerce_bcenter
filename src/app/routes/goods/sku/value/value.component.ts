import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import {
  CreateOrUpdateAttributeInput,
  CreateOrUpdateAttributeValueInput,
  ProductAttributeValueDto,
  ProductAttributeServiceProxy,
} from '@shared/service-proxies/service-proxies';

const isAttrsExist = (name, attrs) => {
  if (attrs.length < 1) {
    return false;
  }
  let res = false;
  attrs.forEach(attr => {
    if (attr.name === name) {
      res = true;
    }
  });
  return res;
};

@Component({
  selector: 'app-goods-sku-attr-value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.scss'],
})
export class GoodsSkuAttrValueComponent implements OnInit {
  @Input() attributeId = 0;
  @Input() selectedValues = [];
  @Input() attributeValues;
  @Input() showPicture = false;
  @Input() value: ProductAttributeValueDto = new ProductAttributeValueDto({
    id: 0,
    name: '',
    pictureId: 0,
    pictureUrl: '',
  });
  @Output() valueChange = new EventEmitter();

  constructor(private attributeSvc: ProductAttributeServiceProxy) {}

  ngOnInit() {}

  onChange(e) {
    this.value = Object.assign(this.value, {
      id: e.nzValue,
      name: e.nzLabel,
    });
    this.valueChange.emit(this.value);
  }

  editValue(name) {
    this.value = Object.assign(this.value, {
      id: 0,
      name: name,
    });
    const value = new CreateOrUpdateAttributeValueInput({
      id: this.value.id,
      attributeId: this.attributeId,
      displayOrder: 0,
      name: this.value.name,
    });
    this.attributeSvc.createOrUpdateAttributeValue(value).subscribe(res => {
      this.value.id = res.id;
      this.valueChange.emit(this.value);
    });
  }

  del() {
    this.valueChange.emit(null);
  }

  isDisabled(value) {
    // 判断该值是否可选
    let result = false;
    this.selectedValues.forEach(item => {
      if (item.id === value.id) {
        result = true;
      }
    });
    return result;
  }

  avatarObj(e) {
    this.value = Object.assign(this.value, {
      pictureId: e.id,
      pictureUrl: e.url,
    });
    this.valueChange.emit(this.value);
  }

  onBlur(target) {
    if (!target.value) {
      return false;
    }
    if (isAttrsExist(target.value, this.attributeValues)) {
      return false;
    }
    this.editValue(target.value);
  }
}
