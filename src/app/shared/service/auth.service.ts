import { Injectable } from '@angular/core';
import { SessionServiceProxy } from '@shared/service-proxies/service-proxies';
import { AbpMultiTenancyService } from '@abp/multi-tenancy/abp-multi-tenancy.service';
import { SettingService } from '@abp/settings/setting.service';
import { AppConsts } from '@shared/consts/app-consts';

@Injectable()
export class AuthService {
  constructor(
    private settingSvc: SettingService,
    private sessionSvc: SessionServiceProxy,
    private abpMultiTenancySvc: AbpMultiTenancyService,
  ) {}

  GetTouTiaoAuthUrl() {
    const scope = '[100,110,120,130,2,3,4,5]';

    const encodeScope = encodeURIComponent(scope);

    const url = abp.utils.formatString(
      'http://ad.toutiao.com/openapi/audit/oauth.html?app_id={0}&redirect_uri={1}&state=20&scope={2}',
      this.settingSvc.get('Advert.ToutiaoAdsAppId'),
      AppConsts.getAdvertAuthCallBackUrl(),
      encodeScope,
    );

    return url;
  }

  GetTenantAuthUrl() {
    const url = abp.utils.formatString(
      'https://developers.e.qq.com/oauth/authorize?client_id={0}&redirect_uri={1}&state=40&scope=',
      this.settingSvc.get('Advert.TenantAdsAppId'),
      AppConsts.getAdvertAuthCallBackUrl(),
    );

    return url;
  }
}
