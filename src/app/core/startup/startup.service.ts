import { Injectable, Inject, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MenuService, SettingsService, TitleService, ALAIN_I18N_TOKEN } from '@delon/theme';
import { ACLService } from '@delon/acl';
import { TranslateService } from '@ngx-translate/core';
import { I18NService } from '../i18n/i18n.service';

import { NzIconService } from 'ng-zorro-antd';
import { ICONS_AUTO } from '../../../style-icons-auto';
import { ICONS } from '../../../style-icons';
import { AppPreBootstrap } from './AppPreBootstrap';
import { AppSessionService } from '@shared/service/app-session.service';
import { AppConsts } from '@shared/consts/app-consts';
import { PlatformLocation } from '@angular/common';
import { NzNotification } from '@shared/components/notification/nzNotification';
import { NzMessage } from '@shared/components/notification/nzMessage';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
  constructor(
    iconSrv: NzIconService,
    private platformLocation: PlatformLocation,
    private sessionService: AppSessionService,
    private menuService: MenuService,
    private translate: TranslateService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    private httpClient: HttpClient,
    private nzNotification: NzNotification,
    private nzMessage: NzMessage,
  ) {
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
  }

  load(): Promise<any> {
    // https://github.com/angular/angular/issues/15088
    return new Promise(resolve => {
      AppConsts.appBaseHref = getBaseHref(this.platformLocation);
      const appBaseUrl = getDocumentOrigin() + AppConsts.appBaseHref;

      AppPreBootstrap.run(appBaseUrl, () => {
        abp.event.trigger('abp.dynamicScriptsInitialized');
        this.sessionService.init().then(result => {}, err => {});

        zip(
          this.httpClient.get(`assets/tmp/i18n/${this.i18n.defaultLang}.json`),
          this.httpClient.get('assets/tmp/app-data.json'),
        )
          .pipe(
            // 接收其他拦截器后产生的异常消息
            catchError(([langData, appData]) => {
              resolve(null);
              return [langData, appData];
            }),
          )
          .subscribe(
            ([langData, appData]) => {
              // setting language data
              this.translate.setTranslation(this.i18n.defaultLang, langData);
              this.translate.setDefaultLang(this.i18n.defaultLang);

              // application data
              const res: any = appData;
              // 应用信息：包括站点名、描述、年份
              this.settingService.setApp(res.app);
              // 用户信息：包括姓名、头像、邮箱地址
              // this.settingService.setUser(res.user);
              // ACL：设置权限为全量
              this.aclService.setFull(true);
              // 初始化菜单
              this.menuService.add(res.menu);
              // 设置页面标题的后缀
              this.titleService.default = '';
              this.titleService.suffix = res.app.name;
            },
            () => {},
            () => {
              resolve(null);
            },
          );
      });
    });
  }

  // #endregion
  getRemoteServiceBaseUrl(): string {
    return AppConsts.remoteServiceBaseUrl;
  }
}

export function getBaseHref(platformLocation: PlatformLocation): string {
  let baseUrl = platformLocation.getBaseHrefFromDOM();
  if (baseUrl) {
    return baseUrl;
  }

  return '/';
}

function getDocumentOrigin() {
  if (!document.location.origin) {
    return (
      document.location.protocol +
      '//' +
      document.location.hostname +
      (document.location.port ? ':' + document.location.port : '')
    );
  }

  return document.location.origin;
}
