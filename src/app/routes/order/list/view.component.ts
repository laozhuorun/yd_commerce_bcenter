import { Component, OnInit } from '@angular/core';
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
  ) {}

  ngOnInit() {
    this.loading = true;
    this.orderSvc.getOrderDetail(this.order.id).subscribe(res => {
      this.order = res;
      this.loading = false;
    });
    this.shipmentSvc.getOrderShipments(this.order.id).subscribe(res => {});
  }

  status(status: string) {
    this.http
      .post('/trade/status', {
        id: this.order.id,
        status,
      })
      .subscribe((res: any) => {
        this.msg.success('Success');
        this.order = res.item;
      });
  }

  close() {
    this.drawer.close();
  }
}
