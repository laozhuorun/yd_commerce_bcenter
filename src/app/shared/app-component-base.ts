import { PermissionCheckerService } from '@abp/auth/permission-checker.service';
import { FeatureCheckerService } from '@abp/features/feature-checker.service';
import { LocalizationService } from '@abp/localization/localization.service';
import { AbpMultiTenancyService } from '@abp/multi-tenancy/abp-multi-tenancy.service';
import { SettingService } from '@abp/settings/setting.service';
import { Injector, ChangeDetectorRef, Inject } from '@angular/core';
import { AppConsts } from '@shared/consts/app-consts';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { PaginationBaseDto } from './utils/pagination.dto';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { I18NService } from '@core/i18n/i18n.service';

export abstract class AppComponentBase {
  localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;

  localization: LocalizationService;
  permission: PermissionCheckerService;
  feature: FeatureCheckerService;
  setting: SettingService;
  // message: MessageService;
  multiTenancy: AbpMultiTenancyService;
  notify: NzNotificationService;
  msg: NzMessageService;
  cdr: ChangeDetectorRef;
  i18n: I18NService;

  constructor(injector: Injector) {
    this.localization = injector.get(LocalizationService);
    this.permission = injector.get(PermissionCheckerService);
    this.feature = injector.get(FeatureCheckerService);
    this.notify = injector.get(NzNotificationService);
    this.setting = injector.get(SettingService);
    // this.message = injector.get(MessageService);
    this.msg = injector.get(NzMessageService);
    this.multiTenancy = injector.get(AbpMultiTenancyService);
    this.cdr = injector.get(ChangeDetectorRef);
    this.i18n = injector.get<I18NService>(ALAIN_I18N_TOKEN);
  }

  l(key: string, ...args: any[]): string {
    return this.i18n.fanyi(key);
    // args.unshift(key);
    // args.unshift(this.localizationSourceName);
    // return this.ls.apply(this, args);
  }

  ls(sourcename: string, key: string, ...args: any[]): string {
    let localizedText = this.localization.localize(key, sourcename);

    if (!localizedText) {
      localizedText = key;
    }

    if (!args || !args.length) {
      return localizedText;
    }

    args.unshift(localizedText);
    return abp.utils.formatString.apply(this, args);
  }

  isGranted(permissionName: string): boolean {
    return this.permission.isGranted(permissionName);
  }

  isGrantedAny(...permissions: string[]): boolean {
    if (!permissions) {
      return false;
    }

    for (const permission of permissions) {
      if (this.isGranted(permission)) {
        return true;
      }
    }

    return false;
  }

  s(key: string): string {
    return abp.setting.get(key);
  }

  // t(dateTime: Date, format: string = 'YYYY-MM-DD HH:mm'): string {
  //   if (dateTime === undefined) {
  //     return '';
  //   }

  //   abp.clock.provider.normalize();

  //   const localDatetimeString = dateTime.local().format(format);
  //   return localDatetimeString;
  // }

  // d(momentTime: Moment, format: string = 'YYYY-MM-DD'): string {
  //   if (momentTime === undefined) {
  //     return '';
  //   }

  //   const localDatetimeString = momentTime.local().format(format);
  //   return localDatetimeString;
  // }

  toHTML(input): any {
    return new DOMParser().parseFromString(input, 'text/html').documentElement.textContent;
  }

  cdRefresh() {
    // wait checkbox
    setTimeout(() => this.cdr.detectChanges());
  }
}

export abstract class FormComponentBase extends AppComponentBase {
  constructor(injector: Injector) {
    super(injector);
  }

  loading = false;
}

export abstract class ListComponentBase extends AppComponentBase {
  constructor(injector: Injector) {
    super(injector);
    this.page  = new PaginationBaseDto(AppConsts.grid.defaultPageSize);
  }

  page: PaginationBaseDto = new PaginationBaseDto(AppConsts.grid.defaultPageSize);
  loading = false;
}
