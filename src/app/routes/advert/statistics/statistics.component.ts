import { Component } from '@angular/core';

import { OrderServiceProxy, ProductServiceProxy } from '@shared/service-proxies/service-proxies';
import { _HttpClient, DrawerHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-advert-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class AdvertStatisticsComponent {
  data;
  loading = false;

  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  mapOfCheckedId = {};
  numberOfChecked = 0;

  constructor(
    private http: _HttpClient,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private drawer: DrawerHelper,
    private orderSvc: OrderServiceProxy,
    private productSvc: ProductServiceProxy,
  ) {}

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
    this.productSvc.getProducts('', '', '', this.q.maxResultCount, this.q.skipCount).subscribe(res => {
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
}
