export class AppConsts {
  static readonly tenancyNamePlaceHolderInUrl = '{TENANCY_NAME}';

  static remoteServiceBaseUrl = 'https://api.udosass.com/';
  static remoteServiceBaseUrlFormat = 'https://api.udosass.com/';
  static appBaseUrl = 'https://www.udosass.com';
  static appBaseHref = 'https://www.udosass.com'; // returns angular's base-href parameter value if used during the publish
  static appBaseUrlFormat = 'https://www.udosass.com';
  static recaptchaSiteKey: string;
  static subscriptionExpireNootifyDayCount: number;

  static localeMappings: any = [];

  static readonly advertAuth = '/advert/auth';

  static readonly externalLoginUrl = '/auth/external';
  static readonly userManagement = {
    defaultAdminUserName: 'admin',
  };

  static readonly localization = {
    commonLocalizationSourceName: 'udo',
    defaultLocalizationSourceName: 'BusinessCenter',
  };

  static readonly authorization = {
    encrptedAuthTokenName: 'enc_auth_token',
  };

  static readonly grid = {
    defaultPageSize: 20,
    pageSizeOptions: [5, 10, 20, 50, 100],
    maxPageSize: 100,
  };

  static readonly enumName = {
    OrderSource: 'OrderSource',
    OrderStatus: 'OrderStatus',
    OrderType: 'OrderType',
    PaymentStatus: 'PaymentStatus',
    ShippingStatus: 'ShippingStatus',
  };

  static readonly defaultPicture = 'https://media.udosass.com/default.jpg';

  static readonly CacheKey = {
    ProductSelectData: 'ProductSelectData',
    TenantLogistics: 'TenantLogistics',
    AdvertAccount: 'AdvertAccount',
  };

  static getAdvertAuthCallBackUrl() {
    return this.appBaseUrl + this.advertAuth;
  }
}

export class MediaCompressFormat {
  static orderListFormat = '?imageView2/2/w/200/q/100/format/webp|imageslim';
  static productListFormat = '?imageView2/2/w/200/q/100/format/webp|imageslim';
  static productInfoFormat = '?imageView2/2/w/600/q/100/format/webp|imageslim';
  static storeListFormat = '?imageView2/2/w/800/q/100/format/webp|imageslim';
  static contactorFormat = '?imageView2/2/w/400/q/100/format/webp|imageslim';
  static minProfilePictureFormat = '?imageView2/2/w/100/q/100/format/webp|imageslim';
}
