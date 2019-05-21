import { NzNotificationService } from 'ng-zorro-antd';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NzNotification {
  private _notificationSerivce: NzNotificationService;

  constructor(notificationSerivce: NzNotificationService) {
    this._notificationSerivce = notificationSerivce;

    this.init();
  }

  public init() {
    window['NzNotification'] = this._notificationSerivce;
  }
}
