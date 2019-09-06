import {
  Period,
  StoreListDtoOrderSource,
  OrderStatuses,
  PaymentStatuses,
  ShippingStatuses,
  OrderTypes,
  AdvertChannels,
} from '@shared/service-proxies/service-proxies';

export class EnumConsts {
  static OrderSource = 'OrderSource';
  static OrderStatus = 'OrderStatus';
  static OrderType = 'OrderType';
  static PaymentStatus = 'PaymentStatus';
  static ShippingStatus = 'ShippingStatus';
  static AdvertChannel = 'AdvertChannel';
  static AdvertAccountType = 'AdvertAccountType';
}

export class SelectCacheKey {}

/** 订单状态(缺省为待确认)10 = WaitConfirm ; 20 = Processing ; 30 = Completed ; 40 = Canceled */
export class OrderStatus {
  static WaitConfirm: number = OrderStatuses._10;
  static Processing: number = OrderStatuses._20;
  static Completed: number = OrderStatuses._30;
  static Canceled: number = OrderStatuses._40;
}

/** 支付状态10 = Pending ; 30 = Paid ; 35 = PartiallyRefunded ; 40 = Refunded */
export class PaymentStatus {
  static Pending: number = PaymentStatuses._10;
  static Paid: number = PaymentStatuses._30;
  static PartiallyRefunded: number = PaymentStatuses._35;
  static Refunded: number = PaymentStatuses._40;
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

/** 物流状态100 = NotRequired ; 200 = NotYetShipped ; 250 = PartiallyShipped ; 300 = Shipped ; 302 = Taked ; 303 = OnPassag ; 304 = DestinationCity ; 305 = Delivering ; 306 = Received ; 400 = Issue ; 404 = IssueWithRejected ; 500 = Cancel ; 600 = Intercept */
export class ShippingStatus {
  static NotRequired = ShippingStatuses._100;
  static NotYetShipped = ShippingStatuses._200;

  static PartiallyShipped = ShippingStatuses._250;
  static Shipped = ShippingStatuses._300;
  static Taked = ShippingStatuses._302;
  static OnPassag = ShippingStatuses._303;
  static DestinationCity = ShippingStatuses._304;
  static Delivering = ShippingStatuses._305;

  static Received = ShippingStatuses._306;

  static Issue = ShippingStatuses._400;
  static IssueWithRejected = ShippingStatuses._404;

  static Cancel = ShippingStatuses._500;
  static Intercept = ShippingStatuses._600;
}

export class OrderType {
  static PayOnline: number = OrderTypes._1;
  static PayOnDelivery: number = OrderTypes._2;
}

export class OrderTags {
  static Repeat = 'repeat';
  static LowReceive = 'lowreceive';
  static UnPaid = 'unpaid';
  static ShipError = 'shiperror';
  static OverRange = 'overrange';
  static ReDeliver = 'redeliver';
}

export class AdvertChannel {
  static Toutiao = AdvertChannels._20;

  static Tenant = AdvertChannels._40;
}
