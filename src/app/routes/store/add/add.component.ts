import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NzMessageService } from 'ng-zorro-antd';
import { StoreService } from '../store.service';

@Component({
  selector: 'app-store-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less'],
})
export class StoreAddComponent implements OnInit, OnDestroy {

  loading = false;

  store = {
    id: 0,
    name: '',
    pictureId: 0,
    appKey: '',
    appSecret: '',
    orderSourceType: 10,
    orderSync: true,
    displayOrder: 0,
  };

  constructor(
    private router: Router,
    private location: LocationStrategy,
    private msgSvc: NzMessageService,
    private storeSvc: StoreService) {
  }

  ngOnInit() {
  }

  save() {
    if (this.loading) {
      return false;
    }
    this.storeSvc.add(this.store).subscribe(res => {
      console.log(res);
    });
  }

  cancel() {
    this.location.back();
  }

  ngOnDestroy(): void {
  }
}
