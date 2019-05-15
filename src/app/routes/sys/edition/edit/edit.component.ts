import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  EditionServiceProxy,
  NameValueDto,
  TenantServiceProxy,
  CreateOrUpdateEditionDto,
} from '@shared/service-proxies/service-proxies';
import { LocationStrategy } from '@angular/common';
import * as moment from 'moment';
import { getIndex } from '@shared/utils/utils';

@Component({
  selector: 'app-sys-edition-edit',
  templateUrl: './edit.component.html',
})
export class SysEditionEditComponent {
  id = this.route.snapshot.params['id'] !== '0' ? this.route.snapshot.params['id'] : undefined;
  tenant;
  edition;
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
    this.editionSvc.getEditionForEdit(this.id).subscribe(res => {
      console.log(res);
      this.edition = res.edition;
      res.features.forEach(item => {
        item['value'] = res.featureValues[getIndex(res.featureValues, 'name', item.name)].value;
        features.push(item);
      });
      this.features = features;
    });
    this.editionSvc.getEditionSelectList().subscribe(res => {
      this.editions = res;
    });
  }

  submit(f) {
    const features = [];
    this.features.forEach(feature => {
      features.push(
        new NameValueDto({
          name: feature.name,
          value: feature.value,
        }),
      );
    });
    const body = new CreateOrUpdateEditionDto({
      edition: this.edition,
      featureValues: features,
    });
    this.editionSvc.createOrUpdateEdition(body).subscribe(res => {
      console.log(res);
    });
  }

  cancel() {
    this.location.back();
  }
}
