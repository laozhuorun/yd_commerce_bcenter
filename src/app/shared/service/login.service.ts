import {
  AuthenticateModel,
  AuthenticateResultModel,
  ExternalAuthenticateModel,
  ExternalAuthenticateResultModel,
  ExternalLoginProviderInfoModel,
  PhoneAuthenticateModel,
  SupplementAuthModel,
  SupplementAuthResultModel,
  TokenAuthServiceProxy,
  WebLogServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { Injectable, Inject, Optional } from '@angular/core';
import { Params, Router } from '@angular/router';

import { AppConsts } from '@shared/consts/app-consts';
import { LocalizationService } from '@abp/localization/localization.service';
import { LogService } from '@abp/log/log.service';
import { MessageService } from '@abp/message/message.service';
import { NotifyService } from '@abp/notify/notify.service';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { finalize } from 'rxjs/operators';
import { ScriptLoaderService } from './script-loader.service';
import { AppSessionService } from '@shared/service/app-session.service';
import { CookiesService } from './cookies.service';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { ReuseTabService } from '@delon/abc';
import { StartupService } from '@core';

const UA = require('ua-device');
declare const FB: any; // Facebook API
declare const gapi: any; // Google API

export class ExternalLoginProvider extends ExternalLoginProviderInfoModel {
  static readonly FACEBOOK: string = 'Facebook';
  static readonly GOOGLE: string = 'Google';
  static readonly WECHAT = 'WeChat';
  static readonly WECHATMP = 'WeChatMP';
  static readonly QQ = 'QQ';
  icon: string;
  initialized = false;

  private static getSocialIcon(providerName: string): string {
    providerName = providerName.toLowerCase();

    return providerName;
  }

  constructor(providerInfo: ExternalLoginProviderInfoModel) {
    super();

    this.name = providerInfo.name;
    this.clientId = providerInfo.clientId;
    this.icon = ExternalLoginProvider.getSocialIcon(this.name);
    this.initialized = providerInfo.name === 'WeChat' || providerInfo.name === 'QQ' || providerInfo.name === 'WeChatMP';
  }
}

@Injectable()
export class LoginService {
  localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;
  commonlocalizationSourceName = AppConsts.localization.commonLocalizationSourceName;
  outputUa: any;
  throwException: any;
  jsonParseReviver: any;
  authenticateModel: AuthenticateModel;
  authenticateResult: AuthenticateResultModel;
  externalLoginProviders: ExternalLoginProvider[] = [];
  rememberMe: boolean;

  constructor(
    private _localization: LocalizationService,
    private _tokenAuthService: TokenAuthServiceProxy,
    private _router: Router,
    private _messageService: MessageService,
    private _logService: LogService,
    private _cookiesService: CookiesService,
    private _appSessionService: AppSessionService,
    private _notify: NotifyService,
    @Optional()
    @Inject(ReuseTabService)
    private _reuseTabService: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN) private _tokenService: ITokenService,
    private _startupService: StartupService,
  ) {
    this.clear();
  }

  authenticate(finallyCallback?: () => void, redirectUrl?: string): void {
    finallyCallback = finallyCallback || (() => {});

    this._tokenAuthService
      .authenticate(this.authenticateModel)
      .pipe(finalize(finallyCallback))
      .subscribe((result: AuthenticateResultModel) => {
        this.processAuthenticateResult(result, redirectUrl);
      });
  }

  phoneNumAuth(model: PhoneAuthenticateModel, finallyCallback?: () => void): void {
    finallyCallback = finallyCallback || (() => {});
    this._tokenAuthService
      .phoneNumAuthenticate(model)
      .pipe(finalize(finallyCallback))
      .subscribe((result: AuthenticateResultModel) => {
        this.processAuthenticateResult(result);
      });
  }

  supplRregister(model: SupplementAuthModel, finallyCallback?: () => void): void {
    finallyCallback = finallyCallback || (() => {});
    this._tokenAuthService
      .supplementAuth(model)
      .pipe(finalize(finallyCallback))
      .subscribe((result: SupplementAuthResultModel) => {
        this.login(result.tenantId, result.accessToken, result.encryptedAccessToken, result.expireInSeconds, true);
      });
  }

  externalAuthenticate(provider: ExternalLoginProvider, isAuthBind: boolean = false): void {
    this.ensureExternalLoginProviderInitialized(provider, () => {
      if (provider.name === ExternalLoginProvider.FACEBOOK) {
        if (this.outputUa.device.type === 'mobile') {
          const authBaseUrl = 'https://www.facebook.com/v2.12/dialog/oauth';
          const appid = provider.clientId;
          const redirect_url =
            AppConsts.appBaseUrl +
            '/auth/external' +
            '?providerName=' +
            ExternalLoginProvider.FACEBOOK +
            '&isAuthBind=' +
            isAuthBind;
          const response_type = 'code%20token';
          const scope = 'email,public_profile,user_location';
          const authUrl = `${authBaseUrl}?client_id=${appid}&redirect_uri=${encodeURIComponent(
            redirect_url,
          )}&response_type=${response_type}&scope=${scope}`;
          window.location.href = authUrl;
        } else {
          FB.login(
            function(response) {
              // handle the response
            },
            { scope: 'email,public_profile,user_location' },
          );
        }
      } else if (provider.name === ExternalLoginProvider.GOOGLE) {
        if (this.outputUa.device.type === 'mobile') {
          const authBaseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
          const appid = provider.clientId;
          const redirect_url = AppConsts.appBaseUrl + '/auth/external';
          const state = 'providerName=' + ExternalLoginProvider.GOOGLE + '&isAuthBind=' + isAuthBind;
          const response_type = 'token';
          const scope = 'email%20profile';
          const include_granted_scopes = true;
          const authUrl = `${authBaseUrl}?client_id=${appid}&redirect_uri=${encodeURIComponent(
            redirect_url,
          )}&state=${encodeURIComponent(
            state,
          )}&response_type=${response_type}&scope=${scope}&include_granted_scopes=${include_granted_scopes}`;
          window.location.href = authUrl;
        } else {
          gapi.auth2.getAuthInstance().signIn();
        }
      } else if (provider.name === ExternalLoginProvider.WECHAT) {
        new ScriptLoaderService().load('https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js').then(() => {
          const wxLogin = new WxLogin({
            id: 'externalLoginContainer',
            appid: provider.clientId,
            scope: 'snsapi_login',
            redirect_uri:
              AppConsts.appBaseUrl +
              AppConsts.externalLoginUrl +
              '?providerName=' +
              ExternalLoginProvider.WECHAT +
              '&isAuthBind=' +
              isAuthBind,
            state: 'xiaoyuyue',
            style: 'white',
            // href: 'https://static.vapps.com.cn/vappszero/wechat-login.css'
          });
        });
      } else if (provider.name === ExternalLoginProvider.WECHATMP) {
        const authBaseUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize';
        const appid = provider.clientId;
        const redirect_url =
          AppConsts.appBaseUrl +
          '/auth/external' +
          '?providerName=' +
          ExternalLoginProvider.WECHATMP +
          '&isAuthBind=' +
          isAuthBind;
        const response_type = 'code';
        const scope = 'snsapi_userinfo';
        const authUrl = `${authBaseUrl}?appid=${appid}&redirect_uri=${encodeURIComponent(
          redirect_url,
        )}&response_type=${response_type}&scope=${scope}#wechat_redirect`;
        window.location.href = authUrl;
      } else if (provider.name === ExternalLoginProvider.QQ) {
        const authBaseUrl = 'https://graph.qq.com/oauth2.0/authorize';
        const appid = provider.clientId;
        const redirect_url =
          AppConsts.appBaseUrl +
          '/auth/external' +
          '?providerName=' +
          ExternalLoginProvider.QQ +
          '&isAuthBind=' +
          isAuthBind;
        const response_type = 'code';
        const scope = 'get_user_info';
        const authUrl = `${authBaseUrl}?client_id=${appid}&response_type=${response_type}&scope=${scope}&redirect_uri=${encodeURIComponent(
          redirect_url,
        )}&display=`;
        window.location.href = authUrl;
      }
    });
  }

  init(callback?: any): void {
    this.outputUa = new UA(window.navigator.userAgent);
    this.initExternalLoginProviders(callback);
  }

  private processAuthenticateResult(authenticateResult: AuthenticateResultModel, redirectUrl?: string) {
    this.authenticateResult = authenticateResult;

    if (authenticateResult.shouldResetPassword) {
      // Password reset

      this._router.navigate(['account/reset-password'], {
        queryParams: {
          userId: authenticateResult.userId,
          tenantId: abp.session.tenantId,
          resetCode: authenticateResult.passwordResetCode,
        },
      });

      this.clear();
    } else if (authenticateResult.accessToken) {
      // Successfully logged in
      this.login(
        authenticateResult.tenantId,
        authenticateResult.accessToken,
        authenticateResult.encryptedAccessToken,
        authenticateResult.expireInSeconds,
        this.rememberMe,
        UrlHelper.redirectUrl,
      );
    } else {
      // Unexpected result!

      this._logService.warn('Unexpected authenticateResult!');
      this._router.navigate(['auth/login']);
    }
  }

  private login(
    tenantId: number,
    accessToken: string,
    encryptedAccessToken: string,
    expireInSeconds: number,
    rememberMe?: boolean,
    redirectUrl?: string,
  ): void {
    const tokenExpireDate = rememberMe ? new Date(new Date().getTime() + 1000 * expireInSeconds) : undefined;

    this._cookiesService.setToken(accessToken, tokenExpireDate);
    this._cookiesService.setTenantIdCookie(tenantId);

    this._cookiesService.setCookieValue(
      AppConsts.authorization.encrptedAuthTokenName,
      encryptedAccessToken,
      tokenExpireDate,
      abp.appPath,
    );

    // 清空路由复用信息
    this._reuseTabService.clear();
    // 设置用户Token信息
    this._tokenService.set({
      token: accessToken,
    });

    // UrlHelper.redirectUrl = this._cookiesService.getCookieValue('UrlHelper.redirectUrl');
    // this._cookiesService.deleteCookie('UrlHelper.redirectUrl', '/');
    // const initialUrl =
    //   UrlHelper.redirectUrl && UrlHelper.redirectUrl.indexOf(AppConsts.appBaseUrl) >= 0
    //     ? UrlHelper.redirectUrl
    //     : (UrlHelper.redirectUrl = AppConsts.appBaseUrl + '/dashboard/analysis');
    // if (redirectUrl) {
    //   location.href = redirectUrl;
    // } else {
    //   location.href = initialUrl;
    // }

    // 重新获取 StartupService 内容，我们始终认为应用信息一般都会受当前用户授权范围而影响
    this._startupService.load().then(() => {
      let url = this._tokenService.referrer.url || '/';
      if (url.includes('/passport')) url = '/';
      // window.location.href = '/';
      this._router.navigateByUrl(url);
    });
  }

  private clear(): void {
    this.authenticateModel = new AuthenticateModel();
    this.authenticateModel.rememberClient = false;
    this.authenticateResult = null;
    this.rememberMe = false;
  }

  private initExternalLoginProviders(callback?: any) {
    if (this.externalLoginProviders.length > 0) {
      if (callback) {
        callback(this.externalLoginProviders);
      }
      return;
    }
    this._tokenAuthService
      .getExternalAuthenticationProviders()
      .subscribe((providers: ExternalLoginProviderInfoModel[]) => {
        this.externalLoginProviders = providers.map(function(p) {
          return new ExternalLoginProvider(p);
        });

        // this.externalLoginProviders = _.map(providers, p => {
        //   return new ExternalLoginProvider(p);
        // });

        if (callback) {
          callback(this.externalLoginProviders);
        }
      });
  }

  ensureExternalLoginProviderInitialized(loginProvider: ExternalLoginProvider, callback: () => void) {
    if (loginProvider.initialized) {
      callback();
      return;
    }

    if (loginProvider.name === ExternalLoginProvider.FACEBOOK) {
      new ScriptLoaderService().load('//connect.facebook.net/en_US/sdk.js').then(() => {
        FB.init({
          appId: loginProvider.clientId,
          cookie: false,
          xfbml: true,
          version: 'v2.5',
        });

        FB.getLoginStatus(response => {
          this.facebookLoginStatusChangeCallback(response);
          if (response.status !== 'connected') {
            callback();
          }
        });
      });
    } else if (loginProvider.name === ExternalLoginProvider.GOOGLE) {
      new ScriptLoaderService().load('https://apis.google.com/js/api.js').then(() => {
        gapi.load('client:auth2', () => {
          gapi.client
            .init({
              clientId: loginProvider.clientId,
              scope: 'openid profile email',
            })
            .then(() => {
              callback();
            });
        });
      });
    }
  }

  private facebookLoginStatusChangeCallback(resp) {
    if (resp.status === 'connected') {
      const model = new ExternalAuthenticateModel();
      model.authProvider = ExternalLoginProvider.FACEBOOK;
      model.providerAccessCode = resp.authResponse.accessToken;
      model.providerKey = resp.authResponse.userID;
      this.showLoading();

      if (this._appSessionService.user) {
        this._tokenAuthService.externalBinding(model).subscribe(() => {
          this.hideLoading();
          this._notify.success(this.l('Binding.Success.Hint'));
          abp.event.trigger('facebookBinding');
        });
      } else {
        this._tokenAuthService
          .externalAuthenticate(model)
          .pipe(
            finalize(() => {
              this.hideLoading();
            }),
          )
          .subscribe((result: ExternalAuthenticateResultModel) => {
            this.hideLoading();
            if (result.waitingForActivation) {
              this._messageService.info(this.l('RegisterSuccessAndNeed2PerfectInfo'));
              return;
            }
            this.login(result.tenantId, result.accessToken, result.encryptedAccessToken, result.expireInSeconds, true);
          });
      }
    }
  }

  private googleLoginStatusChangeCallback(isSignedIn) {
    if (isSignedIn) {
      const model = new ExternalAuthenticateModel();
      model.authProvider = ExternalLoginProvider.GOOGLE;
      model.providerAccessCode = gapi.auth2
        .getAuthInstance()
        .currentUser.get()
        .getAuthResponse().access_token;
      model.providerKey = gapi.auth2
        .getAuthInstance()
        .currentUser.get()
        .getBasicProfile()
        .getId();
      this.showLoading();
      if (this._appSessionService.user) {
        this._tokenAuthService.externalBinding(model).subscribe(() => {
          this.hideLoading();
          this._notify.success(this.l('Binding.Success.Hint'));
          abp.event.trigger('googleBinding');
        });
      } else {
        this._tokenAuthService
          .externalAuthenticate(model)
          .pipe(
            finalize(() => {
              this.hideLoading();
            }),
          )
          .subscribe((result: ExternalAuthenticateResultModel) => {
            if (result.waitingForActivation) {
              this._messageService.info(this.l('RegisterSuccessAndNeed2PerfectInfo'));
              return;
            }
            this.login(result.tenantId, result.accessToken, result.encryptedAccessToken, result.expireInSeconds, true);
          });
      }
    }
  }

  public externalLoginCallback(params: Params): void {
    const model = this.initAccessCode(params);
    this._tokenAuthService.externalAuthenticate(model).subscribe((result: ExternalAuthenticateResultModel) => {
      if (result.waitingForActivation) {
        this._messageService.info(this.l('NeedSupplementary'));
        return;
      }

      this.login(result.tenantId, result.accessToken, result.encryptedAccessToken, result.expireInSeconds, true);
    });
  }

  public externalBindingCallback(params: Params): void {
    const model = this.initAccessCode(params);
    this._tokenAuthService.externalBinding(model).subscribe(
      () => {
        this._notify.success(this.l('Binding.Success.Hint'));
        this.redirectByCookie();
      },
      (error: any) => {
        this._messageService.confirm('', error.message, () => {
          this.redirectByCookie();
        });
      },
    );
  }

  private initAccessCode(params: Params): ExternalAuthenticateModel {
    const model = new ExternalAuthenticateModel();
    model.authProvider = params['providerName'];
    if (params['providerName'] === ExternalLoginProvider.FACEBOOK) {
      model.providerAccessCode = params['access_token'];
      model.providerKey = ExternalLoginProvider.FACEBOOK;
    } else if (params['providerName'] === ExternalLoginProvider.GOOGLE) {
      model.providerAccessCode = params['access_token'];
      model.providerKey = ExternalLoginProvider.GOOGLE;
    } else {
      model.providerAccessCode = params['code'];
      model.providerKey = params['code'];
    }

    return model;
  }

  private redirectByCookie() {
    UrlHelper.redirectUrl = this._cookiesService.getCookieValue('UrlHelper.redirectUrl');
    this._cookiesService.deleteCookie('UrlHelper.redirectUrl', '/');
    const initialUrl = UrlHelper.redirectUrl
      ? UrlHelper.redirectUrl
      : (UrlHelper.redirectUrl = AppConsts.appBaseUrl + '/dashboard');
    location.href = initialUrl;
  }

  private showLoading(): void {
    // const dom = `
    // <div id="externalLoading" class="swal-overlay swal-overlay--show-modal" tabindex="-1">
    //     <div class="swal-modal">
    //         <div class="swal-loading-spinner"><i></i></div>
    //         <div class="swal-title">授权中</div>
    //         <div class="swal-footer"></div>
    //     </div>
    // </div>`;
    // const bodyEle = $('body');
    // bodyEle.append(dom);
  }

  private hideLoading(): void {
    // $('#externalLoading').remove();
  }

  l(key: string, ...args: any[]): string {
    let localizedText = this._localization.localize(key, this.localizationSourceName);

    if (localizedText === key) {
      localizedText = this._localization.localize(key, this.commonlocalizationSourceName);
    }

    if (!localizedText) {
      localizedText = key;
    }

    if (!args || !args.length) {
      return localizedText;
    }

    args.unshift(localizedText);
    return abp.utils.formatString.apply(this, args);
  }

  public findExternalLoginProvider(name: string): ExternalLoginProvider {
    for (let i = 0; i < this.externalLoginProviders.length; i++) {
      if (this.externalLoginProviders[i].name === name) {
        return this.externalLoginProviders[i];
      }
    }

    return null;
  }
}
