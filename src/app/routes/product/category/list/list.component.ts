import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CategoryListDto, CategoryServiceProxy } from '@shared/service-proxies/service-proxies';
import { STChange, STColumn, STComponent, STData } from '@delon/abc';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-product-category-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less'],
})
export class ProductCategoryListComponent implements OnInit {
  q: any = {
    name: '',
    parentCategoryId: 0,
    sorting: undefined,
    maxResultCount: 20,
    skipCount: 0,
  };
  sources = [
    {
      index: 0,
      text: '自营',
      value: 10,
      type: 'default',
      checked: false,
    },
    {
      index: 1,
      text: '鲁班',
      value: 20,
      type: 'default',
      checked: false,
    },
    {
      index: 2,
      text: '放心购',
      value: 30,
      type: 'default',
      checked: false,
    },
    {
      index: 3,
      text: '广点通',
      value: 40,
      type: 'default',
      checked: false,
    },
    {
      index: 4,
      text: '有赞',
      value: 50,
      type: 'default',
      checked: false,
    },
  ];
  data: CategoryListDto[] = [];
  categories: any[] = [];
  loading = false;
  @ViewChild('st')
  st: STComponent;
  columns: STColumn[] = [
    { title: '', index: 'id', type: 'checkbox' },
    { title: '分类名称', index: 'name' },
    { title: '类目', index: 'parentCategoryId' },
    { title: '是否启用', index: 'isActiveLabel' },
    {
      title: '操作',
      buttons: [
        {
          text: '更新',
          click: (item: any) => {
            this.router.navigate(['/product/category/edit', item.id]);
          },
        },
        {
          text: '删除',
          click: (item: any) => {
            this.remove(item);
          },
        },
      ],
    },
  ];
  selectedRows: STData[] = [];
  description = '';
  totalCallNo = 0;
  expandForm = false;

  constructor(
    private http: _HttpClient,
    private router: Router,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private categorySvc: CategoryServiceProxy,
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.loading = true;
    this.categorySvc
      .getCategorys(this.q.name, this.q.parentCategoryId, this.q.sorting, this.q.maxResultCount, this.q.skipCount)
      .subscribe(res => {
        console.log(res);
        this.loading = false;
        const items = [];
        res.items.forEach(item => {
          item['isActiveLabel'] = item.isActive ? '是' : '否';
          items.push(item);
        });
        this.data = items;
      });
    this.categorySvc.getCategorySelectList().subscribe(res => {
      this.categories = res;
    });
  }

  stChange(e: STChange) {
    switch (e.type) {
      case 'checkbox':
        this.selectedRows = e.checkbox;
        this.totalCallNo = this.selectedRows.reduce((total, cv) => total + cv.callNo, 0);
        break;
      case 'filter':
        this.getData();
        break;
    }
  }

  remove(item) {
    this.categorySvc.deleteCategory([item.id]).subscribe(() => {
      this.msg.success(`您已成功删除${item.name}`);
      this.getData();
    });
  }

  approval() {
    this.msg.success(`审批了 ${this.selectedRows.length} 笔`);
  }

  add(tpl: TemplateRef<{}>) {
    this.modalSrv.create({
      nzTitle: '新建规则',
      nzContent: tpl,
      nzOnOk: () => {
        this.loading = true;
        this.http.post('/rule', { description: this.description }).subscribe(() => this.getData());
      },
    });
  }
}
