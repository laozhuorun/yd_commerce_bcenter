import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'app-feature',
  template: `
      <nz-switch [(ngModel)]="_value" (ngModelChange)="_valueChange($event)"
                 [name]="item.name" nzCheckedChildren="是"
                 nzUnCheckedChildren="否"></nz-switch>`,
  styleUrls: []
})
export class FeatureComponent implements OnInit, OnChanges {
  @Input() item;
  @Input() value = 'false';
  @Output() valueChange = new EventEmitter();

  _value = false;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(change: SimpleChanges) {
    if (change.value) {
      this._value = (this.value === 'true' ? true : false);
    }
  }

  _valueChange(e) {
    this.value = e;
    this._value = e;
    this.valueChange.emit(this.value.toString());
  }
}
