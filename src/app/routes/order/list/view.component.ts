import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzDrawerRef } from 'ng-zorro-antd';
import { OrderServiceProxy, ShipmentServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-order-list-view',
  templateUrl: './view.component.html',
})
export class OrderListViewComponent implements OnInit {
  i: any = {};
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
    this.orderSvc.getOrderDetail(this.i.id).subscribe(res => {
      this.i = res;
      this.loading = false;
      console.log(this.i);
    });
    this.shipmentSvc.getOrderShipments(this.i.id).subscribe(res => {
      console.log(res);
    });
    /*this.http.get(`/trade/${this.i.id}`).subscribe(res => {
      this.i = res;
      this.loading = false;
    });*/
  }

  status(status: string) {
    this.http
      .post('/trade/status', {
        id: this.i.id,
        status,
      })
      .subscribe((res: any) => {
        this.msg.success('Success');
        this.i = res.item;
      });
  }

  close() {
    this.drawer.close();
  }
}
