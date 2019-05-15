import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { NzMessageService, NzDrawerRef } from 'ng-zorro-antd';
import { LogisticsServiceProxy, ShipmentServiceProxy } from '@shared/service-proxies/service-proxies';
import { UploadFile } from 'ng-zorro-antd';

@Component({
  selector: 'app-shipment-list-import',
  templateUrl: './import.component.html',
})
export class ShipmentListImportComponent implements OnInit {
  logistics;

  uploading = false;
  tenantLogisticsId;
  fileList: UploadFile[] = [];

  constructor(
    private http: HttpClient,
    private msg: NzMessageService,
    private drawer: NzDrawerRef,
    private logisticsSvc: LogisticsServiceProxy,
    private shipmentSvc: ShipmentServiceProxy,
  ) {
    logisticsSvc.getTenantLogisticsSelectList().subscribe(res => {
      this.logistics = res;
    });
  }

  ngOnInit() {}

  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  /*import() {
    console.log(this.importForm.value);
    this.shipmentSvc.importFromExcel(this.importForm.get('tenantLogisticsId').value).subscribe(res => {
      console.log(res);
    });
  }*/

  import(): void {
    const formData = new FormData();
    // tslint:disable-next-line:no-any
    formData.append('tenantLogisticsId', this.tenantLogisticsId);
    this.fileList.forEach((file: any) => {
      formData.append('files[]', file);
    });
    this.uploading = true;
    const req = new HttpRequest('POST', '/api/Shipment/ImportFromExcel', formData, {
      // reportProgress: true
    });
    this.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
      .subscribe(
        () => {
          this.uploading = false;
          this.fileList = [];
          this.msg.success('导入成功.');
          this.drawer.close();
        },
        () => {
          this.uploading = false;
          this.msg.error('导入失败.');
        },
      );
  }

  close() {
    this.drawer.close();
  }
}
