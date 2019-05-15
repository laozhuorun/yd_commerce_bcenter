import { Component } from '@angular/core';
import { WebLogServiceProxy, CachingServiceProxy, EntityDtoOfString } from '@shared/service-proxies/service-proxies';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-sys-maintenance-cache',
  templateUrl: './cache.component.html',
})
export class SysMaintenanceCacheComponent {
  logs;
  caches;

  constructor(
    private msg: NzMessageService,
    private logSvc: WebLogServiceProxy,
    private cachingSvc: CachingServiceProxy,
  ) {
    logSvc.getLatestWebLogs().subscribe(res => {
      this.logs = res.latestWebLogLines;
    });
    cachingSvc.getAllCaches().subscribe(res => {
      console.log(res);
      this.caches = res.items;
    });
  }

  del(id) {
    this.cachingSvc.clearCache(new EntityDtoOfString({ id: id })).subscribe(res => {
      this.msg.success('删除成功');
    });
  }
}
