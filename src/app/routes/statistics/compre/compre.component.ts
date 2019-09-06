import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';

import {
  SelectListItemDtoOfInt32,
  CommonLookupServiceProxy,
  AdvertStatisticServiceProxy,
  DailyStatisticDto,
  AdvertAccountServiceProxy,
  SelectListItemDtoOfInt64,
  ProductServiceProxy,
  SaleStatisticServiceProxy,
  DateSaleStatisticDto,
} from '@shared/service-proxies/service-proxies';
import { STChange, STColumn, STComponent, STData, STPage, STStatistical } from '@delon/abc';
import { CNCurrencyPipe } from '@delon/theme';
import { EnumConsts, SelectCacheKey } from '@shared/consts/enum-consts';
import { SourcePictureHelper } from '@shared/consts/static-source';
import { ListComponentBase } from '@shared/app-component-base';
import { CacheService } from '@delon/cache';
import { AppConsts } from '@shared/consts/app-consts';
import { finalize, concatMap } from 'rxjs/operators';
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';

import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-compre-statistics',
  templateUrl: './compre.component.html',
  styleUrls: ['./compre.component.less'],
})
export class ComprehensiveStatisticsComponent extends ListComponentBase implements OnInit {
  self;
  q: any = {
    accountId: undefined,
    productIds: [],
    source: undefined,
    dateOn: {
      form: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    },
    // dateOn: [startOfMonth(new Date()), endOfMonth(new Date())],
  };
  advertSource = [];
  advertAccounts = [];
  productSelectData = [];
  expandForm = false;

  data;
  @ViewChild('st')
  st: STComponent;

  columns: STColumn[] = [
    { title: '统计日期', index: '_dateOn', fixed: 'left', width: '100px' },
    { title: '订单数', index: 'orderNum', render: 'orderNum-tag', fixed: 'left', width: '80px' },
    { title: '销售额', index: 'orderTotal', type: 'currency', fixed: 'left', width: '100px' },
    { title: '广告消耗', index: 'advertCost', type: 'currency', fixed: 'left', width: '100px' },
    {
      title: 'ROI',
      index: 'roi',
      render: 'roi-tag',
      fixed: 'left',
      width: '50px',
      className: 'text-right',
    },
    { title: '转化成本', index: 'transformCost', fixed: 'left', width: '100px', className: 'text-right' },
    {
      title: '发货数(未发数)',
      index: 'shipmentNum',
      render: 'shipmentNum-tag',
      fixed: 'left',
      width: '140px',
      className: 'text-right',
    },
    {
      title: '签收数',
      index: 'receivedNum',
      // render: 'receivedNum-tag',
      fixed: 'left',
      width: '80px',
      className: 'text-right',
    },
    {
      title: '签收率',
      index: 'receivedRate',
      fixed: 'left',
      width: '80px',
      render: 'receivedRate-tag',
      className: 'text-right',
    },
    { title: '签收成本', index: 'receivedCost', width: '80px', type: 'currency' },
    { title: '签收金额', index: 'receivedTotal', width: '80px', type: 'currency' },
    {
      title: '拒收数',
      index: 'rejectNum',
      width: '80px',
      // render: 'rejectNum-tag',
      className: 'text-right',
    },
    { title: '拒收金额', index: 'rejectTotal', width: '80px', type: 'currency' },
    { title: '成本利润率', index: 'costProfitRate', width: '100px', className: 'text-right' },
    { title: '货物成本', index: 'goodsCost', width: '80px', type: 'currency' },
    { title: '物流成本', index: 'shipmentCost', width: '80px', type: 'currency' },
    { title: '平台佣金', index: 'rewardAmount', width: '80px', type: 'currency' },
    { title: '总成本', index: 'totalCost', type: 'currency', width: '100px' },
    { title: '毛利润', index: 'profit', type: 'currency', render: 'profit-tag', fixed: 'right', width: '100px' },
  ];

