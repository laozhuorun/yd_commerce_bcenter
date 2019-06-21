import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd';
import { CreateOrUpdateStoreInput, StoreServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-store-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less'],
})
export class StoreEditComponent implements OnInit, OnDestroy {
  loading = false;

  store: CreateOrUpdateStoreInput = new CreateOrUpdateStoreInput({
    id: 0,
    name: '',
    pictureId: 0,
    appKey: '',
    appSecret: '',
    orderSource: 10,
    orderSync: true,
    displayOrder: 0,
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: LocationStrategy,
    private msgSvc: NzMessageService,
    private storeSvc: StoreServiceProxy,
  ) {}

  ngOnInit() {
    this.store.id = this.route.snapshot.params['id'];
    this.storeSvc.getStoreForEdit(this.store.id).subscribe(res => {
      for (const key in res) {
        if (this.store[key] !== res[key]) {
          this.store[key] = res[key];
        }
      }
      console.log(this.store);
      /*res.forEach(item => {
        console.log(item);
      });*/
    });
  }

  update(f) {
    if (this.loading || f.invalid) {
      return false;
    }
    this.storeSvc.createOrUpdateStore(this.store).subscribe(() => {
      this.msgSvc.success('更新成功!');
    });
  }

  cancel() {
    this.location.back();
  }

  ngOnDestroy(): void {}
}
