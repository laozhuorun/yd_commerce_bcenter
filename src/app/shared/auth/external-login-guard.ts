import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Params,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { Injectable } from '@angular/core';
import { PermissionCheckerService } from '@abp/auth/permission-checker.service';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { LoginService } from '@shared/service/login.service';

@Injectable()
export class ExternalLoginGuard implements CanActivate {
  constructor(
    private _router: Router,
    // private _ExternalLoginProvider: ExternalLoginProvider,
    private loginService: LoginService,
    private activatedRoute: ActivatedRoute,
  ) {}

  canActivate(params: Params): boolean {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      var providerName = params['providerName'];
      if (providerName !== undefined) {
        this.loginService.externalLoginCallback(params);
      } else {
        return;
      }
    });
    return true;
  }
}
