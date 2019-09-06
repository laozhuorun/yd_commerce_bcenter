import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
  Injector,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { STColumn } from '@delon/abc';
import { getTimeDistance } from '@delon/util';
import { _HttpClient } from '@delon/theme';
import { I18NService } from '@core';
import { yuan, AppSessionService } from '@shared';
import { AppComponentBase } from '@shared/app-component-base';
import {
  CommonStatisticsDto,
  CommonStatisticServiceProxy,
  AdvertStatisticServiceProxy,
  DailyStatisticItemDto,
  SaleStatisticServiceProxy,
  CatelogSaleStatisticDto,
  CatelogDateSaleStatisticDto,
  Period,
  UserLoginInfoDto,
  TenantLoginInfoDto,
} from '@shared/service-proxies/service-proxies';
import { CommonHelper } from '@shared/helpers/CommonHelper';
import { format } from 'date-fns';
import { Periods } from '@shared/consts/enum-consts';

@Component({
  selector: 'app-dashboard-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardAnalysisComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @ViewChild('catelogLineChart') catelogLineChart: ElementRef;
  today: CommonStatisticsDto = new CommonStatisticsDto();
  yesterday: CommonStatisticsDto = new CommonStatisticsDto();
  commonStatistics: CommonStatisticsDto[];
  monthStatistics: CommonStatisticsDto = new CommonStatisticsDto();
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

  titleMap = {
    y1: this.l('app.analysis.day-sales'),
    y2: this.l('app.analysis.advert-cost'),
  };

  chart;
  chartloading = false;
  chartData: any[] = [];
  chartOfflineIdx = 0;
  chartSaleTotal = 0;

  loading = true;
  date_range: Date[] = [];
  user: UserLoginInfoDto;
  tenant: TenantLoginInfoDto;

  friendlyTime;

  constructor(
    injector: Injector,
    public msg: NzMessageService,
    private commonStatisticSvc: CommonStatisticServiceProxy,
    private advertStatisticSvc: AdvertStatisticServiceProxy,
    private saleStatisticSvc: SaleStatisticServiceProxy,
    public appSessionSvc: AppSessionService,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.user = this.appSessionSvc.user;
    this.tenant = this.appSessionSvc.tenant;

    this.date_range = getTimeDistance(-6);
    this.getCommonStatistic();
    this.getMonthCommonStatistic();
    this.getAdvertStatistic();
    this.friendlyTime = this.getFriendlyTime();
  }

  ngAfterViewInit() {
    this.initLineChart();
    this.getSaleStatisticLineChartData();
  }

  getCommonStatistic() {
    this.commonStatisticSvc
      .getAll(this.date_range[0], this.date_range[1])
      .subscribe((result: CommonStatisticsDto[]) => {
        this.today = result[0];
        this.yesterday = result[1] || new CommonStatisticsDto();
        this.commonStatistics = result;
        this.orderTotalRate =
          this.yesterday.orderNum === 0 ? this.today.orderTotal : this.today.orderTotal / this.yesterday.orderTotal - 1;
        this.orderNumberlRate =
          this.yesterday.orderNum === 0 ? this.today.orderNum : this.today.orderNum / this.yesterday.orderNum - 1;
        this.todayShipmentRate =
          this.today.orderNum === 0
            ? this.today.shipmentNum
            : Math.floor((this.today.shipmentNum / this.today.orderNum) * 10000) / 100;
        this.shipmentAddRate =
          this.yesterday.shipmentNum === 0
            ? this.today.shipmentNum
            : this.today.shipmentNum / this.yesterday.shipmentNum - 1;

        this.advertCopstAddRate =
          this.yesterday.advertCost === 0
            ? this.today.advertCost
            : this.today.advertCost / this.yesterday.advertCost - 1;

        this.cd();
      });
  }

  getMonthCommonStatistic() {
    this.commonStatisticSvc.getPeriodData(Periods.Week).subscribe((result: CommonStatisticsDto) => {
      this.monthStatistics = result;
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
      this.advertStat.total = advertData.length === 0 ? 0 : this.advertData.reduce((pre, now) => now.y + pre, 0);
      this.advertStat.t1 = advertData.length === 0 ? 0 : advertData[Math.floor(advertData.length / 2)].x;
      this.advertStat.t2 = advertData.length === 0 ? 0 : advertData[advertData.length - 1].x;
      this.cd();
    });
  }

  getSaleStatisticLineChartData() {
    const self = this;
    this.chartloading = true;
    this.saleStatisticSvc
      .getCatelogSaleStatistics(this.date_range[0], this.date_range[1])
      .subscribe((result: CatelogSaleStatisticDto[]) => {
        this.chartData = [];
        result.forEach((resultItem: CatelogSaleStatisticDto, idx: number) => {
          this.chartSaleTotal += resultItem.orderTotal;
          this.chartData.push({
            name: resultItem.product,
            orderTotal: resultItem.orderTotal,
            show: idx === 0,
            data: this.prepareLineChartDateItem(resultItem.items),
          });
        });

        this.chartloading = false;
        this.changeLineChartDateSource(this.chartData[0].data);
      });
  }

  initLineChart() {
    const self = this;
    this.chart = new G2.Chart({
      container: 'catelog-line-chart', // 指定图表容器 ID
      forceFit: true,
      height: 400, // 指定图表高度
      padding: [100, 20, 30, 45], // 上右下左
    });

    this.chart.tooltip({
      follow: false,
      crosshairs: 'y',
      htmlContent: function htmlContent(title, items) {
        const alias = {
          orderNum: self.l('app.analysis.order'),
          shipmentNum: self.l('app.analysis.shipment'),
          orderTotal: self.l('app.analysis.day-sales'),
          shipmentTotal: self.l('app.analysis.shipment-total'),
          advertCost: self.l('app.analysis.advert-cost'),
        };
        let html = '<div class="custom-tooltip">';
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const color = item.color;
          const name = alias[item.name];
          const value = item.value;
          const domHead = '<div class="custom-tooltip-item" style="border-left-color:' + color + '">';
          const domName = '<div class="custom-tooltip-item-name">' + name + '</div>';
          const domValue = '<div class="custom-tooltip-item-value">' + value + '</div>';
          const domTail = '</div>';
          html += domHead + domName + domValue + domTail;
        }
        return html + '</div>';
      },
    });

    this.chart.axis('date', {
      label: {
        textStyle: {
          fill: '#aaaaaa',
        },
      },
    });

    this.chart.axis('value', {
      label: {
        textStyle: {
          fill: '#aaaaaa',
        },
        formatter: function formatter(text) {
          return text.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        },
      },
    });

    this.chart.legend(false);
    this.chart
      .line()
      .position('date*value')
      .color('type');
    this.chart.render();
    this.chart.showTooltip({
      x: this.catelogLineChart.nativeElement.offsetWidth - 20,
      y: 100,
    });

    this.cd();
  }

  getSalePercent(orderTotal: number) {
    return Math.floor((orderTotal / this.chartSaleTotal) * 10000) / 100;
  }

  sortby(a, b) {
    return a.y - b.y;
  }

  getOrderNumTrend(): any[] {
    const orderTrendData: any[] = [];

    this.commonStatistics.forEach(cs => {
      orderTrendData.push({
        x: format(cs.statisticsOn, 'YYYY-MM-DD'),
        y: cs.orderNum,
      });
    });

    return orderTrendData;
  }

  getFlag(data: number): string {
    if (data > 0) {
      return 'up';
    } else {
      return 'down';
    }
  }

  setDate(type: any) {
    this.date_range = getTimeDistance(type);
    this.cd();
  }

  handlePieValueFormat(value: any) {
    return yuan(value);
  }

  saleTabs: any[] = [{ key: 'sales', show: true }, { key: 'visits' }];
  salesChange(idx: number) {
    if (this.saleTabs[idx].show !== true) {
      this.saleTabs[idx].show = true;
      this.cd();
    }
  }

  offlineChange(idx: number) {
    if (this.chartData[idx].show !== true) {
      this.chartData.forEach((item, i: number) => {
        if (i === idx) item.show = true;
        else item.show = false;
      });
      this.changeLineChartDateSource(this.chartData[idx].data);
    }
  }

  changeLineChartDateSource(dataSource) {
    this.chart.source(dataSource);
    this.chart.render();

    this.cd();

    this.chart.showTooltip({
      x: this.catelogLineChart.nativeElement.offsetWidth - 20,
      y: 100,
    });
  }

  prepareChartDateItem(dateItems: CatelogDateSaleStatisticDto[]) {
    const chartDateItemArray = [];
    dateItems.forEach((item: CatelogDateSaleStatisticDto) => {
      chartDateItemArray.push({
        x: new Date(Date.parse(item.dateOn.replace(/-/g, '/'))),
        y1: item.orderTotal,
        y2: item.shipmentNum,
        y3: item.orderTotal,
        y4: item.shipmentTotal,
        y5: item.advertCost,
      });
    });
    return chartDateItemArray;
  }

  prepareLineChartDateItem(dateItems: CatelogDateSaleStatisticDto[]) {
    const chartDateItemArray = [];
    dateItems.forEach((item: CatelogDateSaleStatisticDto) => {
      chartDateItemArray.push({
        date: item.dateOn,
        type: 'orderNum',
        value: item.orderNum,
      });

      chartDateItemArray.push({
        date: item.dateOn,
        type: 'shipmentNum',
        value: item.shipmentNum,
      });

      chartDateItemArray.push({
        date: item.dateOn,
        type: 'orderTotal',
        value: item.orderTotal,
      });

      chartDateItemArray.push({
        date: item.dateOn,
        type: 'shipmentTotal',
        value: item.shipmentTotal,
      });

      chartDateItemArray.push({
        date: item.dateOn,
        type: 'advertCost',
        value: item.advertCost,
      });
    });
    return chartDateItemArray;
  }

  getFriendlyTime() {
    const now = new Date();
    const hour = now.getHours();
    if (hour < 6) {
      return '凌晨好!';
    } else if (hour < 9) {
      return '早上好!';
    } else if (hour < 12) {
      return '上午好!';
    } else if (hour < 14) {
      return '中午好!';
    } else if (hour < 17) {
      return '下午好!';
    } else if (hour < 19) {
      return '傍晚好!';
    } else if (hour < 22) {
      return '晚上好!';
    } else {
      return '夜里好!';
    }
  }

  private cd() {
    // wait checkbox
    setTimeout(() => this.cdr.detectChanges());
  }
}
