import { PermissionCheckerService } from '@abp/auth/permission-checker.service';
import { FeatureCheckerService } from '@abp/features/feature-checker.service';
import { LocalizationService } from '@abp/localization/localization.service';
import { MessageService } from '@abp/message/message.service';
import { AbpMultiTenancyService } from '@abp/multi-tenancy/abp-multi-tenancy.service';
import { NotifyService } from '@abp/notify/notify.service';
import { SettingService } from '@abp/settings/setting.service';
import { Injector } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { NzMessageService } from 'ng-zorro-antd';

export abstract class AppComponentBase {
  localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;

  localization: LocalizationService;
  permission: PermissionCheckerService;
  feature: FeatureCheckerService;
  notify: NotifyService;
  setting: SettingService;
  message: MessageService;
  multiTenancy: AbpMultiTenancyService;
  msg: NzMessageService;

  constructor(injector: Injector) {
    this.localization = injector.get(LocalizationService);
    this.permission = injector.get(PermissionCheckerService);
    this.feature = injector.get(FeatureCheckerService);
    this.notify = injector.get(NotifyService);
    this.setting = injector.get(SettingService);
    this.message = injector.get(MessageService);
    this.multiTenancy = injector.get(AbpMultiTenancyService);
  }

  l(key: string, ...args: any[]): string {
    args.unshift(key);
    args.unshift(this.localizationSourceName);
    return this.ls.apply(this, args);
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
}

export abstract class FormComponentBase extends AppComponentBase {
  constructor(injector: Injector) {
    super(injector);
  }

  loading = false;
}
