import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';
import { CategoryServiceProxy, CreateOrUpdateCategoryInput } from '@shared/service-proxies/service-proxies';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-goods-category-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less'],
})
export class GoodsCategoryEditComponent implements OnInit, OnDestroy {
  loading = false;

  categories: any[];
  category = new CreateOrUpdateCategoryInput({
    id: this.route.snapshot.params['id'],
    name: '',
    parentCategoryId: 0,
    pictureId: 0,
    isActive: true,
    displayOrder: 0,
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: LocationStrategy,
    private msgSvc: NzMessageService,
    private categorySvc: CategoryServiceProxy,
  ) {}

  ngOnInit() {
    this.categorySvc.getCategorySelectList().subscribe(res => {
      this.categories = res;
    });
    this.categorySvc.getCategoryForEdit(this.category.id).subscribe(res => {
      this.category = res;
    });
  }

  update(f) {
    if (this.loading || f.invalid) {
      return false;
    }
    this.categorySvc.createOrUpdateCategory(this.category).subscribe(() => {
      this.msgSvc.success('更新分类成功!');
    });
  }

  avatarObj(e) {
    this.category.pictureId = e.pictureId;
  }

  cancel() {
    this.location.back();
  }

  ngOnDestroy(): void {}
}
