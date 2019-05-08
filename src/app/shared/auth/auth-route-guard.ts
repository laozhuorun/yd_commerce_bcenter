import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';

import { Injectable } from '@angular/core';
import { PermissionCheckerService } from '@abp/auth/permission-checker.service';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { AppAuthService } from './app-auth.service';
import { AppSessionService } from '@shared/service/app-session.service';

@Injectable()
export class AppRouteGuard implements CanActivate, CanActivateChild {
  constructor(
    private _permissionChecker: PermissionCheckerService,
    private _router: Router,
    private _sessionService: AppSessionService,
    private _appAuthService: AppAuthService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this._sessionService.user) {
      this._appAuthService.recordRedirectUrl();

      this._router.navigate(['/passport/login']);
      return false;
    }

    if (!route.data || !route.data['permission']) {
      return true;
    }

    if (this._permissionChecker.isGranted(route.data['permission'])) {
      return true;
    }

    this._router.navigate([this.selectBestRoute()]);
    return false;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  selectBestRoute(): string {
    if (!this._sessionService.user) {
      this._router.navigate(['/passport/login']);
    } else if (!this._sessionService.tenantId) {
      return '/auth/register';
    }

    // if (this._permissionChecker.isGranted(AdminPermissions.tenantDashboard)) {
    //   return '/dashboard/analysis';
    // }

    return '/passport/login';
  }

  isWeiXin() {
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) + '' === 'micromessenger') {
      return true;
    } else {
      return false;
    }
  }
}
