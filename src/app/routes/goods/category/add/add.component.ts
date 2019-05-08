import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';
import { CreateOrUpdateCategoryInput, CategoryServiceProxy, CategoryListDto } from '@shared/service/service-proxies';
import { LocationStrategy } from '@angular/common';
import { StoreService } from '../../../store/store.service';

@Component({
  selector: 'app-goods-category-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less'],
})
export class GoodsCategoryAddComponent implements OnInit, OnDestroy {
  loading = false;

  categories: CategoryListDto[];
  category = new CreateOrUpdateCategoryInput({
    id: 0,
    name: '',
    parentCategoryId: 0,
    pictureId: 0,
    isActive: true,
    displayOrder: 0,
  });

  constructor(
    private router: Router,
    private location: LocationStrategy,
    private msgSvc: NzMessageService,
    private categorySvc: CategoryServiceProxy,
    private storeSvc: StoreService,
  ) {}

  ngOnInit() {
    this.categorySvc.getCategorys('', 0, '', 100, 0).subscribe(res => {
      console.log(res);
      this.categories = res.items;
    });
  }

  save() {
    if (this.loading) {
      return false;
    }
    this.categorySvc.createOrUpdateCategory(this.category).subscribe(res => {
      console.log(res);
      this.msgSvc.success('创建分类成功！');
    });
  }

  avatarObj(e) {
    console.log(e);
    this.category.pictureId = e.pictureId;
  }

  cancel() {
    this.location.back();
  }

  ngOnDestroy(): void {}
}
