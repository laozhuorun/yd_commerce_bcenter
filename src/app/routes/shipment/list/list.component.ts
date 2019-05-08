import {
  Component
} from '@angular/core';
import {OrderServiceProxy} from '@shared/service-proxies/service-proxies';
import {
  ShipmentServiceProxy,
  CommonLookupServiceProxy
} from '@shared/service-proxies/service-proxies';
import {_HttpClient, DrawerHelper} from '@delon/theme';
import {NzMessageService, NzModalService, UploadXHRArgs} from 'ng-zorro-antd';
import {HttpEvent, HttpEventType, HttpRequest, HttpResponse} from '@angular/common/http';

import {AppService} from '../../../app.service';
import {ShipmentListImportComponent} from './import.component';

@Component({
  selector: 'app-shipment-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ShipmentListComponent {
  data: any[] = [];
  loading = false;

  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  mapOfCheckedId = {};
  numberOfChecked = 0;

  constructor(
    private http: _HttpClient,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private drawer: DrawerHelper,
    private enumsSvc: CommonLookupServiceProxy,
    private orderSvc: OrderServiceProxy,
    private shipmentSvc: ShipmentServiceProxy) {
  }

  ngOnInit() {
    this.getData();
  }

  filterChange(target, e) {
    this.q[target] = e;
    this.getData();
  }

  checkAll(value: boolean): void {
    this.data.forEach(item => this.mapOfCheckedId[item.id] = value);
    this.refreshStatus();
  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.data.filter(item => !item.disabled).every(item => this.mapOfCheckedId[item.id]);
    this.isIndeterminate = this.data.filter(item => !item.disabled).some(item => this.mapOfCheckedId[item.id]) && !this.isAllDisplayDataChecked;
    this.numberOfChecked = this.data.filter(item => this.mapOfCheckedId[item.id]).length;
    console.log(this.mapOfCheckedId);
  }

  q = {
    status: undefined,
    trackingNumber: undefined,
    deliveryFrom: undefined,
    deliveryTo: undefined,
    receivedFrom: undefined,
    receivedTo: undefined,
    sorting: undefined,
    maxResultCount: 20,
    skipCount: 0
  };

  getData() {
    this.loading = true;
    this.shipmentSvc.getShipments(this.q.status,
      this.q.trackingNumber,
      this.q.deliveryFrom,
      this.q.deliveryTo,
      this.q.receivedFrom,
      this.q.receivedTo,
      this.q.sorting,
      this.q.maxResultCount,
      this.q.skipCount).subscribe(res => {
      this.data = res.items;
      console.log(res);
    });
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

  remove() {
    /*this.http
      .delete('/rule', {nos: this.selectedRows.map(i => i.no).join(',')})
      .subscribe(() => {
        this.getData();
      });*/
  }

  showImport() {
    this.drawer
      .create(`导入运单`, ShipmentListImportComponent, {}, {size: 666})
      .subscribe();
  }
}
