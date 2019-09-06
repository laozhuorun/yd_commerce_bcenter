import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LocationStrategy } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import {
  TenantInfoEditDto,
  TenantServiceProxy,
  NameValueDto,
  EditionServiceProxy,
  CreateTenantInput,
} from '@shared/service-proxies/service-proxies';
import { getIndex } from '@shared/utils/utils';

@Component({
  selector: 'app-tenant-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less'],
})
export class TenantEditComponent implements OnInit {
  id = this.route.snapshot.params['id'] !== '0' ? this.route.snapshot.params['id'] : undefined;
  tenant;
  features;
  editions;

  subscriptionEndDateUtc;

  constructor(
    private route: ActivatedRoute,
    private location: LocationStrategy,
    private tenantSvc: TenantServiceProxy,
    private editionSvc: EditionServiceProxy,
  ) {}

  ngOnInit() {
    const features = [];
    if (this.id) {
      this.tenantSvc.getTenantForEdit(this.id).subscribe(res => {
        this.tenant = res.tenant;
        this.subscriptionEndDateUtc = this.tenant.subscriptionEndDateUtc
          ? moment(this.tenant.subscriptionEndDateUtc).format('YYYY-MM-DD')
          : '';
        res.features.features.forEach(item => {
          item['value'] = res.features.featureValues[getIndex(res.features.featureValues, 'name', item.name)].value;
          features.push(item);
        });
        this.features = features;
      });
    } else {
      this.tenant = {
        tenancyName: '',
        name: '',
        adminEmailAddress: '',
        phoneNumber: '',
        adminPassword: '',
        connectionString: '',
        shouldChangePasswordOnNextLogin: true,
        sendActivationEmail: true,
        editionId: 0,
        isActive: true,
        subscriptionEndDateUtc: '',
        isInTrialPeriod: true,
      };
    }
    this.editionSvc.getEditionSelectList().subscribe(res => {
      this.editions = res;
    });
  }

  submit() {
    if (this.id) {
      const features = [];
      this.features.forEach(feature => {
        features.push(
          new NameValueDto({
            name: feature.name,
            value: feature.value,
          }),
        );
      });
      this.tenant['features'] = features;
      this.tenantSvc.updateTenant(this.tenant).subscribe(res => {
        console.log(res);
      });
    } else {
      this.tenantSvc.createTenant(this.tenant).subscribe(res => {
        console.log(res);
      });
    }
  }

  cancel() {
    this.location.back();
  }
}
