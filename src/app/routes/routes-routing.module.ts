import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@env/environment';
// layout
import { LayoutProComponent } from '@brand';
import { LayoutPassportComponent } from '../layout/passport/passport.component';
// dashboard pages
import { DashboardAnalysisComponent } from './dashboard/analysis/analysis.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
import { UserLockComponent } from './passport/lock/lock.component';
// single pages
import { CallbackComponent } from './callback/callback.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutProComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      // { path: 'dashboard', redirectTo: 'dashboard/analysis', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardAnalysisComponent },
      { path: 'tenant', loadChildren: './tenant/tenant.module#TenantModule' },
      { path: 'store', loadChildren: './store/store.module#StoreModule' },
      { path: 'product', loadChildren: './product/product.module#ProductModule' },
      { path: 'order', loadChildren: './order/order.module#OrderModule' },
      { path: 'shipping', loadChildren: './shipping/shipping.module#ShippingModule' },
      { path: 'shipment', loadChildren: './shipment/shipment.module#ShipmentModule' },
      { path: 'advert', loadChildren: './advert/advert.module#AdvertModule' },
      { path: 'sys', loadChildren: './sys/sys.module#SysModule' },
      // Exception
      { path: 'exception', loadChildren: './exception/exception.module#ExceptionModule' },
    ],
  },
  // passport
  {
    path: 'passport',
    component: LayoutPassportComponent,
    children: [
      {
        path: 'login',
        component: UserLoginComponent,
        data: { title: '登录', titleI18n: 'app.login.login' },
      },
      {
        path: 'register',
        component: UserRegisterComponent,
        data: { title: '注册', titleI18n: 'app.register.register' },
      },
      {
        path: 'register-result',
        component: UserRegisterResultComponent,
        data: { title: '注册结果', titleI18n: 'app.register.register' },
      },
      {
        path: 'lock',
        component: UserLockComponent,
        data: { title: '锁屏', titleI18n: 'app.lock' },
      },
    ],
  },
  // 单页不包裹Layout
  { path: 'callback/:type', component: CallbackComponent },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: environment.useHash,
      // NOTICE: If you use `reuse-tab` component and turn on keepingScroll you can set to `disabled`
      // Pls refer to https://ng-alain.com/components/reuse-tab
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class RouteRoutingModule {}
