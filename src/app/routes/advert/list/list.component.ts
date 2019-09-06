import { Component, Injector, OnInit, TemplateRef, AfterViewInit } from '@angular/core';

import {
  OrderServiceProxy,
  ProductServiceProxy,
  AdvertAccountServiceProxy,
  AuthCallBackInput,
  AuthCallBackInputChannel,
  CommonLookupServiceProxy,
  SelectListItemDtoOfInt32,
} from '@shared/service-proxies/service-proxies';
import { _HttpClient, DrawerHelper, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ListComponentBase } from '@shared/app-component-base';
import { AdvertChannel, EnumConsts } from '@shared/consts/enum-consts';
import { SourcePictureHelper } from '@shared/consts/static-source';
import { AuthService } from '@shared/service/auth.service';
import { AppConsts } from '@shared/consts/app-consts';
import { ActivatedRoute } from '@angular/router';
import { concatMap, finalize } from 'rxjs/operators';
import { AdvertEditComponent } from '../edit/edit.component';
import { CacheService } from '@delon/cache';

@Component({
  selector: 'app-advert-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less'],
})
export class AdvertListComponent extends ListComponentBase implements OnInit, AfterViewInit {
  data;
  loading = false;

  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  mapOfCheckedId = {};
  numberOfChecked = 0;

  authCallBack: AuthCallBackInput = new AuthCallBackInput();
  advertChannels;

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

  constructor(
    injector: Injector,
    private route: ActivatedRoute,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private productSvc: ProductServiceProxy,
    private accountSvc: AdvertAccountServiceProxy,
    private authService: AuthService,
    private modalHelper: ModalHelper,
    private cacheSvc: CacheService,
    private enumsSvc: CommonLookupServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.authCallBack.code = this.route.snapshot.queryParams.auth_code;

    if (this.route.snapshot.queryParams.state !== undefined && this.route.snapshot.queryParams.state)
      this.authCallBack.channel = parseInt(this.route.snapshot.queryParams.state, 10);

    this.getData();
    this.getSelectDataSource();
  }

  ngAfterViewInit() {
    if (this.authCallBack.code !== undefined) {
      // this.msg
      //   .loading('授权中，请稍后', { nzDuration: 2500 })
      //   .onClose!.pipe(concatMap(() => this.msg.success('授权成功，请补充信息', { nzDuration: 2500 }).onClose!))
      //   .subscribe(() => {});

      const id = this.msg.loading('授权中，请稍后..', { nzDuration: 0 }).messageId;
      this.accountSvc
        .authCallBack(this.authCallBack)
        .pipe(finalize(() => {}))
        .subscribe(result => {
          this.msg.remove(id);

          this.modalHelper.create(AdvertEditComponent, { account: result }).subscribe(res => {});
        });
    }
  }

  getSelectDataSource() {
    this.cacheSvc
      .tryGet<SelectListItemDtoOfInt32[]>(
        EnumConsts.AdvertChannel,
        this.enumsSvc.getEnumSelectItem(EnumConsts.AdvertChannel),
      )
      .subscribe(res => {
        this.advertChannels = res;
      });
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
    this.q.advertChannels = undefined;
    this.q.thirdpartyId = undefined;
    this.q.userName = undefined;
    this.q.displayName = undefined;
    this.q.productId = undefined;
  }

  openAdverChannelModal(tpl: TemplateRef<{}>) {
    this.modalSrv.create({
      nzTitle: '广告账户授权',
      nzContent: tpl,
      nzCancelText: null,
      nzOkText: null,
    });
  }

  redirect2Auth(channel) {
    if (channel === Number(AdvertChannel.Toutiao)) {
      window.location.href = this.authService.GetTouTiaoAuthUrl();
    } else if (channel === Number(AdvertChannel.Tenant)) {
    }
  }

  getChannelImg(channel) {
    if (channel === Number(AdvertChannel.Toutiao)) return SourcePictureHelper.Oceanengine_WithName;
    else return SourcePictureHelper.Tenant_WithName;
  }

  syncSubAccount() {}
}
