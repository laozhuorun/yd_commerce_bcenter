import * as moment from 'moment';
import {AppConsts} from '@shared/AppConsts';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {Type, CompilerOptions, NgModuleRef, Inject} from '@angular/core';
import * as _ from 'lodash';
import {DA_SERVICE_TOKEN, ITokenService} from '@delon/auth';

export class AppPreBootstrap {
  constructor(@Inject(DA_SERVICE_TOKEN) private tokenSvc: ITokenService) {
  }

  static run(callback: () => void): void {
    AppPreBootstrap.getApplicationConfig(() => {
      AppPreBootstrap.getUserConfiguration(callback);
    });
  }

  static bootstrap<TM>(
    moduleType: Type<TM>,
    compilerOptions?: CompilerOptions | CompilerOptions[]
  ): Promise<NgModuleRef<TM>> {
    return platformBrowserDynamic().bootstrapModule(
      moduleType,
      compilerOptions
    );
  }

  private static getApplicationConfig(callback: () => void) {
    return abp
      .ajax({
        url: '/assets/appconfig.json',
        method: 'GET',
        headers: {
          'Abp.TenantId': abp.multiTenancy.getTenantIdCookie()
        }
      })
      .done(result => {
        AppConsts.appBaseUrl = result.appBaseUrl;
        AppConsts.remoteServiceBaseUrl = result.remoteServiceBaseUrl;

        callback();
      });
  }

  private static getCurrentClockProvider(
    currentProviderName: string
  ): abp.timing.IClockProvider {
    if (currentProviderName === 'unspecifiedClockProvider') {
      return abp.timing.unspecifiedClockProvider;
    }

    if (currentProviderName === 'utcClockProvider') {
      return abp.timing.utcClockProvider;
    }

    return abp.timing.localClockProvider;
  }

  private static getUserConfiguration(
    callback: () => void
  ): Promise<any> {
    return abp
      .ajax({
        url: AppConsts.remoteServiceBaseUrl + '/UserConfiguration/GetAll?sourceName=BusinessCenter',
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + abp.auth.getToken(),
          '.AspNetCore.Culture': abp.utils.getCookieValue(
            'Abp.Localization.CultureName'
          ),
          'Abp.TenantId': abp.multiTenancy.getTenantIdCookie()
        }
      })
      .done(result => {
        _.merge(abp, result);

        abp.clock.provider = this.getCurrentClockProvider(result.clock.provider.toString());

        moment.locale(abp.localization.currentLanguage.name);
        (window as any).moment.locale(abp.localization.currentLanguage.name);

        if (abp.clock.provider.supportsMultipleTimezone) {
          /*console.log(moment);
          moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId);
          (window as any).moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId);*/
        }

        abp.event.trigger('abp.dynamicScriptsInitialized');

        AppConsts.recaptchaSiteKey = abp.setting.get('Recaptcha.SiteKey');
        AppConsts.subscriptionExpireNootifyDayCount = parseInt(abp.setting.get('App.TenantManagement.SubscriptionExpireNotifyDayCount'));

        callback();
      });
  }
}