  stPage: STPage = {
    show: false,
    front: false,
  };

  selectedRows: STData[] = [];
  totalCallNo = 0;

  constructor(
    injector: Injector,
    public msg: NzMessageService,
    private saleStatisticSvc: SaleStatisticServiceProxy,
    private productSvc: ProductServiceProxy,
    private cacheSvc: CacheService,
    private enumsSvc: CommonLookupServiceProxy,
    private currency: CNCurrencyPipe,
    private datePipe: DatePipe,
  ) {
    super(injector);
    this.self = this;
    // this.q.dateOn.form = startOfMonth(new Date());
    // this.q.dateOn.to = endOfMonth(new Date());
  }

  ngOnInit() {
    this.getSelectDataSource();
    this.getData();
  }

  getSelectDataSource() {
    this.cacheSvc
      .tryGet<SelectListItemDtoOfInt32[]>(
        EnumConsts.OrderSource,
        this.enumsSvc.getEnumSelectItem(EnumConsts.OrderSource),
      )
      .subscribe(res => {
        this.advertSource = res;
      });

    this.cacheSvc
      .tryGet<SelectListItemDtoOfInt64[]>(AppConsts.CacheKey.ProductSelectData, this.productSvc.getProductSelectList())
      .subscribe(res => {
        this.productSelectData = res;
      });
  }

  getData() {
    this.loading = true;
    this.saleStatisticSvc
      .getSaleStatistics(
        this.q.source,
        this.q.productIds,
        undefined,
        this.q.dateOn.form === undefined ? undefined : startOfDay(this.q.dateOn.form),
        this.q.dateOn.to === undefined ? undefined : endOfDay(this.q.dateOn.to),
      )
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe(res => {
        var formatResult;

        formatResult = res;
        formatResult.forEach(i => {
          i._dateOn = this.dateFormat(i);
          i.totalCost = i.advertCost + i.goodsCost + i.shipmentCost + i.rewardAmount;
          i.profit = i.receivedTotal - i.totalCost;
          i.roi = this.getRoi(i);
          i.transformCost = this.getTransformCost(i);
          i.receivedRate = this.getReceivedRate(i);
          i.receivedCost = this.getReceivedCost(i);
          i.costProfitRate = this.getCostProfitRate(i);
        });

        formatResult.push(this.getstatistics(formatResult));
        this.data = formatResult;
        this.cdRefresh();
      });
  }

