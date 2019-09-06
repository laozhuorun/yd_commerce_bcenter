import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { NzMessageService, NzModalService } from 'ng-zorro-antd';

import {
  StoreListDto,
  StoreServiceProxy,
  CommonLookupServiceProxy,
  SelectListItemDtoOfInt32,
} from '@shared/service-proxies/service-proxies';
import { STChange, STColumn, STComponent, STData } from '@delon/abc';
import { _HttpClient } from '@delon/theme';
import { SourcePictureHelper } from '@shared/consts/static-source';
import { ListComponentBase } from '@shared/app-component-base';
import { finalize } from 'rxjs/operators';
import { CacheService } from '@delon/cache';
import { EnumConsts } from '@shared/consts/enum-consts';

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
  orderSource = [];

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
    private router: Router,
    public msg: NzMessageService,
    private storeSvc: StoreServiceProxy,
    private cacheSvc: CacheService,
    private enumsSvc: CommonLookupServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.getSelectDataSource();
    this.getData();
  }

  getSelectDataSource() {
    this.cacheSvc
      .tryGet<SelectListItemDtoOfInt32[]>(
        EnumConsts.OrderSource,
        this.enumsSvc.getEnumSelectItem(EnumConsts.OrderSource),
      )
      .subscribe(res => {
        this.orderSource = res;
      });
  }

  getData() {
    this.loading = true;
    this.storeSvc
      .getStores(this.q.name, this.q.source, this.q.sorting, this.q.maxResultCount, this.q.skipCount)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe(res => {
        this.data = res.items;
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

    return SourcePictureHelper.getSourcePicture(item.orderSource);
  }

  getSourcePicture(orderSource: number): string {
    return SourcePictureHelper.getSourcePicture(orderSource);
  }

  changeSyncStaus(status: boolean, item: StoreListDto) {
    console.log(item.id + ':' + status);
  }
}
