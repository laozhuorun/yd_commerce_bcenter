export class AppConsts {
  static readonly tenancyNamePlaceHolderInUrl = '{TENANCY_NAME}';

  static remoteServiceBaseUrl = 'http://localhost:6001';
  static remoteServiceBaseUrlFormat = 'http://localhost:6001';
  static appBaseUrl = 'http://localhost:4200';
  static appBaseHref = 'http://localhost:4200'; // returns angular's base-href parameter value if used during the publish
  static appBaseUrlFormat = 'http://localhost:4200';
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
    defaultPageSize: 10,
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
