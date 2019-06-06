import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, Injector } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { STColumn } from '@delon/abc';
import { getTimeDistance } from '@delon/util';
import { _HttpClient } from '@delon/theme';
import { I18NService } from '@core';
import { yuan } from '@shared';
import { AppComponentBase } from '@shared/app-component-base';
import {
  CommonStatisticsDto,
  CommonStatisticServiceProxy,
  AdvertStatisticServiceProxy,
  DailyStatisticItemDto,
} from '@shared/service-proxies/service-proxies';
import { CommonHelper } from '@shared/helpers/CommonHelper';
import { format } from 'date-fns';

@Component({
  selector: 'app-dashboard-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardAnalysisComponent extends AppComponentBase implements OnInit {
  today: CommonStatisticsDto = new CommonStatisticsDto();
  yesterday: CommonStatisticsDto = new CommonStatisticsDto();
  commonStatistics: CommonStatisticsDto[];
  orderTotalRate = 0;
  orderNumberlRate = 0;
  todayShipmentRate = 0;
  shipmentAddRate = 0;
  advertCopstAddRate = 0;
  advertData: any[];
  advertStat = {
    total: 0,
    t1: '',
    t2: '',
  };

  loading = true;
  date_range: Date[] = [];

  constructor(
    injector: Injector,
    public msg: NzMessageService,
    private i18n: I18NService,
    private cdr: ChangeDetectorRef,
    private commonStatisticSvc: CommonStatisticServiceProxy,
    private advertStatisticSvc: AdvertStatisticServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.date_range = getTimeDistance(-6);
    this.getCommonStatistic();
    this.getAdvertStatistic();
  }

  getCommonStatistic() {
    this.commonStatisticSvc
      .getAll(this.date_range[0], this.date_range[1])
      .subscribe((result: CommonStatisticsDto[]) => {
        this.today = result[0];
        this.yesterday = result[1] || new CommonStatisticsDto();
        this.commonStatistics = result;
        this.orderTotalRate =
          this.yesterday.numberOfOrders === 0
            ? this.today.totalOfOrders
            : this.today.totalOfOrders / this.yesterday.totalOfOrders - 1;
        this.orderNumberlRate =
          this.yesterday.numberOfOrders === 0
            ? this.today.numberOfOrders
            : this.today.numberOfOrders / this.yesterday.numberOfOrders - 1;
        this.todayShipmentRate =
          this.today.numberOfOrders === 0
            ? this.today.numberOfShipped
            : Math.floor((this.today.numberOfShipped / this.today.numberOfOrders) * 10000) / 100;
        this.shipmentAddRate =
          this.yesterday.numberOfShipped === 0
            ? this.today.numberOfShipped
            : this.today.numberOfShipped / this.yesterday.numberOfShipped - 1;

        this.advertCopstAddRate = this.today.costOfAdvert / this.yesterday.costOfAdvert - 1;
        this.cdr.detectChanges();
      });
  }

  getAdvertStatistic() {
    this.advertStatisticSvc.getHourStatistics(this.date_range[1]).subscribe((result: DailyStatisticItemDto[]) => {
      const advertData: any[] = [];

      result.forEach(cs => {
        advertData.push({
          x: `${cs.hourOfDay.toString().padStart(2, '0')}:00`,
          y: cs.totalCost,
        });

        this.advertData = advertData;
      });

      // stat
      this.advertStat.total = advertData.length === 0 ? 0 : [...advertData].sort(this.sortby)[advertData.length - 1].y;
      this.advertStat.t1 = advertData.length === 0 ? 0 : advertData[Math.floor(advertData.length / 2)].x;
      this.advertStat.t2 = advertData.length === 0 ? 0 : advertData[advertData.length - 1].x;
      this.cdr.detectChanges();
    });
  }

  sortby(a, b) {
    return a.y - b.y;
  }

  getOrderNumTrend(): any[] {
    const orderTrendData: any[] = [];

    this.commonStatistics.forEach(cs => {
      orderTrendData.push({
        x: format(cs.statisticsOn, 'YYYY-MM-DD'),
        y: cs.numberOfOrders,
      });
    });

    return orderTrendData;
  }

  // get password() {
  //   return this.form.controls.password;
  // }
  getFlag(data: number): string {
    if (data > 0) {
      return 'up';
    } else {
      return 'down';
    }
  }

  setDate(type: any) {
    this.date_range = getTimeDistance(type);
    setTimeout(() => this.cdr.detectChanges());
  }

  handlePieValueFormat(value: any) {
    return yuan(value);
  }

  saleTabs: any[] = [{ key: 'sales', show: true }, { key: 'visits' }];
  salesChange(idx: number) {
    if (this.saleTabs[idx].show !== true) {
      this.saleTabs[idx].show = true;
      this.cdr.detectChanges();
    }
  }
}
