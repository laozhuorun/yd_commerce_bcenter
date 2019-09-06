import { OrderSource, AdvertChannel } from './enum-consts';

export class Source {
  public static readonly DefaultProfile = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
}

export class SourcePictureHelper {
  public static readonly Self =
    'https://media.udosass.com/static/udo.png?imageMogr2/thumbnail/200x/format/webp/blur/1x0/quality/75|imageslim';
  public static readonly Toutiao =
    'https://media.udosass.com/static/toutiao.png?imageMogr2/thumbnail/200x/format/webp/blur/1x0/quality/75|imageslim';
  public static readonly Tenant =
    'https://media.udosass.com/static/tenant.png?imageMogr2/thumbnail/200x/format/webp/blur/1x0/quality/75|imageslim';
  public static readonly Tenant_WithName =
    'https://media.udosass.com/static/ads_tenant.png?imageMogr2/thumbnail/200x/format/webp/blur/1x0/quality/75|imageslim';
  public static readonly Youzan =
    'https://media.udosass.com/static/youzan.png?imageMogr2/thumbnail/200x/format/webp/blur/1x0/quality/75|imageslim';
  public static readonly Oceanengine_WithName =
    'https://media.udosass.com/static/oceanengine.png?imageMogr2/thumbnail/200x/format/webp/blur/1x0/quality/75|imageslim';

  public static readonly Oceanengine =
    'https://media.udosass.com/static/oceanengine_noname.png?imageMogr2/thumbnail/200x/format/webp/blur/1x0/quality/75|imageslim';

  public static getSourcePicture(orderSource: number): string {
    if (orderSource === OrderSource.Tenant) return SourcePictureHelper.Tenant;
    else if (orderSource === OrderSource.FxgAd) return SourcePictureHelper.Toutiao;
    else if (orderSource === OrderSource.FxgPd) return SourcePictureHelper.Toutiao;
    else if (orderSource === OrderSource.YouZan) return SourcePictureHelper.Youzan;
    else return SourcePictureHelper.Self;
  }

  public static getAdvertChannelPicture(advertChannel: number): string {
    if (advertChannel === AdvertChannel.Tenant) return SourcePictureHelper.Tenant;
    else if (advertChannel === AdvertChannel.Toutiao) return SourcePictureHelper.Oceanengine;
    else return SourcePictureHelper.Self;
  }
}

export class TagColor {
  public static readonly Success = '#52c41a';
  public static readonly Info = '#1890ff';
  public static readonly Warning = '#faad14';
  public static readonly Error = '#f5222d';
}
