import {
    ActivatedRoute,
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    Params,
    Router,
    RouterStateSnapshot
} from '@angular/router';

import { AdminPermissions } from '@shared/AdminPermissions';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { Injectable } from '@angular/core';
import { LoginService } from "shared/services/login.service";
import { PermissionCheckerService } from "@abp/auth/permission-checker.service";
import { UrlHelper } from '@shared/helpers/UrlHelper';

@Injectable()
export class ExternalLoginGuard implements CanActivate {

    constructor(
        private _router: Router,
        // private _ExternalLoginProvider: ExternalLoginProvider,
        private _LoginService: LoginService,
        private _activatedRoute: ActivatedRoute,
    ) { }

    canActivate(params: Params): boolean {
        var providerName = undefined;

        this._activatedRoute.queryParams.subscribe((params: Params) => {
            providerName = params['providerName'];
            if (providerName !== undefined) {
                this._LoginService.externalLoginCallback(params);
            } else {
                return;
            }
        });
        return true;
    }
}