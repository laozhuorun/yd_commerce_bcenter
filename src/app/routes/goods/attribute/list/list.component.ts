import { Component, OnInit } from '@angular/core';
import { ProductAttributeServiceProxy } from '@shared/service/service-proxies';

@Component({
  selector: 'app-goods-attribute-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class GoodsAttributeListComponent implements OnInit {
  data;
  loading = false;

  isAllDisplayDataChecked = false;
  mapOfCheckedId = {};
  numberOfChecked = 0;

  constructor(private attributeSvc: ProductAttributeServiceProxy) {}

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
    /*this.productSvc.deleteProduct(_ids).subscribe(res => {
      this.getData();
    });*/
  }
}
