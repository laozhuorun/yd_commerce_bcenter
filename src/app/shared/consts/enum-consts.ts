import { Period, StoreListDtoOrderSource } from '@shared/service-proxies/service-proxies';

export class EnumConsts {
  static OrderSource = 'OrderSource';
  static OrderStatus = 'OrderStatus';
  static OrderType = 'OrderType';
  static PaymentStatus = 'PaymentStatus';
  static ShippingStatus = 'ShippingStatus';
}

/** 订单来源10 = Self ; 20 = FxgAd ; 30 = FxgPd ; 40 = Tenant ; 50 = YouZan */
export class OrderSource {
  static Self: number = StoreListDtoOrderSource._10;
  static FxgAd: number = StoreListDtoOrderSource._20;
  static FxgPd: number = StoreListDtoOrderSource._30;
  static Tenant: number = StoreListDtoOrderSource._40;
  static YouZan: number = StoreListDtoOrderSource._50;
}

export class Periods {
  static Week = Period._2;
  static Month = Period._3;
  static Year = Period._3;
}

export class ShippingStatus {
  static Week = Period._2;
  static Month = Period._3;
  static Year = Period._3;

  static NotRequired = 100;
  static NotYetShipped = 200;
  static PartiallyShipped = 250;
  static Shipped = 300;
  static Taked = 302;
  static OnPassag = 303;
  static DestinationCity = 304;
  static Delivering = 305;
  static Received = 306;
  static Issue = 400;
  static IssueWithRejected = 404;
  static Cancel = 500;
  static Intercept = 600;
}
