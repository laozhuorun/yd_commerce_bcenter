import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NzMessageService } from 'ng-zorro-antd';
import { StoreServiceProxy, CreateOrUpdateStoreInput } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { OrderSource } from '@shared/consts/enum-consts';

@Component({
  selector: 'app-store-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less'],
})
export class StoreAddComponent extends AppComponentBase implements OnInit, OnDestroy {
  loading = false;

  store = new CreateOrUpdateStoreInput();

  constructor(
    injector: Injector,
    private router: Router,
    private location: LocationStrategy,
    private msgSvc: NzMessageService,
    private storeSvc: StoreServiceProxy,
  ) {
    super(injector);

    this.store.orderSource = OrderSource.Self;
  }

  ngOnInit() {}

  save() {
    if (this.loading) {
      return false;
    }
    this.storeSvc.createOrUpdateStore(this.store).subscribe(res => {
      this.msg.success(this.l('savaSuccess'));
      this.router.navigate(['/list']);
    });
  }

  cancel() {
    this.location.back();
  }

  ngOnDestroy(): void {}
}
