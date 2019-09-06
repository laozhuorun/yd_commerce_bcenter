import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd';
import {
  CreateOrUpdateStoreInput,
  StoreServiceProxy,
  AdvertAccountServiceProxy,
  ProductServiceProxy,
  CreateOrUpdateAdvertAccountInput,
  CommonLookupServiceProxy,
  SelectListItemDtoOfInt32,
} from '@shared/service-proxies/service-proxies';
import { AuthService } from '@shared/service/auth.service';
import { AdvertChannel, EnumConsts } from '@shared/consts/enum-consts';
import { CacheService } from '@delon/cache';
import { SourcePictureHelper } from '@shared/consts/static-source';

@Component({
  selector: 'app-advert-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less'],
})
export class AdvertEditComponent implements OnInit, AfterViewInit, OnDestroy {
  account: CreateOrUpdateAdvertAccountInput = new CreateOrUpdateAdvertAccountInput({
    id: parseInt(this.route.snapshot.params['id'], 10),
    thirdpartyId: undefined,
    storeId: 0,
    username: undefined,
    productId: undefined,
    displayName: undefined,
    channel: undefined,
    type: 1,
    dataAutoSync: true,
    balance: 0,
    isAuthed: false,
    parentAccountId: 0,
    rebates: 0,
  });
  products;
  stores;
  loading = false;

  enums = {
    AdvertChannel: [],
    AdvertAccountType: [],
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: LocationStrategy,
    private msgSvc: NzMessageService,
    private productSvc: ProductServiceProxy,
    private storeSvc: StoreServiceProxy,
    private accountSvc: AdvertAccountServiceProxy,
    private authService: AuthService,
    private enumsSvc: CommonLookupServiceProxy,
    private cacheSvc: CacheService,
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

  ngAfterViewInit() {
    this.getEnums([EnumConsts.AdvertChannel, EnumConsts.AdvertAccountType]);
  }

  getEnums(enumNames) {
    enumNames.forEach(enumName => {
      this.cacheSvc
        .tryGet<SelectListItemDtoOfInt32[]>(enumName, this.enumsSvc.getEnumSelectItem(enumName))
        .subscribe(res => {
          res.forEach((item, index) => {
            this.enums[enumName].push({
              index: index,
              text: item.text,
              value: item.value,
              type: 'default',
              checked: false,
            });
          });
        });
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
      this.router.navigate(['/advert/list']);
    });
  }

  cancel() {
    this.location.back();
  }

  ngOnDestroy(): void {}

  getChannelPicture(orderSource: number): string {
    return SourcePictureHelper.getAdvertChannelPicture(orderSource);
  }

  redirect2Auth() {
    if (this.account.channel === Number(AdvertChannel.Toutiao)) {
      window.location.href = this.authService.GetTouTiaoAuthUrl();
    } else if (this.account.channel === Number(AdvertChannel.Tenant)) {
      window.location.href = this.authService.GetTenantAuthUrl();
    }
  }
}
