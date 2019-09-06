import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { StoreServiceProxy } from '@shared/service-proxies/service-proxies';
import { STChange, STColumn, STComponent, STData } from '@delon/abc';
import { _HttpClient } from '@delon/theme';
import { Router } from '@angular/router';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

import { TenantListDto, TenantServiceProxy } from '@shared/service-proxies/service-proxies';

import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tenant-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less'],
})
export class TenantListComponent implements OnInit {
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
  data: TenantListDto[] = [];
  loading = false;
  @ViewChild('st')
  st: STComponent;
  columns: STColumn[] = [
    { title: '用户名', index: 'name' },
    { title: '租户名称', index: 'tenancyName' },
    { title: '创建时间', index: 'createdAt' },
    { title: '激活状态', index: 'isActiveLabel' },
    {
      title: '操作',
      buttons: [
        {
          text: '更新',
          click: (item: any) => {
            this.router.navigate(['/tenant/edit', item.id]);
          },
        },
        {
          text: '重置',
          click: (item: any) => {
            this.loading = true;
            this.tenantSvc.resetTenantSpecificFeatures(item.id).subscribe(res => {
              this.loading = false;
              this.msg.success(`您已重置 ${item.tenancyName} 特性`);
            });
          },
        },
        {
          text: '删除',
          click: (item: any) => {
            this.loading = true;
            this.remove(item);
          },
        },
      ],
    },
  ];
  selectedRows: STData[] = [];
  description = '';
  totalCallNo = 0;

  constructor(
    private http: _HttpClient,
    private router: Router,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private storeSvc: StoreServiceProxy,
    private tenantSvc: TenantServiceProxy,
    private datePipe: DatePipe,
  ) {}

  ngOnInit() {
    this.getData();
    console.log(abp);
  }

  q: any = {
    tenancyName: '',
    name: '',
    subscriptionEndDateStart: undefined,
    subscriptionEndDateEnd: undefined,
    creationDateStart: undefined,
    creationDateEnd: undefined,
    editionId: undefined,
    editionIdSpecified: undefined,
    isActive: undefined,
    sorting: undefined,
    maxResultCount: 20,
    skipCount: 0,
  };

  getData() {
    this.loading = true;
    this.tenantSvc
      .getTenants(
        this.q.tenancyName,
        this.q.name,
        this.q.subscriptionEndDateStart,
        this.q.subscriptionEndDateEnd,
        this.q.creationDateStart,
        this.q.creationDateEnd,
        this.q.editionId,
        this.q.editionIdSpecified,
        this.q.isActive,
        this.q.sorting,
        this.q.maxResultCount,
        this.q.skipCount,
      )
      .subscribe(res => {
        this.loading = false;
        const items = [];
        res.items.forEach(item => {
          item['createdAt'] = this.datePipe.transform(item.creationTime, 'yyyy/MM/dd HH:mm:ss');
          item['isActiveLabel'] = item.isActive ? '是' : '否';
          items.push(item);
        });
        this.data = items;
      });
    /*this.storeSvc.getStores(this.q.name, this.q.source, this.q.sorting, this.q.maxResultCount, this.q.skipCount).subscribe(res => {
      console.log(res);
      this.loading = false;
      const items = [];
      res.items.forEach(item => {
        item['isActiveLabel'] = item.orderSync ? '是' : '否';
        items.push(item);
      });
      this.data = items;
    });*/
    /*this.http
      .get('/rule', this.q)
      .pipe(
        map((list: any[]) =>
          list.map(i => {
            const statusItem = this.status[i.status];
            i.statusText = statusItem.text;
            i.statusType = statusItem.type;
            return i;
          }),
        ),
        tap(() => (this.loading = false)),
      )
      .subscribe(res => {
        this.data = res;
      });*/
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
    this.tenantSvc.deleteTenant(item.id).subscribe(res => {
      this.msg.success(`删除租户 ${item.tenancyName} 成功`);
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

  reset() {
    // wait form reset updated finished
    this.q.tenancyName = '';
    this.q.isActive = undefined;
    setTimeout(() => this.getData());
  }
}
