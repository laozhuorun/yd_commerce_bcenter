import * as ApiServiceProxies from './service-proxies';

import { NgModule } from '@angular/core';

@NgModule({
  providers: [
    ApiServiceProxies.AuditLogServiceProxy,
    ApiServiceProxies.CachingServiceProxy,
    ApiServiceProxies.CommonLookupServiceProxy,
    ApiServiceProxies.EditionServiceProxy,
    ApiServiceProxies.HostSettingsServiceProxy,
    ApiServiceProxies.LanguageServiceProxy,
    ApiServiceProxies.NotificationServiceProxy,
    ApiServiceProxies.OrganizationUnitServiceProxy,
    ApiServiceProxies.PermissionServiceProxy,
    ApiServiceProxies.ProfileServiceProxy,
    ApiServiceProxies.RoleServiceProxy,
    ApiServiceProxies.SessionServiceProxy,
    ApiServiceProxies.TenantServiceProxy,
    ApiServiceProxies.TenantSettingsServiceProxy,
    ApiServiceProxies.TimingServiceProxy,
    ApiServiceProxies.UserServiceProxy,
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
    ApiServiceProxies.AdvertStatisticServiceProxy,
    ApiServiceProxies.CommonStatisticServiceProxy,
    ApiServiceProxies.SaleStatisticServiceProxy,
    ApiServiceProxies.ShippingTrackerServiceProxy,
  ],
})
export class ServiceProxyModule {}
