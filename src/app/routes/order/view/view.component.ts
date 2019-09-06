import { Component, OnInit, ChangeDetectorRef, Injector } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzDrawerRef } from 'ng-zorro-antd';
import {
  OrderServiceProxy,
  ShipmentServiceProxy,
  OrderDetailDto,
  ShipmentDto,
  OrderDetailDtoShippingStatus,
} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { ShippingStatus, OrderStatus, PaymentStatus, OrderType } from '@shared/consts/enum-consts';
import { SourcePictureHelper, TagColor } from '@shared/consts/static-source';

@Component({
  selector: 'app-order-list-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.less'],
})
export class OrderListViewComponent extends AppComponentBase implements OnInit {
  order: OrderDetailDto = new OrderDetailDto();
  shipment: ShipmentDto = new ShipmentDto();
  loading = false;
  constructor(
    injector: Injector,
    private drawer: NzDrawerRef,
    private orderSvc: OrderServiceProxy,
    private shipmentSvc: ShipmentServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.loading = true;
    this.orderSvc.getOrderDetail(this.order.id).subscribe(res => {
      this.order = res;
      this.loading = false;
    });

    // if (this.order.shippingStatus !== Number(ShippingStatus.NotYetShipped)) {
    //   this.shipmentSvc.GetOrderShipments(this.order.id).subscribe(res => {
    //     this.shipment = res[0];
    //   });
    // }
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

  getPaymentColor(item: OrderDetailDto): string {
    if (item.paymentStatus === PaymentStatus.Pending && item.orderType === OrderType.PayOnline) return TagColor.Warning;
    else if (item.paymentStatus === PaymentStatus.Pending) return TagColor.Info;
    else if (item.paymentStatus === PaymentStatus.Refunded || item.paymentStatus === PaymentStatus.PartiallyRefunded)
      return TagColor.Error;
    else if (item.paymentStatus === PaymentStatus.Paid) return TagColor.Success;
    else return TagColor.Warning;
  }

  status(status: string) {}

  close() {
    this.drawer.close();
  }
}
