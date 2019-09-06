import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd';
import { CreateOrUpdateStoreInput, StoreServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-store-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less'],
})
export class StoreEditComponent extends AppComponentBase implements OnInit, OnDestroy {
  loading = false;

  store: CreateOrUpdateStoreInput = new CreateOrUpdateStoreInput();

  constructor(
    injector: Injector,
    private route: ActivatedRoute,
    private router: Router,
    private location: LocationStrategy,
    private msgSvc: NzMessageService,
    private storeSvc: StoreServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.store.id = this.route.snapshot.params['id'];
    this.storeSvc.getStoreForEdit(this.store.id).subscribe(res => {
      for (const key in res) {
        if (this.store[key] !== res[key]) {
          this.store[key] = res[key];
        }
      }
    });
  }

  update(f) {
    if (this.loading || f.invalid) {
      return false;
    }
    this.storeSvc.createOrUpdateStore(this.store).subscribe(() => {
      this.msgSvc.success('更新成功!');
      this.router.navigate(['/store/list']);
    });
  }

  cancel() {
    this.location.back();
  }

  ngOnDestroy(): void {}
}
