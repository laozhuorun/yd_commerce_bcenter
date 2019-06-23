import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzDrawerRef } from 'ng-zorro-antd';
import {
  OrderServiceProxy,
  ShipmentServiceProxy,
  OrderDetailDto,
  ShipmentDto,
} from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-order-list-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.less'],
})
export class OrderListViewComponent implements OnInit {
  order: OrderDetailDto = new OrderDetailDto();
  shipment: ShipmentDto = new ShipmentDto();
  loading = false;
  constructor(
    private http: _HttpClient,
    private msg: NzMessageService,
    private drawer: NzDrawerRef,
    private orderSvc: OrderServiceProxy,
    private shipmentSvc: ShipmentServiceProxy,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loading = true;
    this.orderSvc.getOrderDetail(this.order.id).subscribe(res => {
      this.order = res;
      this.loading = false;
    });
    this.shipmentSvc.getOrderShipments(this.order.id).subscribe(res => {});
  }

  status(status: string) {}

  close() {
    this.drawer.close();
  }

  toHTML(input): any {
    return new DOMParser().parseFromString(input, 'text/html').documentElement.textContent;
  }
}
