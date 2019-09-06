import { Component, OnInit, Injector, TemplateRef, AfterViewInit } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  CommonLookupServiceProxy,
  OrderServiceProxy,
  StateServiceProxy,
  SelectListItemDtoOfInt32,
  LogisticsServiceProxy,
  ExpSelectedToExcelInput,
  DateRangeDto,
  ExpToExcelInput,
  SelectListItemDtoOfInt64,
  ProductServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { DrawerHelper } from '@delon/theme';

import { NzMessageService, NzModalService } from 'ng-zorro-antd';

import { FileService } from '@core/service/file.service';
import { ListComponentBase } from '@shared/app-component-base';
import { OrderListViewComponent } from '../view/view.component';
import { finalize } from 'rxjs/operators';
import { CacheService } from '@delon/cache';
import { AppConsts } from '@shared/consts/app-consts';
import { OrderStatus, ShippingStatus, EnumConsts } from '@shared/consts/enum-consts';

let that;

@Component({
  selector: 'app-order-batch-ship',
  templateUrl: './batch-ship.component.html',
  styleUrls: ['./batch-ship.component.less'],
})
export class BatchShipComponent extends ListComponentBase implements OnInit, AfterViewInit {
  data;
  expandForm = false;

  isAllDisplayDataChecked = false;
  mapOfCheckedId = [];
  numberOfChecked = 0;

  selectedLogisticsId;
  exportingSelect = false;
  exportingAll = false;
  enums = {
    OrderSource: [],
    OrderStatus: [],
    OrderType: [],
    PaymentStatus: [],
    ShippingStatus: [],
  };

  tenantLogisticses: SelectListItemDtoOfInt64[];
  productSelectData: SelectListItemDtoOfInt64[];

  nzFilterOption = () => true;
  constructor(
    injector: Injector,
    private modalSrv: NzModalService,
    private drawer: DrawerHelper,
    private stateSvc: StateServiceProxy,
    private enumsSvc: CommonLookupServiceProxy,
    private orderSvc: OrderServiceProxy,
    private fileSvc: FileService,
    private cacheSvc: CacheService,
    private logisticsSvc: LogisticsServiceProxy,
    private productSvc: ProductServiceProxy,
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
      sorting: new FormControl('', []),
      maxResultCount: new FormControl(10, []),
      skipCount: new FormControl(0, []),
    });
    this.searchForm.get('orderStatus').setValue([Number(OrderStatus.Processing)]);
    this.searchForm.get('shippingStatus').setValue([Number(ShippingStatus.NotYetShipped)]);
    this.getData();

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

    this.cacheSvc
      .tryGet<SelectListItemDtoOfInt64[]>(
        AppConsts.CacheKey.TenantLogistics,
        this.logisticsSvc.getTenantLogisticsSelectList(),
      )
      .subscribe(res => {
        this.selectedLogisticsId = res[0].value;
        this.tenantLogisticses = res;
      });
  }

  get productIds() {
    return this.searchForm.get('productIds').value;
  }

  set productIds(productIds: number[]) {
    this.searchForm.get('productIds').setValue(productIds);
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
    this.searchForm.get(target).setValue(e);
    this.getData();
  }

  checkAll(value: boolean): void {
    this.data.items.forEach(item => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus();
  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.data.items
      .filter(item => !item.disabled)
      .every(item => this.mapOfCheckedId[item.id]);
    this.numberOfChecked = this.data.items.filter(item => this.mapOfCheckedId[item.id]).length;
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
        undefined,
        this.searchForm.get('adminComment').value,
        this.searchForm.get('customerComment').value,
        this.searchForm.get('sorting').value,
        this.searchForm.get('maxResultCount').value,
        this.searchForm.get('skipCount').value,
      )
      .subscribe(res => {
        this.loading = false;
        this.data = res;
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

  export() {
    this.exportingAll = true;
    const input = new ExpToExcelInput();

    input.storeIds = this.searchForm.get('storeIds').value;
    input.productIds = this.searchForm.get('productIds').value;
    input.orderNumber = this.searchForm.get('orderNumber').value;
    input.createdOn = new DateRangeDto({
      formDate: this.searchForm.get('createOn_FormDate').value,
      toDate: this.searchForm.get('createOn_ToDate').value,
    });
    input.phoneNumber = this.searchForm.get('phoneNumber').value;
    input.provinceId = this.searchForm.get('provinceId').value;
    input.cityId = this.searchForm.get('cityId').value;
    input.districtId = this.searchForm.get('districtId').value;
    input.orderTypes = this.searchForm.get('orderTypes').value;
    input.orderSources = this.searchForm.get('orderSource').value;
    input.adminComment = this.searchForm.get('adminComment').value;
    input.customerComment = this.searchForm.get('customerComment').value;
    input.tenantLogisticsId = this.selectedLogisticsId;

    this.orderSvc
      .expToExcel(input)
      .pipe(
        finalize(() => {
          this.exportingAll = false;
        }),
      )
      .subscribe(res => {
        this.loading = false;
        this.fileSvc.downloadTempFile(res);
      });
  }

  exportSelect() {
    const ids = [];
    for (const id in this.mapOfCheckedId) {
      if (this.mapOfCheckedId[id]) {
        ids.push(id);
      }
    }

    if (ids.length > 0) {
      this.exportingSelect = true;
      const input = new ExpSelectedToExcelInput({
        tenantLogisticsId: this.selectedLogisticsId,
        orderIds: ids,
      });
      this.orderSvc
        .expSelectedToExcel(input)
        .pipe(
          finalize(() => {
            this.exportingSelect = false;
          }),
        )
        .subscribe(res => {
          this.fileSvc.downloadTempFile(res);
        });
    } else {
      this.msg.warning('请选择最少一条记录');
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

  remove() {}

  clearCheck() {
    // this.data.items.forEach(item => (this.mapOfCheckedId[item.id] = false));

    this.mapOfCheckedId.forEach(item => (item = false));
  }

  search() {
    this.getData();
  }

  loadAddressData(node: any, index: number) {
    return new Promise(resolve => {
      if (index < 0) {
        // if index less than 0 it is root node

        // this.cacheSvc
        //   .tryGet<SelectListItemDtoOfInt32[]>(enumNames, this.enumsSvc.getEnumSelectItem(enumName))
        //   .subscribe(res => {
        //     res.forEach((item, index) => {
        //       this.enums[enumName].push({
        //         index: index,
        //         text: item.text,
        //         value: item.value,
        //         type: 'default',
        //         checked: false,
        //       });
        //     });
        //   });

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

  reset() {
    // this.q.orderNumber = undefined;
  }

  view(order: any) {
    this.drawer.create(`查看订单 #${order.orderNumber}`, OrderListViewComponent, { order }, { size: 666 }).subscribe();
  }

  showExportModal(tpl: TemplateRef<{}>, exportSelect: boolean) {
    const that = this;
    this.modalSrv.create({
      nzTitle: '编辑备注',
      nzContent: tpl,
      nzOnOk: () => {
        if (exportSelect) {
          that.exportSelect();
        } else {
          that.export();
        }
      },
    });
  }
}
