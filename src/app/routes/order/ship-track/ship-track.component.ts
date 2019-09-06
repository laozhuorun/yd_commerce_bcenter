import { Component, OnInit, Injector } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd';
import { ShippingTrackerServiceProxy, TrackingDto, OrderListDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { ShippingStatus, PaymentStatus, OrderStatus, OrderType } from '@shared/consts/enum-consts';
import { finalize } from 'rxjs/operators';
import { SourcePictureHelper, TagColor } from '@shared/consts/static-source';

@Component({
  selector: 'app-ship-track',
  templateUrl: './ship-track.component.html',
  styleUrls: ['./ship-track.component.less'],
})
export class ShipTrackComponent extends AppComponentBase implements OnInit {
  loading = true;
  order: OrderListDto = new OrderListDto();
  trackingDto: TrackingDto = new TrackingDto();
  reverse: true;
  constructor(
    injector: Injector,
    private drawer: NzDrawerRef,
    private shippingTrackerSvc: ShippingTrackerServiceProxy,
  ) {
    super(injector);
    console.log(this.order);
  }

  ngOnInit() {
    if (this.order.shippingStatus !== Number(ShippingStatus.NotYetShipped)) {
      this.loading = true;
      this.shippingTrackerSvc
        .getShipmentTracking(this.order.id, undefined, false)
        .pipe(
          finalize(() => {
            this.loading = false;
          }),
        )
        .subscribe(res => {
          this.trackingDto = res;
        });
    }
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

  getTackingColor(shippingStatus: number, last: boolean): string {
    if ((shippingStatus === ShippingStatus.IssueWithRejected || shippingStatus === ShippingStatus.Issue) && last)
      return TagColor.Error;
    else if (shippingStatus === ShippingStatus.Received && last) return TagColor.Success;
    else return TagColor.Info;
  }

  close() {
    this.drawer.close();
  }
}
