import { Component, OnInit, ChangeDetectorRef, Injector } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  CommonLookupServiceProxy,
  OrderServiceProxy,
  StateServiceProxy,
  SelectListItemDtoOfInt32,
  PagedResultDtoOfOrderListDto,
} from '@shared/service-proxies/service-proxies';
import { _HttpClient, DrawerHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { OrderListViewComponent } from './view.component';

import { OrderListShippingComponent } from './shipping.component';
import { CacheService } from '@delon/cache';
import { EnumConsts, OrderStatus, ShippingStatus } from '@shared/consts/enum-consts';
import { SFSchema } from '@delon/form';
import { AppComponentBase } from '@shared/app-component-base';
import { PaginationBaseDto } from '@shared/utils/pagination.dto';
import { AppConsts } from '@shared/consts/app-consts';
import { SourcePictureHelper } from '@shared/consts/static-source';

let that;

@Component({
  selector: 'app-order-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less'],
})
export class OrderListComponent extends AppComponentBase implements OnInit {
  data;
  loading = false;
  page: PaginationBaseDto = new PaginationBaseDto(AppConsts.grid.defaultPageSize);
  isAllChecked = false;
  isIndeterminate = true;
  checkedId = [];
  numberOfChecked = 0;

  enums = {
    OrderSource: [],
    OrderStatus: [],
    OrderType: [],
    PaymentStatus: [],
    ShippingStatus: [],
  };

  tabs: any[] = [
    {
      key: 'all',
      tab: '所有',
    },
    {
      key: 'wait-confirm',
      tab: '待确认',
    },
    {
      key: 'wait-ship',
      tab: '待发货',
    },
    {
      key: 'shipped',
      tab: '已发货',
    },
    {
      key: 'return',
      tab: '退货中',
    },
  ];

  tabsStatus = 0;
  expandForm = false;

  constructor(
    injector: Injector,
    private http: _HttpClient,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private drawer: DrawerHelper,
    private stateSvc: StateServiceProxy,
    private enumsSvc: CommonLookupServiceProxy,
    private orderSvc: OrderServiceProxy,
    private cacheSvc: CacheService,
    private cdr: ChangeDetectorRef,
  ) {
    super(injector);
    that = this;
  }

  address;
  searchForm: FormGroup;

  ngOnInit() {
    this.searchForm = new FormGroup({
      productIds: new FormControl([], []),
      storeIds: new FormControl('', []),
      logisticsNumber: new FormControl('', []),
      orderNumber: new FormControl('', []),
      createOn_FormDate: new FormControl('', []),
      createOn_ToDate: new FormControl('', []),
      receiveOn_FormDate: new FormControl('', []),
      receiveOn_ToDate: new FormControl('', []),
      shippingName: new FormControl('', []),
      phoneNumber: new FormControl('', []),
      provinceId: new FormControl('', []),
      cityId: new FormControl('', []),
      districtId: new FormControl('', []),
      orderStatus: new FormControl([], []),
      paymentStatus: new FormControl([], []),
      shippingStatus: new FormControl([], []),
      orderTypes: new FormControl([], []),
      orderSource: new FormControl([], []),
      adminComment: new FormControl('', []),
      customerComment: new FormControl('', []),
    });
    this.getData();

    this.getEnums([
      EnumConsts.OrderSource,
      EnumConsts.OrderStatus,
      EnumConsts.OrderType,
      EnumConsts.PaymentStatus,
      EnumConsts.ShippingStatus,
    ]);
  }

  getEnums(enumNames) {
    enumNames.forEach(enumName => {
      this.cacheSvc
        .tryGet<SelectListItemDtoOfInt32[]>(enumNames, this.enumsSvc.getEnumSelectItem(enumName))
        .subscribe(res => {
          res.forEach((item, index) => {
            this.enums[enumName].push({
              index: index,
              text: item.text,
              value: item.value,
              type: 'default',
              checked: false,
            });
          });
        });
    });
  }

  filterChange(target, e) {
    this.searchForm.get(target).setValue(e);
    this.getData();
  }

  checkAll(value: boolean): void {
    this.isIndeterminate = false;
    this.data.items.forEach(item => (this.checkedId[item.id] = value));
    this.refreshStatus();
    this.cdr.detectChanges();
  }

  refreshStatus(): void {
    this.isAllChecked = this.data.items.every(item => this.checkedId[item.id]);
    this.isIndeterminate =
      this.data.items.filter(item => !item.disabled).some(item => this.checkedId[item.id]) && !this.isAllChecked;
    this.numberOfChecked = this.data.items.filter(item => this.checkedId[item.id]).length;
  }

  choose(i: number) {
    this.refreshStatus();
    this.cd();
    // this.checkedId[i] = !this.checkedId[i];
    // this.cd();
  }

