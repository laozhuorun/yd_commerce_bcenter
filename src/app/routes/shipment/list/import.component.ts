import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { filter, finalize } from 'rxjs/operators';
import { NzMessageService, NzDrawerRef, UploadChangeParam } from 'ng-zorro-antd';
import { LogisticsServiceProxy, ShipmentServiceProxy } from '@shared/service-proxies/service-proxies';
import { UploadFile } from 'ng-zorro-antd';
import { AppConsts } from '@shared/consts/app-consts';

@Component({
  selector: 'app-shipment-list-import',
  templateUrl: './import.component.html',
})
export class ShipmentListImportComponent implements OnInit {
  logistics;

  uploading = false;
  tenantLogisticsId;
  fileList: UploadFile[] = [];
  uploadUrl: string;

  constructor(
    private httpClient: HttpClient,
    private msg: NzMessageService,
    private drawer: NzDrawerRef,
    private logisticsSvc: LogisticsServiceProxy,
    private shipmentSvc: ShipmentServiceProxy,
  ) {
    this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/api/Shipment/ImportFromExcel';
  }

  ngOnInit() {
    this.logisticsSvc.getTenantLogisticsSelectList().subscribe(res => {
      this.logistics = res;
    });
  }

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

    this.httpClient
      .post<any>(this.uploadUrl, formData)
      .pipe(
        finalize(() => {
          this.uploading = false;
        }),
      )
      .subscribe(response => {
        this.fileList = [];
        this.msg.success('上传成功,运单回传任务已启动,请稍后查看');
        this.drawer.close();
      });

    // this.http
    //   .request(req)
    //   .pipe(filter(e => e instanceof HttpResponse))
    //   .subscribe(
    //     () => {
    //       this.uploading = false;
    //       this.fileList = [];
    //       this.msg.success('导入成功.');
    //       this.drawer.close();
    //     },
    //     () => {
    //       this.uploading = false;
    //       this.msg.error('导入失败.');
    //     },
    //   );
  }

  close() {
    this.drawer.close();
  }

  changeUploadFile(para: UploadChangeParam) {
    console.log(para.file);
    this.fileList = para.fileList;
  }
}
