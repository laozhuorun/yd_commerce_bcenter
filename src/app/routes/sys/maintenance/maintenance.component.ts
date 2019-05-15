import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { CachingServiceProxy, WebLogServiceProxy } from '@shared/service-proxies/service-proxies';
import { FileService } from '@core/service/file.service';

@Component({
  selector: 'app-sys-maintenance',
  templateUrl: './maintenance.component.html',
})
export class SysMaintenanceComponent {
  selectedIndex = 0;
  logs;
  loading = {
    reload: false,
    download: false,
    del: false,
  };

  constructor(
    private msg: NzMessageService,
    private fileSvc: FileService,
    private cachingSvc: CachingServiceProxy,
    private webLogSvc: WebLogServiceProxy,
  ) {
    this.get();
  }

  get() {
    this.loading.reload = true;
    this.webLogSvc.getLatestWebLogs().subscribe(res => {
      this.loading.reload = false;
      this.logs = res.latestWebLogLines;
    });
  }

  reload() {
    this.get();
  }

  download() {
    this.loading.download = true;
    this.webLogSvc.downloadWebLogs().subscribe(res => {
      this.loading.download = false;
      this.fileSvc.downloadTempFile(res.fileName, res.fileType, res.fileToken);
    });
  }

  del() {
    this.loading.del = true;
    this.cachingSvc.clearAllCaches().subscribe(res => {
      this.loading.del = false;
      this.msg.success('删除成功');
    });
  }
}