  getData() {
    this.loading = true;
    this.orderSvc
      .getOrders(
        this.searchForm.get('logisticsNumber').value,
        this.searchForm.get('receiveOn_FormDate').value,
        this.searchForm.get('receiveOn_ToDate').value,
        this.searchForm.get('orderStatus').value,
        this.searchForm.get('paymentStatus').value,
        this.searchForm.get('shippingStatus').value,
        this.searchForm.get('storeIds').value,
        this.searchForm.get('productIds').value,
        this.searchForm.get('orderNumber').value,
        this.searchForm.get('createOn_FormDate').value,
        this.searchForm.get('createOn_ToDate').value,
        this.searchForm.get('shippingName').value,
        this.searchForm.get('phoneNumber').value,
        this.searchForm.get('provinceId').value,
        this.searchForm.get('cityId').value,
        this.searchForm.get('districtId').value,
        this.searchForm.get('orderTypes').value,
        this.searchForm.get('orderSource').value,
        this.searchForm.get('adminComment').value,
        this.searchForm.get('customerComment').value,
        this.page.sorting,
        this.page.pageSize,
        this.page.getSkipCount(),
      )
      .subscribe(res => {
        this.loading = false;
        this.data = res;
        this.cdr.detectChanges();
      });
  }

  createOn(e) {
    this.searchForm.get('createOn_FormDate').setValue(e[0]);
    this.searchForm.get('createOn_ToDate').setValue(e[1]);
  }

  receiveOn(e) {
    this.searchForm.get('receiveOn_FormDate').setValue(e[0]);
    this.searchForm.get('receiveOn_ToDate').setValue(e[1]);
  }

  pageIndexChange(e) {
    this.page.index = e;
    this.getData();
  }

  pageSizeChange(e) {
    this.page.pageSize = e;
    this.getData();
  }

  onChanges(values: any): void {
    this.searchForm.get('provinceId').setValue(values[0]);
    this.searchForm.get('cityId').setValue(values[1]);
    this.searchForm.get('districtId').setValue(values[2]);
  }

  loadAddressData(node: any, index: number) {
    return new Promise(resolve => {
      if (index < 0) {
        // if index less than 0 it is root node
        that.stateSvc.getProvinceSelectList().subscribe(res => {
          node.children = res;
          resolve();
        });
      } else if (index === 0) {
        that.stateSvc.getCitySelectList(node.value).subscribe(res => {
          node.children = res;
          resolve();
        });
      } else {
        that.stateSvc.getDistrictSelectList(node.value).subscribe(res => {
          const list = [];
          res.forEach(item => {
            item['isLeaf'] = true;
            list.push(item);
          });
          node.children = list;
          resolve();
        });
      }
    });
  }

  export(isAll) {
    if (isAll) {
    }
  }

  arrayToString(arr) {
    let str = '';
    arr.forEach(item => {
      if (str) {
        str = str + item;
      } else {
        str = ',' + item;
      }
    });
    return str;
  }

  view(order: any) {
    this.drawer.create(`查看订单 #${order.orderNumber}`, OrderListViewComponent, { order }, { size: 666 }).subscribe();
  }

  sendShip(order) {
    this.drawer
      .create(`快速发送 #${order.orderNumber}`, OrderListShippingComponent, { order }, { size: 666 })
      .subscribe((res: any) => {
        console.log(res);
      });
  }

  remove() {
    /*this.http
      .delete('/rule', {nos: this.selectedRows.map(i => i.no).join(',')})
      .subscribe(() => {
        this.getData();
      });*/
  }

  search() {
    this.getData();
  }

  reset() {
    // this.q.orderNumber = undefined;
  }

  to(item: any) {
    this.getData();
  }

  private cd() {
    // wait checkbox
    setTimeout(() => this.cdr.detectChanges());
  }

  getSourcePicture(orderSource: number): string {
    return SourcePictureHelper.getSourcePicture(orderSource);
  }

  getStatusColor(orderStatus: number): string {
    if (orderStatus === OrderStatus.WaitConfirm) return '#fa8c16';
    else if (orderStatus === OrderStatus.Processing) return '#2db7f5';
    else if (orderStatus === OrderStatus.Completed) return '#87d068';
    else return '#f50';
  }

  getShippingColor(shippingStatus: number): string {
    if (shippingStatus === ShippingStatus.NotYetShipped) return '#fa8c16';
    else if (shippingStatus === ShippingStatus.IssueWithRejected || shippingStatus === ShippingStatus.Issue)
      return '#f50';
    else if (shippingStatus === ShippingStatus.Received) return '#87d068';
    else return '#2db7f5';
  }
}
