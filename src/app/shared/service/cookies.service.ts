import { AppConsts } from '@shared/AppConsts';
import { DomSanitizer } from '@angular/platform-browser';
import { Injectable } from '@angular/core';

@Injectable()
export class CookiesService {
    domain: string;
    appPath: '/';
    tenantIdCookieName = 'Abp.TenantId';
    tokenCookieName = 'Abp.AuthToken';
    urlBeforeRefresh = 'urlBeforeRefresh';
    bootDomain = 'xiaoyuyue.com';
    businessDomain = 'business.xiaoyuyue.com';
    constructor() {
        this.domain = this.getTopDomain(document.domain, false);
        abp.auth.tokenCookieName = this.tokenCookieName;
        abp.multiTenancy.tenantIdCookieName = this.tenantIdCookieName;
    }

    getTopDomain(domain: string, ownDomain: boolean) {
        const strRegex = '^((https|http|ftp|rtsp|mms)?://)'
            + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' // ftp的user@ 
            // + '(([0-9]{1,3}\.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184
            + '(|' // 允许IP和DOMAIN（域名）
            + '([0-9a-z_!~*\'()-]+\.)*' // 域名- www.
            + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.' // 二级域名
            + '[a-z]{2,6})' // first level domain- .com or .museum
            + '(:[0-9]{1,4})?' // 端口- :80
            + '((/?)|' // a slash isn't required if there is no file name
            + '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$';
        const re = new RegExp(strRegex);
        if (re.test(domain) && (domain.indexOf(this.bootDomain) > 0)) {
            if (!ownDomain) {
                return this.bootDomain;
            } else {
                return this.businessDomain;
            }
        } else {
            return domain;
        }
    }

    /**
     * Sets a cookie value for given key.
     * This is a simple implementation created to be used by ABP.
     * Please use a complete cookie library if you need.
     * @param {string} key
     * @param {string} value 
     * @param {Date} expireDate (optional). If not specified the cookie will expire at the end of session.
     * @param {string} path (optional)
     */
    setCookieValue(key: string, value: string, expireDate?: Date, path?: string): void {
        let cookieValue = encodeURIComponent(key) + '=';

        if (value) {
            cookieValue = cookieValue + encodeURIComponent(value);
        }

        if (expireDate) {
            cookieValue = cookieValue + '; expires=' + expireDate.toUTCString();
        }

        if (path) {
            cookieValue = cookieValue + '; path=' + path;
        }

        cookieValue = cookieValue + '; domain=' + this.domain;

        document.cookie = cookieValue;
    };

    // 设置子项目的cookies
    setOwnCookieValue(key: string, value: string, expireDate?: Date, path?: string): void {
        let cookieValue = encodeURIComponent(key) + '=';

        if (value) {
            cookieValue = cookieValue + encodeURIComponent(value);
        }

        if (expireDate) {
            cookieValue = cookieValue + '; expires=' + expireDate.toUTCString();
        }

        if (path) {
            cookieValue = cookieValue + '; path=' + path;
        }

        cookieValue = cookieValue + '; domain=' + this.getTopDomain(document.domain, true);

        document.cookie = cookieValue;
    };


    /**
     * Gets a cookie with given key.
     * This is a simple implementation created to be used by ABP.
     * Please use a complete cookie library if you need.
     * @param {string} key
     * @returns {string} Cookie value or null
     */
    getCookieValue(key: string): string {
        const equalities = document.cookie.split('; ');
        for (let i = 0; i < equalities.length; i++) {
            if (!equalities[i]) {
                continue;
            }

            const splitted = equalities[i].split('=');
            if (splitted.length !== 2) {
                continue;
            }

            if (decodeURIComponent(splitted[0]) === key) {
                return decodeURIComponent(splitted[1] || '');
            }
        }

        return null;
    };

    /**
    * Deletes cookie for given key.
    * This is a simple implementation created to be used by ABP.
    * Please use a complete cookie library if you need.
    * @param {string} key
    * @param {string} path (optional)
    */
    deleteCookie(key: string, path?: string): void {
        let cookieValue = encodeURIComponent(key) + '=';

        cookieValue = cookieValue + '; expires=' + (new Date(new Date().getTime() - 86400000)).toUTCString();

        if (path) {
            cookieValue = cookieValue + '; path=' + path;
        }

        cookieValue = cookieValue + '; domain=' + this.domain;

        document.cookie = cookieValue;
    }

    deleteOwnCookie(key: string, path?: string): void {
        let cookieValue = encodeURIComponent(key) + '=';

        cookieValue = cookieValue + '; expires=' + (new Date(new Date().getTime() - 86400000)).toUTCString();

        if (path) {
            cookieValue = cookieValue + '; path=' + path;
        }

        cookieValue = cookieValue + '; domain=' + this.getTopDomain(document.domain, true);

        document.cookie = cookieValue;
    }

    setTenantIdCookie(tenantId?: number): void {
        if (tenantId) {
            this.setCookieValue(
                this.tenantIdCookieName,
                tenantId.toString(),
                new Date(new Date().getTime() + 5 * 365 * 86400000), // 5 years
                this.appPath
            );
        } else {
            this.deleteCookie(this.tenantIdCookieName, this.appPath);
        }
    };

    getTenantIdCookie(): number {
        const value = this.getCookieValue(this.tenantIdCookieName);
        if (!value) {
            return null;
        }

        return parseInt(value, 0);
    }

    setToken(authToken: string, expireDate?: Date) {
        this.setCookieValue(this.tokenCookieName, authToken, expireDate, abp.appPath);
    };

    getToken(): string {
        return this.getCookieValue(this.tokenCookieName);
    }

    setBeforeRefreshRoute(route: string) {
        this.setOwnCookieValue(
            this.urlBeforeRefresh,
            route,
            new Date(new Date().getTime() + 5 * 365 * 86400000), // 5 years
            this.appPath
        );
    };

    getBeforeRefreshRoute() {
        const result = this.getCookieValue(this.urlBeforeRefresh);
        if (result) {
            return decodeURIComponent(this.getCookieValue(this.urlBeforeRefresh));
        } else {
            return result;
        }
    };

    clearBeforeRefreshRoute() {
        this.deleteOwnCookie(this.urlBeforeRefresh, this.appPath);
    };

    clearToken(): void {
        this.setToken(undefined, undefined);
        this.setTenantIdCookie(undefined);
    }
}
