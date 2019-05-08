import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// delon
import { AlainThemeModule } from '@delon/theme';
import { DelonABCModule } from '@delon/abc';
import { DelonChartModule } from '@delon/chart';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';
// i18n
import { TranslateModule } from '@ngx-translate/core';

// #region third libs
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CountdownModule } from 'ngx-countdown';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxImageGalleryModule } from 'ngx-image-gallery';

// pipes

import { CNCurrencyPipe } from '@delon/theme';
import { UploadFilePipe } from '@shared/pipe/uploadFile.pipe';

const THIRDMODULES = [NgZorroAntdModule, CountdownModule, DragDropModule, NgxImageGalleryModule];
// #endregion

// #region your componets & directives
import { PRO_SHARED_COMPONENTS } from '../layout/pro';
import { LangsComponent } from './components/langs/langs.component';
import { EditorComponent } from './components/editor/editor.component';
import { ImgComponent } from './components/img/img.component';
import { ImgDirective } from './components/img/img.directive';
import { DelayDirective } from './components/delay/delay.directive';
import { MasonryDirective } from './components/masonry/masonry.directive';
import { ScrollbarDirective } from './components/scrollbar/scrollbar.directive';
import { FileManagerComponent } from './components/file-manager/file-manager.component';
import { StatusLabelComponent } from './components/status-label/status-label.component';
import { MouseFocusDirective } from './components/mouse-focus/mouse-focus.directive';
import { QUICK_CHAT_COMPONENTS } from './components/quick-chat';
import { AddressComponent } from './components/address/address.component';
import { AvatarComponent } from '@shared/components/avatar/avatar.component';
import { AvatarsComponent } from '@shared/components/avatars/avatars.component';
import { FeatureComponent } from '@shared/components/feature/feature.component';
import { AppSessionService } from './service/app-session.service';
import { AbpModule } from '@abp/abp.module';
import { LoginService } from './service/login.service';

const COMPONENTS_ENTRY = [
  LangsComponent,
  ImgComponent,
  FileManagerComponent,
  StatusLabelComponent,
  AddressComponent,
  AvatarComponent,
  AvatarsComponent,
  FeatureComponent,
  ...QUICK_CHAT_COMPONENTS,
];
const COMPONENTS = [EditorComponent, ...COMPONENTS_ENTRY, ...PRO_SHARED_COMPONENTS];
const DIRECTIVES = [ImgDirective, DelayDirective, MasonryDirective, ScrollbarDirective, MouseFocusDirective];
const PIPES = [UploadFilePipe];
// #endregion

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AlainThemeModule.forChild(),
    DelonABCModule,
    DelonChartModule,
    DelonACLModule,
    DelonFormModule,
    AbpModule,
    // third libs
    ...THIRDMODULES,
  ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES,
  ],
  entryComponents: COMPONENTS_ENTRY,
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AlainThemeModule,
    DelonABCModule,
    DelonChartModule,
    DelonACLModule,
    DelonFormModule,
    // i18n
    TranslateModule,
    // third libs
    ...THIRDMODULES,
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES,
  ],
  providers: [LoginService, AppSessionService, UploadFilePipe, CNCurrencyPipe],
})
export class SharedModule {}
