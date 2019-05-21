import { NzMessageService } from 'ng-zorro-antd';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NzMessage {
  private _nzMessageService: NzMessageService;

  constructor(nzMessageService: NzMessageService) {
    this._nzMessageService = nzMessageService;

    this.init();
  }

  public init() {
    window['NzMessage'] = this._nzMessageService;
  }
}
