import {
  Component
} from '@angular/core';

import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {EditionServiceProxy} from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-sys-edition-list',
  templateUrl: './list.component.html',
  styleUrls: []
})
export class SysEditionListComponent {
  data;
  loading = false;

  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  mapOfCheckedId = {};
  numberOfChecked = 0;

  constructor(
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private editionSvc: EditionServiceProxy) {
  }

  ngOnInit() {
    this.getData();
  }

  checkAll(value: boolean): void {
    this.data.items.forEach(item => this.mapOfCheckedId[item.id] = value);
    this.refreshStatus();
  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.data.items.filter(item => !item.disabled).every(item => this.mapOfCheckedId[item.id]);
    this.isIndeterminate = this.data.items.filter(item => !item.disabled).some(item => this.mapOfCheckedId[item.id]) && !this.isAllDisplayDataChecked;
    this.numberOfChecked = this.data.items.filter(item => this.mapOfCheckedId[item.id]).length;
  }

  getData() {
    this.loading = true;
    this.editionSvc.getEditions().subscribe(res => {
      this.loading = false;
      this.data = res;
      console.log(this.data);
    });
  }

  /*view(edition: any) {
    this.drawer
      .create(`编辑订单 #${edition.id}`, SysEditionEditComponent, {edition}, {size: 666})
      .subscribe();
  }*/

  /*
    sendShip() {
      this.drawer
        .create(`批量发货`, OrderListMemoComponent, {}, {size: 350})
        .subscribe((res: any) => {
          console.log(res);
        });
    }*/

  remove() {
    /*this.http
      .delete('/rule', {nos: this.selectedRows.map(i => i.no).join(',')})
      .subscribe(() => {
        this.getData();
      });*/
  }

  search() {
    this.getData();
  }

  reset() {
    /*this.q.orderNumber = undefined;*/
  }
}
