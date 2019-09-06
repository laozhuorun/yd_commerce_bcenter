import { Component, ChangeDetectionStrategy, Input, OnInit, ChangeDetectorRef, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  CascaderOption,
  NzCascaderExpandTrigger,
  NzCascaderSize,
  NzShowSearchOptions,
  NzCascaderTriggerType,
} from 'ng-zorro-antd';
import { InputBoolean } from '@delon/util';
import { ModoodAddressService, AddressType } from './modood-address.service';
import { AddressService } from './address.service';

let that;

@Component({
  selector: 'address',
  templateUrl: './address.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressComponent implements OnInit, ControlValueAccessor {
  private onChangeFn: (val: string) => void;
  private onTouchedFn: () => void;
  value: string[] = [];
  data: CascaderOption[];

  // #region fields

  @Input() type: AddressType = 'pca';

  // Original attributes
  @Input() @InputBoolean() allowClear = true;
  @Input() @InputBoolean() autoFocus = false;
  @Input() @InputBoolean() disabled: boolean;
  @Input() expandTrigger: NzCascaderExpandTrigger = 'click';
  @Input() notFoundContent: string;
  @Input() size: NzCascaderSize = 'default';
  @Input() showSearch: boolean | NzShowSearchOptions;
  @Input() placeHolder = '请选择所在地';
  @Input() mouseEnterDelay: number = 0; // ms
  @Input() mouseLeaveDelay: number = 0; // ms
  @Input() triggerAction: NzCascaderTriggerType | NzCascaderTriggerType[] = ['click'] as NzCascaderTriggerType[];

  // data attributes
  provinces = [];

  cities: { [key: number]: Array<{ value: string; label: string; isLeaf?: boolean }> } = {};

  district: { [key: string]: Array<{ value: string; label: string; isLeaf?: boolean }> } = {};

  // #endregion
  that;
  constructor(private addSvc: AddressService, private cdr: ChangeDetectorRef) {
    that = this;
  }

  change() {
    this.onChangeFn(this.value.pop());
    console.log(this.value);
  }

  ngOnInit(): void {
    // this.srv[this.type].subscribe(res => {
    //   this.data = res;
    //   this.cdr.markForCheck();
    // });
  }

  writeValue(geo: string): void {
    console.log(geo);
    if (geo == null) {
      this.value = [];
      return;
    }
    // this.value = this.srv.toValueArr(geo, this.type);
  }

  /** load data async execute by `nzLoadData` method */
  loadData(node: any, index: number): PromiseLike<any> {
    node.loading = true;
    return new Promise(resolve => {
      if (index < 0) {
        // if index less than 0 it is root node
        // const result = that.addSvc.getProvince();
        // that.provinces = result;
        // node.children = result;
        that.addSvc.getProvince().then(result => {
          that.provinces = result;
          node.children = that.provinces;
        });
      } else if (index === 0) {
        // const result = that.addSvc.getCity(node.value);
        // that.cities[node.value] = result;
        // node.children = result;

        that.addSvc.getCity(node.value).then(result => {
          that.cities[node.value] = result;
          node.children = that.cities[node.value];
        });
      } else {
        // const result = await that.addSvc.getDistrict(node.value);
        // that.district[node.value] = result;
        // node.children = result;

        that.addSvc.getDistrict(node.value).then(result => {
          that.district[node.value] = result;
          node.children = that.district[node.value];
        });
      }
      node.loading = false;
      resolve();
    });
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
