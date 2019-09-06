import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd';
import {
  StoreServiceProxy,
  AdvertAccountServiceProxy,
  ProductServiceProxy,
  CreateOrUpdateAdvertAccountInput,
  ProductAttributeServiceProxy,
  CreateOrUpdateAttributeInput,
} from '@shared/service-proxies/service-proxies';
import { AuthService } from '@shared/service/auth.service';

@Component({
  selector: 'app-product-attribute-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less'],
})
export class ProductAttributeEditComponent implements OnInit, OnDestroy {
  attribute: CreateOrUpdateAttributeInput = new CreateOrUpdateAttributeInput({
    id: parseInt(this.route.snapshot.params['id'], 10),
    name: undefined,
    displayOrder: 0,
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: LocationStrategy,
    private msgSvc: NzMessageService,
    private productSvc: ProductServiceProxy,
    private storeSvc: StoreServiceProxy,
    private attributeSvc: ProductAttributeServiceProxy,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    if (this.attribute.id) {
      this.attributeSvc.getAttributeForEdit(this.attribute.id).subscribe(res => {
        for (const key in res) {
          if (this.attribute[key] !== res[key]) {
            this.attribute[key] = res[key];
          }
        }
      });
    }
  }

  update(f) {
    this.attributeSvc.createOrUpdateAttribute(this.attribute).subscribe(res => {
      this.msgSvc.success('更新成功!');
      this.router.navigate(['/attribute/list']);
    });
  }

  cancel() {
    this.location.back();
  }

  ngOnDestroy(): void {}
}
