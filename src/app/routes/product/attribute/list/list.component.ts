import { Component, OnInit } from '@angular/core';
import { ProductAttributeServiceProxy } from '@shared/service-proxies/service-proxies';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-product-attribute-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less'],
})
export class ProductAttributeListComponent implements OnInit {
  editCache: { [key: string]: any } = {};
  data;
  loading = false;

  isAllDisplayDataChecked = false;
  mapOfCheckedId = {};
  numberOfChecked = 0;

  constructor(private attributeSvc: ProductAttributeServiceProxy, private msgSvc: NzMessageService) {}

  ngOnInit() {
    this.getData();
  }

  checkAll(value: boolean): void {
    this.data.forEach(item => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus();
  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.data.filter(item => !item.disabled).every(item => this.mapOfCheckedId[item.id]);
    this.numberOfChecked = this.data.filter(item => this.mapOfCheckedId[item.id]).length;
  }

  getData() {
    this.loading = true;
    this.attributeSvc.getAttributes().subscribe(res => {
      this.loading = false;
      this.data = res;
      console.log(this.data);
    });
  }

  remove(ids) {
    let _ids = [];
    if (ids.length) {
      _ids = ids;
    } else {
      for (const id in ids) {
        if (ids[id]) {
          _ids.push(parseInt(id, 10));
        }
      }
    }

    this.attributeSvc.deleteAttribute(_ids).subscribe(res => {
      this.msgSvc.success('删除成功!');
      this.getData();
    });
  }

  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.data.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.data[index] },
      edit: false,
    };
  }

  saveEdit(id: string): void {
    const index = this.data.findIndex(item => item.id === id);
    Object.assign(this.data[index], this.editCache[id].data);

    this.attributeSvc.createOrUpdateAttribute(this.data[index]).subscribe(() => {
      this.msgSvc.success('更新成功!');
      this.editCache[id].edit = false;
    });
  }

  updateEditCache(): void {
    this.data.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
  }
}
