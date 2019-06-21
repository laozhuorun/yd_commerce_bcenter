export class AppConsts {
  static readonly tenancyNamePlaceHolderInUrl = '{TENANCY_NAME}';

  static remoteServiceBaseUrl = 'http://60.205.216.113';
  static remoteServiceBaseUrlFormat = 'http://60.205.216.113';
  static appBaseUrl = 'http://www.udosass.com';
  static appBaseHref = 'http://www.udosass.com'; // returns angular's base-href parameter value if used during the publish
  static appBaseUrlFormat = 'http://www.udosass.com';
  static recaptchaSiteKey: string;
  static subscriptionExpireNootifyDayCount: number;

  static localeMappings: any = [];

  static readonly externalLoginUrl = '/auth/external';
  static readonly userManagement = {
    defaultAdminUserName: 'admin',
  };

  static readonly localization = {
    commonLocalizationSourceName: 'Xiaoyuyue',
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
}

export class MediaCompressFormat {
  static bookingListFormat = 'imageView2/2/w/600/q/100|imageslim';
  static bookingInfoFormat = 'imageView2/2/w/800/q/100|imageslim';
  static outletListFormat = 'imageView2/2/w/600/q/100|imageslim';
  static outletInfoFormat = 'imageView2/2/w/800/q/100|imageslim';
  static contactorFormat = 'imageView2/2/w/400/q/100|imageslim';
  static minProfilePictureFormat = 'imageView2/2/w/100/q/100|imageslim';
}
