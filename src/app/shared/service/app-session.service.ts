import { Injectable, Inject } from '@angular/core';
import {
  SessionServiceProxy,
  UserLoginInfoDto,
  TenantLoginInfoDto,
  ApplicationInfoDto,
  GetCurrentLoginInformationsOutput,
} from '@shared/service-proxies/service-proxies';
import { AbpMultiTenancyService } from '@abp/multi-tenancy/abp-multi-tenancy.service';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { SettingsService } from '@delon/theme';
import { Source } from '@shared/consts/static-source';

@Injectable()
export class AppSessionService {
  private _user: UserLoginInfoDto;
  private _tenant: TenantLoginInfoDto;
  private _application: ApplicationInfoDto;

  constructor(
    private _settingService: SettingsService,
    @Inject(DA_SERVICE_TOKEN) private _tokenService: ITokenService,
    private _sessionService: SessionServiceProxy,
    private _abpMultiTenancyService: AbpMultiTenancyService,
  ) {}

  get application(): ApplicationInfoDto {
    return this._application;
  }

  get user(): UserLoginInfoDto {
    return this._user;
  }

  get userId(): number {
    return this.user ? this.user.id : null;
  }

  get tenant(): TenantLoginInfoDto {
    return this._tenant;
  }

  get tenantId(): number {
    return this.tenant ? this.tenant.id : null;
  }

  getShownLoginName(): string {
    const userName = this._user.userName;
    if (!this._abpMultiTenancyService.isEnabled) {
      return userName;
    }

    return (this._tenant ? this._tenant.tenancyName : '.') + '\\' + userName;
  }

  init(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this._sessionService
        .getCurrentLoginInformations()
        .toPromise()
        .then(
          (result: GetCurrentLoginInformationsOutput) => {
            if (result) {
              if (result.user && result.user !== undefined)
                result.user.profilePictureUrl = result.user.profilePictureUrl || Source.DefaultProfile;

              this._application = result.application;
              this._user = result.user;
              this._tenant = result.tenant;

              if (result.user != null) {
                const user = {
                  token: abp.auth.getToken(),
                  name: result.user.nickName,
                  avatar: result.user.profilePictureUrl,
                  email: result.user.emailAddress,
                  application: result.application,
                  user: result.user,
                  tenant: result.tenant,
                };

                // 设置用户Token信息
                this._tokenService.set(user);

                this._settingService.setUser(user);
              }
            }

            resolve(true);
          },
          err => {
            reject(err);
          },
        );
    });
  }

  changeTenantIfNeeded(tenantId?: number): boolean {
    if (this.isCurrentTenant(tenantId)) {
      return false;
    }

    abp.multiTenancy.setTenantIdCookie(tenantId);
    location.reload();
    return true;
  }

  private isCurrentTenant(tenantId?: number) {
    if (!tenantId && this.tenant) {
      return false;
    } else if (tenantId && (!this.tenant || this.tenant.id !== tenantId)) {
      return false;
    }

    return true;
  }
}
