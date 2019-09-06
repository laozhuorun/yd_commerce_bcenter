import { Component, OnInit, ChangeDetectorRef, Injector, TemplateRef, AfterViewInit } from '@angular/core';

import {
  CommonLookupServiceProxy,
  OrderServiceProxy,
  StateServiceProxy,
  SelectListItemDtoOfInt32,
  OrderListDto,
  EditAdminCommentInput,
  ChangeOrderStatusInputOfOrderStatus,
  SelectListItemDtoOfInt64,
  ProductServiceProxy,
  AddTagsInput,
} from '@shared/service-proxies/service-proxies';
import { _HttpClient, DrawerHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { OrderListViewComponent } from '../view/view.component';

import { CacheService } from '@delon/cache';
import {
  EnumConsts,
  OrderStatus,
  ShippingStatus,
  PaymentStatus,
  OrderTags,
  OrderType,
} from '@shared/consts/enum-consts';
import { SFSchema } from '@delon/form';
import { AppComponentBase, ListComponentBase } from '@shared/app-component-base';
import { PaginationBaseDto } from '@shared/utils/pagination.dto';
import { AppConsts, MediaCompressFormat } from '@shared/consts/app-consts';
import { SourcePictureHelper, TagColor } from '@shared/consts/static-source';
import { QuickShipComponent } from './quick-ship/quick-ship.component';
import { finalize, concatMap } from 'rxjs/operators';
import { ShipTrackComponent } from '../ship-track/ship-track.component';
import { ResultComponent } from '@delon/abc';
import { addDate } from '@shared/utils/utils';
import { endOfDay, startOfDay } from 'date-fns';

let that;

@Component({
  selector: 'app-order-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less'],
})
export class OrderListComponent extends ListComponentBase implements OnInit, AfterViewInit {
  data;
  isAllChecked = false;
  isIndeterminate = true;
  checkedId = [];
  numberOfChecked = 0;
  editItem: OrderListDto = new OrderListDto();
  productSelectData: SelectListItemDtoOfInt64[] = [];
  geo = [];

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
      name: '所有',
    },
    {
      key: 'wait-confirm',
      name: '待确认',
    },
    {
      key: 'wait-ship',
      name: '待发货',
    },
    {
      key: 'shipped',
      name: '已发货',
    },
    {
      key: 'return',
      name: '退货中',
    },
    {
      key: 'issue',
      name: '异常单',
    },
  ];

  tabsIndex = 1;
  expandForm = false;
  address;
  q: any = {
    productIds: [],
    storeIds: [],
    logisticsNumber: '',
    orderNumber: '',
    createOn_FormDate: undefined,
    createOn_ToDate: undefined,
    receiveOn_FormDate: undefined,
    receiveOn_ToDate: undefined,
    shippingName: '',
    phoneNumber: '',
    provinceId: undefined,
    cityId: undefined,
    districtId: undefined,
    orderStatus: [],
    paymentStatus: [],
    shippingStatus: [],
    orderTypes: [],
    orderSource: [],
    adminComment: undefined,
    customerComment: undefined,
    orderTags: [],
  };

  constructor(
    injector: Injector,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private drawer: DrawerHelper,
    private stateSvc: StateServiceProxy,
    private enumsSvc: CommonLookupServiceProxy,
    private orderSvc: OrderServiceProxy,
    private productSvc: ProductServiceProxy,
    private cacheSvc: CacheService,
  ) {
    super(injector);
    that = this;
  }

  ngOnInit() {
    this.tabSelect('wait-confirm');
    this.cacheSvc
      .tryGet<SelectListItemDtoOfInt64[]>(AppConsts.CacheKey.ProductSelectData, this.productSvc.getProductSelectList())
      .subscribe(res => {
        this.productSelectData = res;
      });
  }

  ngAfterViewInit() {
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
        .tryGet<SelectListItemDtoOfInt32[]>(enumName, this.enumsSvc.getEnumSelectItem(enumName))
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
    // this.q.get(target).setValue(e);
    this.getData();
  }

  checkAll(value: boolean): void {
    this.isIndeterminate = false;

    if (!!this.data) {
      this.data.items.forEach(item => (this.checkedId[item.id] = value));
      this.refreshStatus();
    }

    this.cdRefresh();
  }

  refreshStatus(): void {
    this.isAllChecked = this.data.items.every(item => this.checkedId[item.id]);
    this.isIndeterminate =
      this.data.items.filter(item => !item.disabled).some(item => this.checkedId[item.id]) && !this.isAllChecked;
    this.numberOfChecked = this.data.items.filter(item => this.checkedId[item.id]).length;
  }

  choose(id: number, checked: boolean) {
    console.log(id + ':' + checked);
    this.refreshStatus();
    this.cdRefresh();
    // this.checkedId[i] = !this.checkedId[i];
    // this.cdRefresh();
  }

  getData() {
    this.loading = true;
    this.orderSvc
      .getOrders(
        this.q.logisticsNumber,
        this.q.receiveOn_FormDate === undefined ? undefined : endOfDay(this.q.receiveOn_FormDate),
        this.q.receiveOn_ToDate === undefined ? undefined : endOfDay(this.q.receiveOn_ToDate),
        this.q.orderStatus,
        this.q.paymentStatus,
        this.q.shippingStatus,
        this.q.storeIds,
        this.q.productIds,
        this.q.orderNumber,
        this.q.createOn_FormDate === undefined ? undefined : startOfDay(this.q.createOn_FormDate),
        this.q.createOn_ToDate === undefined ? undefined : endOfDay(this.q.createOn_ToDate),
        this.q.shippingName,
        this.q.phoneNumber,
        this.q.provinceId,
        this.q.cityId,
        this.q.districtId,
        this.q.orderTypes,
        this.q.orderSource,
        this.q.orderTags,
        this.q.adminComment,
        this.q.customerComment,
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
        this.data.items.forEach(item => {
          item.orderStatusColor = this.getStatusColor(item.orderStatus);
          item.shippingStatusColor = this.getShippingColor(item.shippingStatus);
          item.paymentStatusColor = this.getPaymentColor(item);
          item.tags = this.getOrderTag(item.tags);
        });

        this.cdRefresh();
      });
  }

  createOn(e) {
    // if (e.length === 0) {
    //   this.q.createOn_FormDate').setValue(undefined);
    //   this.q.createOn_ToDate').setValue(undefined);
    //   return;
    // }
    // const startDate = startOfDay(e[0]);
    // this.q.createOn_FormDate').setValue(startDate);
    // const endDate = endOfDay(e[1]);
    // this.q.createOn_ToDate').setValue(endDate);
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
    this.q.provinceId = values[0];
    this.q.cityId = values[1];
    this.q.districtId = values[2];
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

  viewOrderInfo(order: any) {
    this.drawer.create(`查看订单 #${order.orderNumber}`, OrderListViewComponent, { order }, { size: 666 }).subscribe();
  }

  viewShipTrackingInfo(order: any) {
    this.drawer.create(`物流跟踪 #${order.orderNumber}`, ShipTrackComponent, { order }, { size: 666 }).subscribe();
  }

  sendShip(order) {
    this.drawer
      .create(`快速发送 #${order.orderNumber}`, QuickShipComponent, { order }, { size: 666 })
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

  selectedIndexChange(index: number) {
    this.tabsIndex = index;
  }

  tabSelect(tabkey: any) {
    this.clearAllStatus();
    if (tabkey === 'all') {
    } else if (tabkey === 'wait-confirm') {
      this.q.orderStatus = [Number(OrderStatus.WaitConfirm)];
    } else if (tabkey === 'wait-ship') {
      this.q.orderStatus = [Number(OrderStatus.Processing)];
      this.q.shippingStatus = [Number(ShippingStatus.NotYetShipped)];
    } else if (tabkey === 'shipped') {
      this.q.shippingStatus = [
        Number(ShippingStatus.Shipped),
        Number(ShippingStatus.OnPassag),
        Number(ShippingStatus.Taked),
        Number(ShippingStatus.DestinationCity),
        Number(ShippingStatus.Delivering),
      ];
    } else if (tabkey === 'return') {
      this.q.paymentStatus = [Number(PaymentStatus.Refunded), Number(PaymentStatus.PartiallyRefunded)];
    } else if (tabkey === 'issue') {
      this.q.orderTags = [
        OrderTags.UnPaid,
        OrderTags.Repeat,
        OrderTags.ShipError,
        OrderTags.LowReceive,
        OrderTags.OverRange,
        OrderTags.ReDeliver,
      ];
    }

    this.getData();
    this.isIndeterminate = true;
  }

  clearAllStatus() {
    this.checkAll(false);
    this.q.orderStatus = [];
    this.q.paymentStatus = [];
    this.q.shippingStatus = [];
  }

  getSourcePicture(orderSource: number): string {
    return SourcePictureHelper.getSourcePicture(orderSource);
  }

  getStatusColor(orderStatus: number): string {
    if (orderStatus === OrderStatus.WaitConfirm) return TagColor.Warning;
    else if (orderStatus === OrderStatus.Processing) return TagColor.Info;
    else if (orderStatus === OrderStatus.Completed) return TagColor.Success;
    else return TagColor.Error;
  }

  getShippingColor(shippingStatus: number): string {
    if (shippingStatus === ShippingStatus.NotYetShipped) return TagColor.Warning;
    else if (shippingStatus === ShippingStatus.IssueWithRejected || shippingStatus === ShippingStatus.Issue)
      return TagColor.Error;
    else if (shippingStatus === ShippingStatus.Received) return TagColor.Success;
    else return TagColor.Info;
  }

  getPaymentColor(item: OrderListDto): string {
    if (item.paymentStatus === PaymentStatus.Pending && item.orderType === OrderType.PayOnline) return TagColor.Warning;
    else if (item.paymentStatus === PaymentStatus.Pending) return TagColor.Info;
    else if (item.paymentStatus === PaymentStatus.Refunded || item.paymentStatus === PaymentStatus.PartiallyRefunded)
      return TagColor.Error;
    else if (item.paymentStatus === PaymentStatus.Paid) return TagColor.Success;
    else return TagColor.Warning;
  }

  getTagColor(tag: string): string {
    if (tag === OrderTags.Repeat) return TagColor.Warning;
    else if (tag === OrderTags.UnPaid) return TagColor.Error;
    else if (tag === OrderTags.ShipError) return TagColor.Error;
    else return TagColor.Error;
  }

  editAdminCom(tpl: TemplateRef<{}>, item: OrderListDto) {
    this.editItem = item;
    this.modalSrv.create({
      nzTitle: '编辑备注',
      nzContent: tpl,
      nzOnOk: () => {
        const input = new EditAdminCommentInput();
        input.orderId = item.id;
        input.adminComment = item.adminComment;
        this.orderSvc.editAdminComment(input).subscribe(() => {});
      },
    });
  }

  confirmOrder(all: boolean) {
    if (all) {
      this.orderSvc
        .confirmOrders(
          new ChangeOrderStatusInputOfOrderStatus({
            all: true,
            ids: [],
            stauts: Number(OrderStatus.Processing),
          }),
        )
        .subscribe(() => {
          this.notify.success('任务已启动', '注意：只有非异常订单会被自动确认，异常订单请手动处理');
        });
    } else {
      const ids = this.getCheckOrderId();
      this.orderSvc
        .changeOrderStatus(
          new ChangeOrderStatusInputOfOrderStatus({
            all: false,
            ids: ids,
            stauts: Number(OrderStatus.Processing),
          }),
        )
        .subscribe(() => {
          this.msg.success('确认成功');
          this.data.items.forEach(item => {
            if (ids.indexOf(item.id) > 0) {
              item.orderStatus = Number(OrderStatus.Processing);
              item.orderStatusString = '处理中';
            }
          });
        });
    }
  }

  confirm(item: OrderListDto) {
    this.orderSvc
      .changeOrderStatus(
        new ChangeOrderStatusInputOfOrderStatus({
          all: false,
          ids: [item.id],
          stauts: Number(OrderStatus.Processing),
        }),
      )
      .subscribe(() => {
        this.msg.success('确认成功');
        item.orderStatus = Number(OrderStatus.Processing);
        item.orderStatusString = '处理中';
        // this.data.items.removeAt(index);
      });
  }

  getCheckOrderId(): number[] {
    const ids = [];
    for (const id in this.checkedId) {
      if (this.checkedId[id]) {
        ids.push(id);
      }
    }

    return ids;
  }

  getOrderTag(tags: string[]) {
    if (tags === null || tags === undefined) return;

    const tagItems = [];

    tags.forEach(tag => {
      tagItems.push({
        value: this.l('order.tags.' + tag),
        color: this.getTagColor(tag),
      });
    });

    return tagItems;
  }

  setOverRange(orderId: number) {
    let duration = 0;

    this.msg
      .loading('添加中', { nzDuration: duration })
      .onClose!.pipe(concatMap(() => this.msg.success('添加成功', { nzDuration: 2500 }).onClose!))
      .subscribe(() => {});

    this.orderSvc
      .addTags(
        new AddTagsInput({
          ids: [orderId],
          tag: OrderTags.OverRange,
        }),
      )
      .subscribe(() => {
        duration = 1;
      });
  }

  getPictureCompressUrl(url: string): string {
    if (url) return url + MediaCompressFormat.orderListFormat;
    return AppConsts.defaultPicture + MediaCompressFormat.orderListFormat;
  }
}
