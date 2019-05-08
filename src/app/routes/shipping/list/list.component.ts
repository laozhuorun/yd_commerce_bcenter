import {
  Component
} from '@angular/core';

import {FormControl, FormGroup, Validators} from '@angular/forms';
import {
  CommonLookupServiceProxy,
  OrderServiceProxy,
  StateServiceProxy,
  ShipmentServiceProxy,
  FileServiceProxy
} from '@shared/service-proxies/service-proxies';
import {DrawerHelper} from '@delon/theme';

import {NzMessageService, NzModalService} from 'ng-zorro-antd';

import {FileService} from '@core/service/file.service';

let that;

@Component({
  selector: 'app-shipping-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ShippingListComponent {
  data;
  loading = false;

  isAllDisplayDataChecked = false;
  mapOfCheckedId = {};
  numberOfChecked = 0;

  enums = {
    OrderSource: [],
    OrderStatus: [],
    OrderType: [],
    PaymentStatus: [],
    ShippingStatus: []
  };

  constructor(
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private drawer: DrawerHelper,
    private stateSvc: StateServiceProxy,
    private enumsSvc: CommonLookupServiceProxy,
    private orderSvc: OrderServiceProxy,
    private fileSvc: FileService) {
    that = this;
  }

  address;
  searchForm: FormGroup;

  ngOnInit() {
    this.searchForm = new FormGroup({
      productIds: new FormControl([], []),
      storeIds: new FormControl('', []),
      logisticsNumber: new FormControl('', []),
      orderNumber: new FormControl('', []),
      createOn_FormDate: new FormControl('', []),
      createOn_ToDate: new FormControl('', []),
      receiveOn_FormDate: new FormControl('', []),
      receiveOn_ToDate: new FormControl('', []),
      shippingName: new FormControl('', []),
      phoneNumber: new FormControl('', []),
      provinceId: new FormControl('', []),
      cityId: new FormControl('', []),
      districtId: new FormControl('', []),
      orderStatus: new FormControl([], []),
      paymentStatus: new FormControl([], []),
      shippingStatus: new FormControl([], []),
      orderTypes: new FormControl([], []),
      orderSource: new FormControl([], []),
      adminComment: new FormControl('', []),
      customerComment: new FormControl('', []),
      sorting: new FormControl('', []),
      maxResultCount: new FormControl(10, []),
      skipCount: new FormControl(0, [])
    });
    this.getData();
    this.getEnums(['OrderSource', 'OrderStatus', 'OrderType', 'PaymentStatus', 'ShippingStatus']);
  }

  getEnums(enumNames) {
    enumNames.forEach(enumName => {
      this.enumsSvc.getEnumSelectItem(enumName).subscribe(res => {
        res.forEach((item, index) => {
          this.enums[enumName].push({
            index: index,
            text: item.text,
            value: item.value,
            type: 'default',
            checked: false
          });
        });
      });
    });
  }

  filterChange(target, e) {
    this.searchForm.get(target).setValue(e);
    this.getData();
  }

  checkAll(value: boolean): void {
    this.data.items.forEach(item => this.mapOfCheckedId[item.id] = value);
    this.refreshStatus();
  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.data.items.filter(item => !item.disabled).every(item => this.mapOfCheckedId[item.id]);
    this.numberOfChecked = this.data.items.filter(item => this.mapOfCheckedId[item.id]).length;
  }

  getData() {
    this.loading = true;
    this.orderSvc.getOrders(
      this.searchForm.get('logisticsNumber').value,
      this.searchForm.get('receiveOn_FormDate').value,
      this.searchForm.get('receiveOn_ToDate').value,
      this.searchForm.get('orderStatus').value,
      this.searchForm.get('paymentStatus').value,
      this.searchForm.get('shippingStatus').value,
      this.searchForm.get('storeIds').value,
      this.searchForm.get('productIds').value,
      this.searchForm.get('orderNumber').value,
      this.searchForm.get('createOn_FormDate').value,
      this.searchForm.get('createOn_ToDate').value,
      this.searchForm.get('shippingName').value,
      this.searchForm.get('phoneNumber').value,
      this.searchForm.get('provinceId').value,
      this.searchForm.get('cityId').value,
      this.searchForm.get('districtId').value,
      this.searchForm.get('orderTypes').value,
      this.searchForm.get('orderSource').value,
      this.searchForm.get('adminComment').value,
      this.searchForm.get('customerComment').value,
      this.searchForm.get('sorting').value,
      this.searchForm.get('maxResultCount').value,
      this.searchForm.get('skipCount').value).subscribe(res => {
      this.loading = false;
      this.data = res;
    });
  }

  createOn(e) {
    this.searchForm.get('createOn_FormDate').setValue(e[0]);
    this.searchForm.get('createOn_ToDate').setValue(e[1]);
  }

  receiveOn(e) {
    this.searchForm.get('receiveOn_FormDate').setValue(e[0]);
    this.searchForm.get('receiveOn_ToDate').setValue(e[1]);
  }

  pageChange(e) {
    this.searchForm.get('skipCount').setValue(this.searchForm.get('maxResultCount').value * (e - 1));
    this.getData();
  }

  onChanges(values: any): void {
    this.searchForm.get('provinceId').setValue(values[0]);
    this.searchForm.get('cityId').setValue(values[1]);
    this.searchForm.get('districtId').setValue(values[2]);
  }

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

  export(isAll) {
    this.loading = true;
    if (isAll) {
      this.orderSvc.getWaitShippingToExcel(
        this.searchForm.get('sorting').value,
        this.searchForm.get('maxResultCount').value,
        this.searchForm.get('skipCount').value,
        this.searchForm.get('storeIds').value,
        this.searchForm.get('productIds').value,
        this.searchForm.get('orderNumber').value,
        this.searchForm.get('createOn_FormDate').value,
        this.searchForm.get('createOn_ToDate').value,
        this.searchForm.get('shippingName').value,
        this.searchForm.get('phoneNumber').value,
        this.searchForm.get('provinceId').value,
        this.searchForm.get('cityId').value,
        this.searchForm.get('districtId').value,
        this.searchForm.get('orderTypes').value,
        this.searchForm.get('orderSource').value,
        this.searchForm.get('adminComment').value,
        this.searchForm.get('customerComment').value).subscribe(res => {
        this.loading = false;
        this.fileSvc.downloadTempFile(res.fileName, res.fileType, res.fileToken);
      });
    } else {
      const ids = [];
      for (const id in this.mapOfCheckedId) {
        if (this.mapOfCheckedId[id]) {
          ids.push(id);
        }
      }
      if (ids.length > 0) {
        this.orderSvc.getSelectedToExcel(ids).subscribe(res => {
          this.loading = false;
          this.fileSvc.downloadTempFile(res.fileName, res.fileType, res.fileToken);
        });
      }else {
        this.loading = false;
      }
    }
  }

  arrayToString(arr) {
    let str = '';
    arr.forEach(item => {
      if (str) {
        str = str + item;
      } else {
        str = ',' + item;
      }
    });
    return str;
  }

  remove() {
  }

  clearCheck() {
  }

  search() {
    this.getData();
  }

  reset() {
    // this.q.orderNumber = undefined;
  }
}
