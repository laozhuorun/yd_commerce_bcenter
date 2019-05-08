import { Component } from '@angular/core';

import { OrderServiceProxy, ProductServiceProxy, AdvertAccountServiceProxy } from '@shared/service/service-proxies';
import { _HttpClient, DrawerHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-advert-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class AdvertListComponent {
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
    private accountSvc: AdvertAccountServiceProxy,
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
    advertChannels: undefined,
    thirdpartyId: undefined,
    userName: undefined,
    displayName: undefined,
    productId: undefined,
    sorting: undefined,
    maxResultCount: 10,
    skipCount: 0,
  };

  getData() {
    this.loading = true;
    this.accountSvc
      .getAccounts(
        this.q.advertChannels,
        this.q.thirdpartyId,
        this.q.userName,
        this.q.displayName,
        this.q.productId,
        this.q.sorting,
        this.q.maxResultCount,
        this.q.skipCount,
      )
      .subscribe(res => {
        this.loading = false;
        this.data = res;
      });
  }

  pageChange(e) {
    this.q.skipCount = this.q.maxResultCount * (e - 1);
    this.getData();
  }

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

  getUrl(data) {
    let url = '';
    if (data.channel === 20) {
      url = `http://ad.toutiao.com/openapi/audit/oauth.html?app_id=${
        abp.setting.values['Advert.ToutiaoAdsAppId']
      }&redirect_uri=${encodeURIComponent(location.href)}&state=${data.id}&scope={scope.UrlEncode()}`;
    } else {
      url = `https://developers.e.qq.com/oauth/authorize?client_id=${
        abp.setting.values['Advert.TenantAdsAppId']
      }&redirect_uri=${encodeURIComponent(location.href)}&state=${data.id}&scope=`;
    }
    return url;
  }

  cancel() {}

  search() {
    this.getData();
  }

  reset() {
    this.q.displayName = undefined;
  }
}
