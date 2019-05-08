import * as ApiServiceProxies from './service-proxies';

import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {NgModule} from '@angular/core';

@NgModule({
  providers: [
    ApiServiceProxies.AuditLogServiceProxy,
    ApiServiceProxies.CachingServiceProxy,
    ApiServiceProxies.CommonLookupServiceProxy,
    ApiServiceProxies.EditionServiceProxy,
    ApiServiceProxies.HostSettingsServiceProxy,
    ApiServiceProxies.InstallServiceProxy,
    ApiServiceProxies.LanguageServiceProxy,
    ApiServiceProxies.NotificationServiceProxy,
    ApiServiceProxies.OrganizationUnitServiceProxy,
    ApiServiceProxies.PermissionServiceProxy,
    ApiServiceProxies.ProfileServiceProxy,
    ApiServiceProxies.RoleServiceProxy,
    ApiServiceProxies.SessionServiceProxy,
    ApiServiceProxies.TenantServiceProxy,
    ApiServiceProxies.TenantDashboardServiceProxy,
    ApiServiceProxies.TenantSettingsServiceProxy,
    ApiServiceProxies.TimingServiceProxy,
    ApiServiceProxies.UserServiceProxy,
    ApiServiceProxies.UserLinkServiceProxy,
    ApiServiceProxies.UserLoginServiceProxy,
    ApiServiceProxies.WebLogServiceProxy,
    ApiServiceProxies.AccountServiceProxy,
    ApiServiceProxies.TokenAuthServiceProxy,
    ApiServiceProxies.TenantRegistrationServiceProxy,
    ApiServiceProxies.HostDashboardServiceProxy,
    ApiServiceProxies.PaymentServiceProxy,
    ApiServiceProxies.InvoiceServiceProxy,
    ApiServiceProxies.PictureServiceProxy,
    ApiServiceProxies.StoreServiceProxy,
    ApiServiceProxies.InstallServiceProxy,
    ApiServiceProxies.SMSServiceProxy,
    ApiServiceProxies.CategoryServiceProxy,
    ApiServiceProxies.ProductServiceProxy,
    ApiServiceProxies.ProductAttributeServiceProxy,
    ApiServiceProxies.OrderServiceProxy,
    ApiServiceProxies.StateServiceProxy,
    ApiServiceProxies.ShipmentServiceProxy,
    ApiServiceProxies.LogisticsServiceProxy,
    ApiServiceProxies.FileServiceProxy,
    ApiServiceProxies.AdvertAccountServiceProxy,
    ApiServiceProxies.AdvertStatisticServiceProxy
  ]
})
export class ServiceProxyModule {
}