  stChange(e: STChange) {
    switch (e.type) {
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
   * 格式化列值
   */
  clickRateFormat(item: STData, col: STColumn): string {
    return Math.floor((item.totalCost / item.displayNum) * 10000) / 100 + '%';
  }

  /**
   * 格式化列值
   */
  dateFormat(item: STData): string {
    return this.datePipe.transform(item.dateOn, 'yyyy/MM/dd');
  }

  getSourcePicture(orderSource: number): string {
    return SourcePictureHelper.getSourcePicture(orderSource);
  }

  dateOn(e) {
    const startDate = startOfDay(e[0]);
    this.q.dateOn[0] = startDate;

    const endDate = endOfDay(e[1]);
    this.q.dateOn[1] = endDate;
  }

  // 转化成本
  getTransformCost(item) {
    if (item.shipmentNum === 0 || item.orderNum === 0) {
      return -item.advertCost;
    } else if (item.advertCost === 0) {
      return 0;
    } else {
      return Math.floor((item.advertCost / item.shipmentNum) * 100) / 100;
    }
  }

  getRoi(item) {
    if (item.advertCost === 0) {
      return item.orderTotal;
    } else {
      return Math.floor((item.orderTotal / item.advertCost) * 100) / 100;
    }
  }

  getReceivedRate(item) {
    if (item.receivedNum === 0 || item.advertCost === 0) {
      return 0;
    } else {
      return Math.floor((item.receivedNum / item.shipmentNum) * 100) / 100;
    }
  }

  getReceivedCost(item) {
    if (item.advertCost === 0 || item.receivedNum === 0) {
      return 0;
    } else {
      return Math.floor((item.advertCost / item.receivedNum) * 100) / 100;
    }
  }

  getCostProfitRate(item) {
    if (item.totalCost === 0) {
      return item.profit;
    } else if (item.profit === 0) {
      return 0;
    } else {
      return Math.floor((item.profit / item.totalCost) * 10000) / 100 + '%';
    }
  }

  getStatisticRoi(): STStatistical {
    return {
      type: (values: number[], col: STColumn, list: STData[], rawData?: any) => {
        let orderTotal = 0;
        let advertCost = 0;
        let roi = 0;
        list.forEach(item => {
          orderTotal += item.orderTotal;
          advertCost += item.advertCost;
        });

        if (advertCost === 0 || orderTotal === 0) {
          roi = 0;
        } else {
          roi = Math.floor((orderTotal / advertCost) * 100) / 100;
        }

        return { value: roi, text: `${roi}` };
      },
      digits: 2,
      /**
       * 是否需要货币格式化，默认以下情况为 `true`
       * - `type` 为 `STStatisticalFn`、 `sum`、`average`、`max`、`min`
       */
      currency: false,
    };
  }

  getstatistics(datas) {
    const statistic = {
      _dateOn: '合计',
      orderNum: 0,
      orderTotal: 0,
      advertCost: 0,
      shipmentNum: 0,
      shipmentTotal: 0,
      receivedNum: 0,
      receivedCost: 0,
      receivedTotal: 0,
      rejectNum: 0,
      rejectTotal: 0,
      goodsCost: 0,
      shipmentCost: 0,
      rewardAmount: 0,
      totalCost: 0,
      profit: 0,
      roi: 0,
      transformCost: 0,
      receivedRate: 0,
      costProfitRate: '',
    };
    // statistic.dateOn = '合计';

    datas.forEach(item => {
      statistic.orderNum += item.orderNum;
      statistic.orderTotal += item.orderTotal;
      statistic.advertCost += item.advertCost;
      statistic.shipmentNum += item.shipmentNum;
      statistic.shipmentTotal += item.shipmentTotal;
      statistic.receivedNum += item.receivedNum;
      statistic.receivedCost += item.receivedCost;
      statistic.receivedTotal += item.receivedTotal;
      statistic.rejectNum += item.rejectNum;
      statistic.rejectTotal += item.rejectTotal;
      statistic.goodsCost += item.goodsCost;
      statistic.shipmentCost += item.shipmentCost;
      statistic.rewardAmount += item.rewardAmount;
      statistic.totalCost += item.totalCost;
      statistic.profit += item.profit;
    });

    if (statistic.advertCost === 0 || statistic.orderTotal === 0) {
      statistic.roi = 0;
    } else {
      statistic.roi = Math.floor((statistic.orderTotal / statistic.advertCost) * 100) / 100;
    }

    if (statistic.shipmentNum === 0) {
      statistic.transformCost = -statistic.advertCost;
    } else if (statistic.advertCost === 0) {
      statistic.transformCost = 0;
    } else {
      statistic.transformCost = Math.floor((statistic.advertCost / statistic.shipmentNum) * 100) / 100;
    }

    if (statistic.receivedNum === 0 || statistic.advertCost === 0) {
      statistic.receivedRate = 0;
    } else {
      statistic.receivedRate = Math.floor((statistic.receivedNum / statistic.shipmentNum) * 100) / 100;
    }

    if (statistic.totalCost === 0) {
      statistic.costProfitRate = statistic.profit + '%';
    } else if (statistic.profit === 0) {
      statistic.costProfitRate = 0 + '%';
    } else {
      statistic.costProfitRate = Math.floor((statistic.profit / statistic.totalCost) * 10000) / 100 + '%';
    }

    return statistic;
  }
}
