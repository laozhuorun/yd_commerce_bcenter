import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzDrawerRef } from 'ng-zorro-antd';
import { LogisticsServiceProxy, ShipmentServiceProxy } from '@shared/service/service-proxies';

@Component({
  selector: 'app-order-list-shipping',
  templateUrl: './shipping.component.html',
})
export class OrderListShippingComponent implements OnInit {
  order: any = {};
  logistics;

  shipmentForm: FormGroup;

  constructor(
    private http: _HttpClient,
    private msg: NzMessageService,
    private drawer: NzDrawerRef,
    private logisticsSvc: LogisticsServiceProxy,
    private shipmentSvc: ShipmentServiceProxy,
  ) {
    logisticsSvc.getTenantLogisticsSelectList().subscribe(res => {
      console.log(res);
      this.logistics = res;
    });
  }

  ngOnInit() {
    this.shipmentForm = new FormGroup({
      orderId: new FormControl(this.order.id, [Validators.required]),
      logisticsId: new FormControl('', [Validators.required]),
      logisticsNumber: new FormControl('', [Validators.required]),
      adminComment: new FormControl('', []),
    });
  }

  ship() {
    this.shipmentSvc.quickDelivery(this.shipmentForm.value).subscribe(res => {
      this.msg.success(`订单 ${this.order.orderNumber} 已成功发货`);
      this.drawer.close(this.order);
    });
  }

  close() {
    this.drawer.close();
  }
}
