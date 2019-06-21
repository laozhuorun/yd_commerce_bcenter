import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { NzMessageService, NzModalService } from 'ng-zorro-antd';

import { StoreListDto, StoreServiceProxy } from '@shared/service-proxies/service-proxies';
import { STChange, STColumn, STComponent, STData } from '@delon/abc';
import { _HttpClient } from '@delon/theme';
import { OrderSource } from '@shared/consts/enum-consts';
import { LogoImgUrl } from '@shared/consts/static-source';
import { ListComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-store-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less'],
})
export class StoreListComponent extends ListComponentBase implements OnInit {
  q: any = {
    name: '',
    source: undefined,
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
  data: StoreListDto[] = [];
  loading = false;
  @ViewChild('st')
  st: STComponent;
  columns: STColumn[] = [
    { title: '', index: 'id', type: 'checkbox' },
    { title: '店铺名称', index: 'name', render: 'store-name' },
    { title: '订单来源', index: 'orderSourceString' },
    { title: '订单同步', index: 'orderSyncLabel', render: 'order-async' },
    {
      title: '操作',
      buttons: [
        {
          icon: 'edit',
          text: '编辑',
          click: (item: any) => {
            this.router.navigate(['/store/edit', item.id]);
          },
        },
        {
          icon: 'delete',
          text: '删除',
          pop: true,
          popTitle: '确认删除吗？',
          click: (item: any) => this.remove([item.id]),
        },
      ],
    },
  ];
  selectedRows: STData[] = [];
  description = '';
  totalCallNo = 0;

  constructor(
    injector: Injector,
    private http: _HttpClient,
    private router: Router,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private storeSvc: StoreServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.loading = true;
    if (this.q.status !== null && this.q.status > -1) this.q.statusList.push(this.q.status);
    this.storeSvc
      .getStores(this.q.name, this.q.source, this.q.sorting, this.q.maxResultCount, this.q.skipCount)
      .subscribe(res => {
        console.log(res);
        this.loading = false;
        const items = [];
        res.items.forEach(item => {
          if (item.orderSource === 10) {
            item['orderSourceTypeName'] = '自营';
          }
          if (item.orderSource === 20) {
            item['orderSourceTypeName'] = '鲁班';
          }
          if (item.orderSource === 30) {
            item['orderSourceTypeName'] = '放心购';
          }
          if (item.orderSource === 40) {
            item['orderSourceTypeName'] = '广点通';
          }
          if (item.orderSource === 50) {
            item['orderSourceTypeName'] = '有赞';
          }
          item['orderSyncLabel'] = item.orderSync ? '是' : '否';
          items.push(item);
        });
        this.data = items;
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

  remove(ids) {
    this.storeSvc.deleteStore(ids).subscribe(res => {
      this.getData();
      this.st.clearCheck();
    });
  }

  reset() {
    // wait form reset updated finished
    setTimeout(() => this.getData());
  }

  getDefaultPictureUrl(item: StoreListDto): string {
    if (!!item.pictureUrl) return item.pictureUrl;

    if (item.orderSource === OrderSource.Tenant) return LogoImgUrl.Tenant;
    else if (item.orderSource === OrderSource.FxgAd) return LogoImgUrl.Toutiao;
    else if (item.orderSource === OrderSource.FxgPd) return LogoImgUrl.Toutiao;
    else if (item.orderSource === OrderSource.YouZan) return LogoImgUrl.Youzan;
    else return LogoImgUrl.Self;
  }

  changeSyncStaus(status: boolean, item: StoreListDto) {
    console.log(item.id + ':' + status);
  }
}
