import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { SettingsService } from './settings.service';
import { SmsService } from '@core/service/sms.service';
import { NzMessageService } from 'ng-zorro-antd';
import {
  SMSTemplateListDto,
  HostSettingsEditDto,
  HostSettingsServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-sys-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less'],
})
export class SysSettingsComponent implements OnInit, AfterViewInit, OnDestroy {
  private resize$: Subscription;
  mode = 'inline';
  title: string;
  user: any;
  settings: HostSettingsEditDto;
  loading = false;
  group = 'userManagement';

  isEmailConfirmationRequiredForLogin = false;

  SMSSMSTemplateList: SMSTemplateListDto[];

  constructor(
    private router: Router,
    private el: ElementRef,
    private smsSvc: SmsService,
    private settingsSvc: SettingsService,
    private msgSvc: NzMessageService,
  ) {}

  ngOnInit() {
    this.smsSvc.get().subscribe(res => {
      const list = [];
      res.result.forEach(item => {
        item.value = parseInt(item.value, 10);
        list.push(item);
      });
      this.SMSSMSTemplateList = list;
    });
  }

  private setActive() {}

  to(group) {
    this.group = group;
  }

  private resize() {
    const el = this.el.nativeElement as HTMLElement;
    let mode = 'inline';
    const { offsetWidth } = el;
    if (offsetWidth < 641 && offsetWidth > 400) {
      mode = 'horizontal';
    }
    if (window.innerWidth < 768 && offsetWidth > 400) {
      mode = 'horizontal';
    }
    this.mode = mode;
  }

  ngAfterViewInit(): void {
    this.resize$ = fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => this.resize());

    this.settingsSvc.get().subscribe(res => {
      this.settings = res.result;
    });
  }

  save() {
    if (this.loading) {
      return false;
    }
    this.loading = true;
    this.settingsSvc.set(this.settings).subscribe(res => {
      this.loading = false;
      if (res.success) {
        this.msgSvc.success('更新设置成功');
      }
    });
  }

  ngOnDestroy(): void {
    this.resize$.unsubscribe();
  }
}
