import { Component, OnInit } from '@angular/core';
import { OrderServiceProxy } from '@shared/service-proxies/service-proxies';
import {
  ShipmentServiceProxy,
  CommonLookupServiceProxy,
  LogisticsServiceProxy,
  CreateOrUpdateTenantLogisticsInput,
} from '@shared/service-proxies/service-proxies';
import { _HttpClient, DrawerHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { zip } from 'rxjs';

import { Pinyin, compare, pyGroup } from '@shared/utils/pinyin';
import { getIndex } from '@shared/utils/utils';

@Component({
  selector: 'logistics',
  templateUrl: './logistics.component.html',
  styleUrls: ['./logistics.component.less'],
})
export class LogisticsComponent implements OnInit {
  data: any[] = [];
  loading = false;

  numberOfChecked = 0;

  selectedTags = [];

  constructor(
    private http: _HttpClient,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private drawer: DrawerHelper,
    private enumsSvc: CommonLookupServiceProxy,
    private orderSvc: OrderServiceProxy,
    private shipmentSvc: ShipmentServiceProxy,
    private logisticsSvc: LogisticsServiceProxy,
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.loading = true;
    zip(this.logisticsSvc.getLogisticsSelectList(), this.logisticsSvc.getTenantLogisticsSelectList()).subscribe(
      ([tags, selectedTags]) => {
        this.loading = false;
        this.data = pyGroup(tags);
        selectedTags.forEach(item => {
          this.selectedTags.push({
            id: item.value,
            text: item.text,
            logisticsId: tags[getIndex(tags, 'text', item.text)].value,
            displayOrder: 0,
          });
        });
      },
    );

    // id 和logisticsId很容易搞混
  }

  handleChange(checked: boolean, tag): void {
    if (checked) {
      this.selectedTags.push(tag);
      const body = new CreateOrUpdateTenantLogisticsInput({
        id: 0,
        logisticsId: tag.logisticsId,
        displayOrder: 0,
      });
      this.logisticsSvc.createOrUpdateTenantLogistics(body).subscribe(res => {
        console.log(res);
        tag.id = res.id;
      });
    } else {
      this.logisticsSvc.deleteTenantLogistics([tag.id]).subscribe(res => {
        tag.id = 0;
      });
      this.selectedTags = this.selectedTags.filter(t => t !== tag);
    }
  }

  clearCheck() {
    const ids = [];
    this.selectedTags.forEach(item => {
      ids.push(item.id);
    });
    this.logisticsSvc.deleteTenantLogistics(ids).subscribe(res => {
      this.selectedTags = [];
    });
  }

  cancel() {}
}
