import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd';
import {
  CreateOrUpdateStoreInput,
  StoreServiceProxy,
  AdvertAccountServiceProxy,
  ProductServiceProxy,
  CreateOrUpdateAdvertAccountInput,
} from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-advert-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less'],
})
export class AdvertEditComponent implements OnInit, OnDestroy {
  account: CreateOrUpdateAdvertAccountInput = new CreateOrUpdateAdvertAccountInput({
    id: parseInt(this.route.snapshot.params['id'], 10),
    thirdpartyId: undefined,
    storeId: 0,
    username: undefined,
    productId: undefined,
    displayName: undefined,
    channel: undefined,
    dataAutoSync: true,
    balance: 0,
    isAuthed: false,
  });
  products;
  stores;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: LocationStrategy,
    private msgSvc: NzMessageService,
    private productSvc: ProductServiceProxy,
    private storeSvc: StoreServiceProxy,
    private accountSvc: AdvertAccountServiceProxy,
  ) {}

  ngOnInit() {
    if (this.account.id) {
      this.accountSvc.getAccountForEdit(this.account.id).subscribe(res => {
        for (const key in res) {
          if (this.account[key] !== res[key]) {
            this.account[key] = res[key];
          }
        }
      });
    }
    this.storeSvc.getStoreSelectList().subscribe(res => {
      this.stores = res;
    });
    this.productSvc.getProductSelectList().subscribe(res => {
      this.products = res;
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

  authChange(e) {
    if (e) {
      window.location.href = this.getUrl(this.account);
    }
  }

  update(f) {
    if (this.loading || f.invalid) {
      return false;
    }
    this.accountSvc.createOrUpdateAccount(this.account).subscribe(res => {
      this.msgSvc.success('更新成功!');
    });
  }

  cancel() {
    this.location.back();
  }

  ngOnDestroy(): void {}
}
