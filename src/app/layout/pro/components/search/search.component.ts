import {
  Component,
  ViewChild,
  HostListener,
  ElementRef,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'layout-pro-search',
  templateUrl: 'search.component.html',
  host: {
    '[class.alain-pro__header-item]': 'true',
    '[class.alain-pro__header-search]': 'true',
    '[class.alain-pro__header-search-show]': 'show',
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutProWidgetSearchComponent implements OnDestroy {
  @ViewChild('ipt') private ipt: ElementRef<any>;
  show = false;
  q: string;
  search$ = new Subject<string>();
  list: any[] = [];

  constructor(http: _HttpClient, cdr: ChangeDetectorRef) {
    this.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((q: string) => http.get('/user', { no: q, pi: 1, ps: 5 })),
      )
      .subscribe((res: any) => {
        this.list = res.list;
        cdr.detectChanges();
      });
  }

  @HostListener('click')
  _click() {
    this.ipt.nativeElement.focus();
    this.show = true;
  }

  ngOnDestroy(): void {
    this.search$.unsubscribe();
  }
}
