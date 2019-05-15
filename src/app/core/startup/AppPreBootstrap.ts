import * as moment from 'moment';
import { AppConsts } from '@shared/AppConsts';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Type, CompilerOptions, NgModuleRef, Inject } from '@angular/core';
import * as _ from 'lodash';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { environment } from '@env/environment';
import { XmlHttpRequestHelper } from '@shared/helpers/XmlHttpRequestHelper';
import { SubdomainTenancyNameFinder } from '@shared/helpers/SubdomainTenancyNameFinder';

export class AppPreBootstrap {
  constructor(@Inject(DA_SERVICE_TOKEN) private tokenSvc: ITokenService) {}

  static run(appRootUrl: string, callback: () => void): void {
    AppPreBootstrap.getApplicationConfig(appRootUrl, () => {
      AppPreBootstrap.getUserConfiguration(callback);
    });
  }

  static bootstrap<TM>(
    moduleType: Type<TM>,
    compilerOptions?: CompilerOptions | CompilerOptions[],
  ): Promise<NgModuleRef<TM>> {
    return platformBrowserDynamic().bootstrapModule(moduleType, compilerOptions);
  }

  // private static getApplicationConfig(callback: () => void) {
  //   return abp
  //     .ajax({
  //       url: '/assets/appconfig.json',
  //       method: 'GET',
  //       headers: {
  //         'Abp.TenantId': abp.multiTenancy.getTenantIdCookie()
  //       }
  //     })
  //     .done(result => {
  //       AppConsts.appBaseUrl = result.appBaseUrl;
  //       AppConsts.remoteServiceBaseUrl = result.remoteServiceBaseUrl;

  //       callback();
  //     });
  // }

  private static getApplicationConfig(appRootUrl: string, callback: () => void) {
    let type = 'GET';
    let url = appRootUrl + 'assets/' + environment.appConfig;
    let customHeaders = [
      {
        name: 'Abp.TenantId',
        value: abp.multiTenancy.getTenantIdCookie() + '',
      },
    ];

    XmlHttpRequestHelper.ajax(type, url, customHeaders, null, result => {
      const subdomainTenancyNameFinder = new SubdomainTenancyNameFinder();
      const tenancyName = subdomainTenancyNameFinder.getCurrentTenancyNameOrNull(result.appBaseUrl);

      AppConsts.appBaseUrlFormat = result.appBaseUrl;
      AppConsts.remoteServiceBaseUrlFormat = result.remoteServiceBaseUrl;
      AppConsts.localeMappings = result.localeMappings;

      if (tenancyName == null) {
        AppConsts.appBaseUrl = result.appBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl + '.', '');
        AppConsts.remoteServiceBaseUrl = result.remoteServiceBaseUrl.replace(
          AppConsts.tenancyNamePlaceHolderInUrl + '.',
          '',
        );
      } else {
        AppConsts.appBaseUrl = result.appBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl, tenancyName);
        AppConsts.remoteServiceBaseUrl = result.remoteServiceBaseUrl.replace(
          AppConsts.tenancyNamePlaceHolderInUrl,
          tenancyName,
        );
      }

      callback();
    });
  }

  private static getCurrentClockProvider(currentProviderName: string): abp.timing.IClockProvider {
    if (currentProviderName === 'unspecifiedClockProvider') {
      return abp.timing.unspecifiedClockProvider;
    }

    if (currentProviderName === 'utcClockProvider') {
      return abp.timing.utcClockProvider;
    }

    return abp.timing.localClockProvider;
  }

  private static getUserConfiguration(callback: () => void): any {
    const token = abp.auth.getToken();

    let requestHeaders = {
      'Abp.TenantId': abp.multiTenancy.getTenantIdCookie(),
    };

    if (token) {
      requestHeaders['Authorization'] = 'Bearer ' + token;
    }

    return XmlHttpRequestHelper.ajax(
      'GET',
      AppConsts.remoteServiceBaseUrl + '/UserConfiguration/GetAll?sourceName=BusinessCenter',
      requestHeaders,
      null,
      response => {
        let result = response.result;

        _.merge(abp, result);

        abp.event.trigger('abp.dynamicScriptsInitialized');

        AppConsts.recaptchaSiteKey = abp.setting.get('Recaptcha.SiteKey');
        AppConsts.subscriptionExpireNootifyDayCount = parseInt(
          abp.setting.get('App.TenantManagement.SubscriptionExpireNotifyDayCount'),
        );

        callback();
      },
    );
  }
}
