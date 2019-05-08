import {
  Component,
  ChangeDetectorRef,
  OnInit,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';

import { TenantSettingsEditDto } from '@shared/service-proxies/service-proxies';
import { TenantService } from '../tenant.service';

@Component({
  selector: 'app-tenant-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class TenantSettingsComponent implements OnInit {
  mode = 'inline';
  title: string;
  user: any;

  form: FormGroup;
  loading = false;
  group = 'userManagement';
  settings: TenantSettingsEditDto;
  formLoading = true;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private el: ElementRef,
    private tenantSvc: TenantService,
    private msgSvc: NzMessageService) {
  }

  ngOnInit() {

    this.tenantSvc.getSettings().subscribe(res => {
      this.formLoading = false;
      if (!res.success) {
      } else {
        this.settings = res.result;
      }
    });
  }

  private setActive() {

  }

  to(group) {
    this.group = group;
  }

  save() {
    if (this.loading) {
      return false;
    }
    this.loading = true;
    this.tenantSvc.updateSettings(this.settings).subscribe(res => {
      this.loading = false;
      if (res.success) {
        this.msgSvc.success('更新设置成功');
      }
    });
  }
}
