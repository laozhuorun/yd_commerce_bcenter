import { OrderSource } from './enum-consts';

export class Source {
  public static readonly DefaultProfile = 'https://gw.alipayobjects.com/zos/rmsportal/lctvVCLfRpYCkYxAsiVQ.png';
}

export class SourcePictureHelper {
  public static readonly Self = 'http://image.vapps.com.cn/enum/udo.png';
  public static readonly Toutiao = 'http://image.vapps.com.cn/enum/toutiao.png';
  public static readonly Tenant = 'http://image.vapps.com.cn/enum/tenant2.png';
  public static readonly Youzan = 'http://image.vapps.com.cn/enum/youzan.png';

  public static getSourcePicture(orderSource: number): string {
    if (orderSource === OrderSource.Tenant) return SourcePictureHelper.Tenant;
    else if (orderSource === OrderSource.FxgAd) return SourcePictureHelper.Toutiao;
    else if (orderSource === OrderSource.FxgPd) return SourcePictureHelper.Toutiao;
    else if (orderSource === OrderSource.YouZan) return SourcePictureHelper.Youzan;
    else return SourcePictureHelper.Self;
  }
}
