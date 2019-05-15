import { Component, TemplateRef, OnInit } from '@angular/core';
import { Menu, _HttpClient } from '@delon/theme';
import {
  NzFormatEmitEvent,
  NzDropdownService,
  NzDropdownContextComponent,
  NzTreeNode,
  NzFormatBeforeDropEvent,
  NzMessageService,
} from 'ng-zorro-antd';
import { ArrayService } from '@delon/util';
import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { RoleServiceProxy, CreateOrUpdateRoleInput, RoleEditDto } from '@shared/service-proxies/service-proxies';
import { PermissionServiceProxy } from '@shared/service-proxies/service-proxies';
@Component({
  selector: 'app-sys-role',
  templateUrl: './role.component.html',
})
export class SysRoleComponent implements OnInit {
  private menuEvent: NzFormatEmitEvent;
  private contextMenu: NzDropdownContextComponent;

  data: NzTreeNode[] = [];
  permission: NzTreeNode[];
  item: any;
  delDisabled = false;

  constructor(
    private http: _HttpClient,
    private ddSrv: NzDropdownService,
    private arrSrv: ArrayService,
    private msg: NzMessageService,
    private roleSvc: RoleServiceProxy,
    private permissionSvc: PermissionServiceProxy,
  ) {}

  ngOnInit() {
    this.getPermission();
    this.getData();
  }

  private getPermission() {
    this.permissionSvc
      .getAllPermissions()
      .pipe(
        map(permission => {
          permission.items.forEach(item => {
            item['parentId'] = item.level;
            item['expanded'] = false;
          });
          return permission.items;
        }),
      )
      .subscribe(res => {
        this.permission = this.arrSrv.arrToTreeNode(res, {
          titleMapName: 'displayName',
          idMapName: 'name',
          parentIdMapName: 'parentName',
          cb: (item, parent, deep) => {
            item.expanded = deep <= 1;
          },
        });
        console.log(this.permission);
      });
  }

  private getData() {
    this.roleSvc
      .getRoles('', '', '', 1000, 0)
      .pipe(
        map(role => {
          return role.items;
        }),
      )
      .subscribe(
        res =>
          (this.data = this.arrSrv.arrToTreeNode(res, {
            titleMapName: 'displayName',
            cb: (item, parent, deep) => {
              item.expanded = deep <= 1;
            },
          })),
      );
  }

  changeData(list: any[]) {
    return this.arrSrv.arrToTreeNode(list || [], {
      titleMapName: 'displayName',
      idMapName: 'name',
      parentIdMapName: 'parentName',
      cb: (item, parent, deep) => {
        item.expanded = deep <= 1;
      },
    });
  }

  add(item: any) {
    this.closeContextMenu();
    this.item = {
      id: undefined,
      name: '',
      parentName: '',
      permission: [],
    };
  }

  edit() {
    this.closeContextMenu();
  }

  save() {
    const item = this.item;
    item.permission = this.arrSrv.getKeysByTreeNode(this.permission, { includeHalfChecked: false });
    const body = new CreateOrUpdateRoleInput({
      role: new RoleEditDto({
        id: item.id,
        displayName: item.displayName,
        isDefault: true,
      }),
      grantedPermissionNames: item.permission,
    });
    this.roleSvc.createOrUpdateRole(body).subscribe(res => {
      console.log(res);
    });
    /*this.http.post('/role', item).subscribe(() => {
      this.item = null;
      if (item.id <= 0) {
        this.getData();
      } else {
        this.menuEvent.node.title = item.text;
        this.menuEvent.node.origin = item;
      }
    });*/
  }

  del() {
    this.closeContextMenu();
    this.http.delete(`/role/${this.item.id}`).subscribe(() => {
      this.getData();
      this.item = null;
    });
  }

  get delMsg(): string {
    const childrenLen = this.menuEvent.node.children.length;
    if (childrenLen === 0) {
      return `确认删除【${this.menuEvent.node.title}】吗？`;
    }
    return `确认删除【${this.menuEvent.node.title}】以及所有子项吗？`;
  }

  move = (e: NzFormatBeforeDropEvent) => {
    if (e.pos !== 0) {
      this.msg.warning(`只支持不同类目的移动，且无法移动至顶层`);
      return of(false);
    }
    if (e.dragNode.origin.parent_id === e.node.origin.id) {
      return of(false);
    }
    const from = e.dragNode.origin.id;
    const to = e.node.origin.id;
    return this.http
      .post('/role/move', {
        from,
        to,
      })
      .pipe(
        tap(() => (this.item = null)),
        map(() => true),
      );
  };

  show(e: NzFormatEmitEvent) {
    console.log(e);
    this.menuEvent = e;
    this.item = e.node.origin;
    this.roleSvc.getRoleForEdit(this.item.id).subscribe(res => {
      this.item['permission'] = res.grantedPermissionNames;
    });
  }

  showContextMenu(e: NzFormatEmitEvent, tpl: TemplateRef<void>) {
    this.menuEvent = e;
    this.delDisabled = e.node.children.length !== 0;
    this.contextMenu = this.ddSrv.create(e.event, tpl);
  }

  closeContextMenu() {
    if (this.contextMenu) {
      this.contextMenu.close();
    }
  }
}
