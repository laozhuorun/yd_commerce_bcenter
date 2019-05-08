import { AppConsts } from '@shared/AppConsts';
import { Injectable } from '@angular/core';
import { CookiesService } from '@shared/service/cookies.service';

@Injectable()
export class AppAuthService {
  constructor(private _cookiesService: CookiesService) {}

  logout(reload?: boolean, returnUrl?: string): void {
    this._cookiesService.clearToken();
    if (reload !== false) {
      if (returnUrl) {
        location.href = returnUrl;
      } else {
        location.href = AppConsts.appBaseUrl;
      }
    }
  }

  isLogin(): boolean {
    if (abp.auth.getToken()) {
      return true;
    }
    return false;
  }

  recordRedirectUrl(): void {
    if (location.href.indexOf('auth') > 0) {
      return;
    }
    const exdate = new Date();
    exdate.setDate(exdate.getDate() + 1);
    this._cookiesService.deleteCookie('UrlHelper.redirectUrl', '/');
    if (AppConsts.appBaseUrl.indexOf(location.href) < 0) {
      this._cookiesService.setCookieValue('UrlHelper.redirectUrl', location.href, exdate, '/');
    }
  }
}
