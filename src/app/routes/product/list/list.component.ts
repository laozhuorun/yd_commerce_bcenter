import { Component, OnInit, Injector } from '@angular/core';

import { OrderServiceProxy, ProductServiceProxy } from '@shared/service-proxies/service-proxies';
import { _HttpClient, DrawerHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ListComponentBase } from '@shared/app-component-base';
import { FormGroup } from '@angular/forms';
import { MediaCompressFormat, AppConsts } from '@shared/consts/app-consts';

@Component({
  selector: 'app-product-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less'],
})
export class ProductListComponent extends ListComponentBase implements OnInit {
  data;
  loading = false;

  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  mapOfCheckedId = [];
  numberOfChecked = 0;
  expandForm = false;

  searchForm = {
    name: '',
    sku: '',
  };

  constructor(
    injector: Injector,
    private http: _HttpClient,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private drawer: DrawerHelper,
    private orderSvc: OrderServiceProxy,
    private productSvc: ProductServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.getData();
  }

  filterChange(target, e) {
    this.q[target] = e;
    console.log(this.q[target]);
    this.getData();
  }

  checkAll(value: boolean): void {
    this.data.items.forEach(item => (this.mapOfCheckedId[item.id] = value));
    console.log(this.mapOfCheckedId);
    this.refreshStatus();
  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.data.items
      .filter(item => !item.disabled)
      .every(item => this.mapOfCheckedId[item.id]);
    this.isIndeterminate =
      this.data.items.filter(item => !item.disabled).some(item => this.mapOfCheckedId[item.id]) &&
      !this.isAllDisplayDataChecked;
    this.numberOfChecked = this.data.items.filter(item => this.mapOfCheckedId[item.id]).length;
  }

  q = {
    name: undefined,
    sku: undefined,
    sorting: undefined,
    maxResultCount: 10,
    skipCount: 0,
  };

  getData() {
    this.productSvc
      .getProducts(this.searchForm.name, this.searchForm.sku, '', this.q.maxResultCount, this.q.skipCount)
      .subscribe(res => {
        this.loading = false;
        this.data = res;
      });
  }

  pageChange(e) {
    this.q.skipCount = this.q.maxResultCount * (e - 1);
    this.getData();
  }

  /*view(i: any) {
    this.drawer
      .create(`查看订单 #${i.orderNumber}`, OrderListViewComponent, {i}, {size: 666})
      .subscribe();
  }*/

  remove(ids) {
    let _ids = [];
    if (ids.length) {
      _ids = ids;
    } else {
      for (const id in ids) {
        if (ids[id]) {
          _ids.push(parseInt(id, 10));
        }
      }
    }
    this.productSvc.deleteProduct(_ids).subscribe(res => {
      this.getData();
    });
  }

  cancel() {}

  search() {
    this.getData();
  }

  reset() {
    this.q.name = undefined;
  }

  getPictureCompressUrl(url: string): string {
    if (url) return url + MediaCompressFormat.productListFormat;
    return AppConsts.defaultPicture + MediaCompressFormat.orderListFormat;
  }
}
