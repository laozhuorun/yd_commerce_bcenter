import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-sys-maintenance-log',
  templateUrl: './log.component.html'
})
export class SysMaintenanceLogComponent {

  @Input() logs;

  constructor() {
  }
}
