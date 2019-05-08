import {
  Component,
  OnInit
} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

import {ActivatedRoute} from '@angular/router';

import {
  OrderServiceProxy,
  ProductServiceProxy,
  ProductListDto,
  StateServiceProxy,
  StoreServiceProxy,
  CommonLookupServiceProxy
} from '@shared/service-proxies/service-proxies';

import {getIndex} from '@shared/utils/utils';
import {CNCurrencyPipe} from '@delon/theme';

let that;

@Component({
  selector: 'app-shipment-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class ShipmentEditComponent implements OnInit {
  id = this.route.snapshot.params['id'];

  orderForm: FormGroup;

  productSelectShow = false;
  products: ProductListDto[];
  product;
  attributes;
  _attributes;

  orderItemForm: FormGroup;
  orderItemIndex = 0;

  address;
  stores: any[] = [];

  enums = {};

  constructor(private route: ActivatedRoute,
              private productSvc: ProductServiceProxy,
              private orderSvc: OrderServiceProxy,
              private stateSvc: StateServiceProxy,
              private storeSvc: StoreServiceProxy,
              private enumsSvc: CommonLookupServiceProxy,
              private currency: CNCurrencyPipe) {
    that = this;
  }

  ngOnInit() {
    this.orderForm = new FormGroup({
      orderId: new FormControl(null, []),
      trackingNumber: new FormControl(null, []),
      logisticsId: new FormControl(10, []),
      status: new FormControl(10, []),
      adminComment: new FormControl(0, []),
      totalWeight: new FormControl(2, []),
      totalVolume: new FormControl(10, []),
      items: new FormControl([{
        productName: null,
        attributeInfo: null,
        orderItemId: 1,
        quantity: null,
        id: 0
      }], [Validators.required]),
      id: new FormControl(0, [])
    });
    this.orderItemForm = new FormGroup({
      productName: new FormControl(null, []),
      attributeInfo: new FormControl(null, []),
      orderItemId: new FormControl(1, []),
      quantity: new FormControl(null, []),
      id: new FormControl(0, [])
    });
    this.orderItemForm.get('productId').valueChanges.subscribe(productId => {
      if (productId) {
        this.productSvc.getProductAttributeMapping(productId).subscribe(res => {
          this.attributes = res.attributes;
          if (this.orderItemForm.get('id').value === 0) {
            this._attributes = [];
            res.attributes.forEach((attribute, index) => {
              const item = {
                id: attribute.id,
                name: attribute.name,
                values: [attribute.values[0]]
              };
              this._attributes.push(item);
            });
          } else {
            this._attributes = this.orderItemForm.get('attributes').value;
          }
        });
      }
      this.orderItemForm.get('id');
    });
    if (this.id !== '0') {
      this.orderSvc.getOrderForEdit(this.id).subscribe(res => {
        for (const key in res) {
          if (this.orderForm.get(key)) {
            this.orderForm.get(key).setValue(res[key]);
          }
        }
        this.address = [res.shippingProvinceId, res.shippingCityId, res.shippingDistrictId];
      });
    }
    this.productSvc.getProducts('', '', '', 1000, 0).subscribe(res => {
      this.products = res.items;
    });
    this.storeSvc.getStoreSelectList().subscribe(res => {
      this.stores = res;
    });

    this.getEnums(['OrderSource', 'OrderStatus', 'OrderType', 'PaymentStatus', 'ShippingStatus']);
  }

  getEnums(enumNames) {
    enumNames.forEach(enumName => {
      this.enumsSvc.getEnumSelectItem(enumName).subscribe(res => {
        res.forEach(item => {
          item.value = item.value;
        });
        this.enums[enumName] = res;
      });
    });
  }


  addProduct(e) {
    if (e) {
      e.preventDefault();
    }
    const items = this.orderForm.get('items').value;
    items.push({
      orderItemNumber: null,
      productId: null,
      quantity: 1,
      unitPrice: null,
      price: null,
      discountAmount: null,
      attributes: null,
      id: 0
    });
    this.orderForm.get('items').setValue(items);
  }

  removeProduct(e, index) {
    if (e) {
      e.preventDefault();
    }
    const items = this.orderForm.get('items').value;
    items.splice(index, 1);
    this.orderForm.get('items').setValue(items);
  }

  getLabel(attributes) {
    let label = '';
    if (attributes) {
      attributes.forEach((attribute, index) => {
        label = label + attribute.name + ':' + attribute.values[0].name + (attributes.length - 1 !== index ? label = label + ', ' : '');
      });
    }
    return label;
  }

  compareFn = (o1: any, o2: any) => o1 && o2 ? o1.id === o2.id : o1 === o2;

  getSelectedProduct(item) {
    if (item && item.attributes && item.attributes.length > 0) {
      const index = getIndex(this.products, 'id', item.productId);
      return '(' + this.products[index].name + ',' + this.getLabel(item.attributes) + ') x' + item.quantity + ' | ' + this.currency.transform(item.price);
    } else {
      return '';
    }
  }

  showProductSelect(i) {
    this.productSelectShow = true;
    this.orderItemIndex = i;
    this.orderItemForm.setValue(this.orderForm.get('items').value[i]);
  }

  handleOk(): void {
    this.orderItemForm.get('attributes').setValue(this._attributes);
    this.productSelectShow = false;
    const items = this.orderForm.get('items').value;
    items[this.orderItemIndex] = this.orderItemForm.value;
    this.orderForm.get('items').setValue(items);
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.productSelectShow = false;
  }

  /** ngModel value */

  onChanges(values: any): void {
    this.orderForm.get('shippingProvinceId').setValue(values[0]);
    this.orderForm.get('shippingCityId').setValue(values[1]);
    this.orderForm.get('shippingDistrictId').setValue(values[2]);
  }

  attributeChanges() {
    console.log(this._attributes);
    this.orderItemForm.get('attributes').setValue(this._attributes);
  }

  /** load data async execute by `nzLoadData` method */
  loadData(node: any, index: number) {
    return new Promise((resolve) => {
      if (index < 0) { // if index less than 0 it is root node
        that.stateSvc.getProvinceSelectList().subscribe(res => {
          node.children = res;
          resolve();
        });
      } else if (index === 0) {
        that.stateSvc.getCitySelectList(node.value).subscribe(res => {
          node.children = res;
          resolve();
        });
      } else {
        that.stateSvc.getDistrictSelectList(node.value).subscribe(res => {
          const list = [];
          res.forEach(item => {
            item['isLeaf'] = true;
            list.push(item);
          });
          node.children = list;
          resolve();
        });
      }
    });
  }

  submit() {
    console.log(this.orderForm.value);
    this.orderSvc.createOrUpdateOrder(this.orderForm.value).subscribe(res => {
      console.log(res);
    });
  }

  cancel() {
  }
}
