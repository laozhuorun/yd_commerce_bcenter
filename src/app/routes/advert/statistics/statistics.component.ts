import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { NzMessageService, NzModalService } from 'ng-zorro-antd';

import {
  SelectListItemDtoOfInt32,
  CommonLookupServiceProxy,
  AdvertStatisticServiceProxy,
  DailyStatisticDto,
  AdvertAccountServiceProxy,
  SelectListItemDtoOfInt64,
  ProductServiceProxy,
  TenantInfoServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { STChange, STColumn, STComponent, STData, STChangeRowClick, STPage, STColumnTag } from '@delon/abc';
import { CNCurrencyPipe, SettingsService } from '@delon/theme';
import { EnumConsts, SelectCacheKey } from '@shared/consts/enum-consts';
import { SourcePictureHelper } from '@shared/consts/static-source';
import { ListComponentBase } from '@shared/app-component-base';
import { CacheService } from '@delon/cache';
import { AppConsts } from '@shared/consts/app-consts';
import { finalize, concatMap } from 'rxjs/operators';
import { startOfDay, endOfDay } from 'date-fns';
import { AppSessionService } from '@shared/service/app-session.service';

@Component({
  selector: 'app-advert-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.less'],
})
export class AdvertStatisticsComponent extends ListComponentBase implements OnInit {
  self;
  q: any = {
    accountId: undefined,
    productIds: [],
    source: undefined,
    dateOn: {
      form: undefined,
      to: undefined,
    },
  };
  advertSource = [];
  advertAccounts = [];
  productSelectData = [];
  expandForm = false;

  data;
  @ViewChild('st')
  st: STComponent;

  columns: STColumn[] = [
    { title: '统计日期', index: 'dateOn', type: 'date', dateFormat: 'YYYY-MM-DD', fixed: 'left' },
    { title: '账户', index: 'advertAccount', width: '15%' },
    { title: '商品', index: 'productName', width: '15%' },
    { title: '展示数', index: 'displayNum', width: '5%' },
    { title: '点击数', index: 'clickNum', width: '5%' },
    { title: '点击率', index: 'clickRate', format: this.clickRateFormat, width: '5%' },
    { title: '平均点击单价', index: 'clickPrice', type: 'currency', width: '8%' },
    { title: '平均千次展现费用', index: 'thDisplayCost', type: 'currency', width: '10%' },
    { title: '下单量', index: 'convertNum', width: '6%', className: 'text-right', render: 'convertNum-tag' },
    { title: '下单成本', index: 'transformCost', type: 'currency', width: '6%', render: 'transformCost-tag' },
    { title: '合计消耗', index: 'totalCost', type: 'currency', width: '6%', render: 'totalCost-tag' },
  ];
  itemColumns: STColumn[] = [
    { title: '时间', index: 'hourOfDay', format: this.hourFormat },
    { title: '下单量', index: 'convertNum' },
    { title: '下单成本', index: 'transformCost', type: 'currency' },
    { title: '展示数', index: 'displayNum' },
    { title: '点击数', index: 'clickNum' },
    { title: '点击率', index: 'clickRate', format: this.clickRateFormat },
    { title: '平均点击单价', index: 'clickPrice', type: 'currency', width: '10%' },
    { title: '平均千次展现费用', index: 'thDisplayCost', type: 'currency', width: '10%' },
    { title: '合计消耗', index: 'totalCost', type: 'currency', width: '10%' },
  ];

  stPage: STPage = {
    front: false,
    showSize: true,
    pageSizes: this.page.pageSizeOptions,
    showQuickJumper: true,
    total: '{{range[0]}}-{{range[1]}} 共 {{total}} 条数据',
  };

  selectedRows: STData[] = [];
  totalCallNo = 0;

  constructor(
    injector: Injector,
    public msg: NzMessageService,
    private advertAccountSvc: AdvertAccountServiceProxy,
    private advertStatisticSvc: AdvertStatisticServiceProxy,
    private productSvc: ProductServiceProxy,
    private cacheSvc: CacheService,
    private enumsSvc: CommonLookupServiceProxy,
    private currency: CNCurrencyPipe,
  ) {
    super(injector);
    this.self = this;
  }

  ngOnInit() {
    this.getSelectDataSource();
    this.getData();
  }

  getSelectDataSource() {
    this.cacheSvc
      .tryGet<SelectListItemDtoOfInt32[]>(
        EnumConsts.AdvertChannel,
        this.enumsSvc.getEnumSelectItem(EnumConsts.AdvertChannel),
      )
      .subscribe(res => {
        this.advertSource = res;
      });

    this.cacheSvc
      .tryGet<SelectListItemDtoOfInt32[]>(
        AppConsts.CacheKey.AdvertAccount,
        this.advertAccountSvc.getAccountSelectList(),
      )
      .subscribe(res => {
        this.advertAccounts = res;
      });

    this.cacheSvc
      .tryGet<SelectListItemDtoOfInt64[]>(AppConsts.CacheKey.ProductSelectData, this.productSvc.getProductSelectList())
      .subscribe(res => {
        this.productSelectData = res;
      });
  }

  getData() {
    this.loading = true;
    this.advertStatisticSvc
      .getDailyStatistics(
        this.q.source,
        this.q.productIds,
        this.q.accountId,
        this.q.dateOn.form === undefined ? undefined : startOfDay(this.q.dateOn.form),
        this.q.dateOn.to === undefined ? undefined : endOfDay(this.q.dateOn.to),
        this.page.sorting,
        this.page.pageSize,
        this.page.skipCount,
      )
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe(res => {
        this.data = res;
        this.data.items.forEach(i => ((i.showExpand = true), (i.transformCost = this.transformCost(i))));
        this.cdRefresh();
      });
  }

  itemExpand(e: STChange) {
    if (e.expand.expand === false) return;

    this.advertStatisticSvc.getDailyStatisticItems(e.expand.id).subscribe(res => {
      e.expand.items = res;
      e.expand.items.forEach(i => (i.transformCost = this.transformCost(i)));
    });
  }

  stChange(e: STChange) {
    switch (e.type) {
      case 'expand':
        this.itemExpand(e);
        this.cdRefresh();
        break;
      case 'filter':
        this.getData();
        break;
      case 'pi':
        this.page.index = e.pi;
        this.getData();
        break;
      case 'ps':
        this.page.pageSize = e.ps;
        this.getData();
        break;
    }
  }

  remove(ids) {}

  reset() {
    // wait form reset updated finished
    setTimeout(() => this.getData());
  }

  /**
   * 格式化列值
   */
  hourFormat(item: STData, col: STColumn): string {
    if (item.hourOfDay < 10) return abp.utils.formatString('0{0}:00 - 0{1}:59', item.hourOfDay, item.hourOfDay);
    else return abp.utils.formatString('{0}:00 - {1}:59', item.hourOfDay, item.hourOfDay);
  }

  /**
   * 点击率
   */
  clickRateFormat(item: STData, col: STColumn): string {
    return Math.floor((item.totalCost / item.displayNum) * 10000) / 100 + '%';
  }

  /**
   * 下单成本
   */
  transformCost(item) {
    if (item.convertNum === '0' || item.convertNum === 0) return 0;
    return Math.floor((item.clickNum / item.convertNum) * 100) / 100;
  }

  getSourcePicture(orderSource: number): string {
    return SourcePictureHelper.getSourcePicture(orderSource);
  }

  dateOn(e) {
    const startDate = startOfDay(e[0]);
    this.q.date.form = startDate;

    const endDate = endOfDay(e[1]);
    this.q.date.to = endDate;
  }
}
