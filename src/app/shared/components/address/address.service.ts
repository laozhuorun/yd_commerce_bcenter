import { AppConsts } from '@shared/consts/app-consts';
import { Injectable } from '@angular/core';
import {
  StateServiceProxy,
  CommonLookupServiceProxy,
  SelectListItemDtoOfInt32,
} from '@shared/service-proxies/service-proxies';
import { CacheService } from '@delon/cache';
import { ArrayService } from '@delon/util';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AddressService {
  cacheKey = {
    province: 'province',
    city: 'city-{0}',
    district: 'district-{0}',
  };

  constructor(
    private stateSvc: StateServiceProxy,
    private enumsSvc: CommonLookupServiceProxy,
    private cacheSvc: CacheService,
    private arrSrv: ArrayService,
  ) {}

  private map = (res: SelectListItemDtoOfInt32[]): any[] => {
    const nodeItemList: any[] = [];
    this.arrSrv.visitTree(res, (item: SelectListItemDtoOfInt32) => {
      nodeItemList.push({
        value: item.value,
        label: item.text,
        // isLeaf: isLeaf,
      });
    });

    return nodeItemList;
  };

  private mapisLeaf = (res: SelectListItemDtoOfInt32[]): any[] => {
    const nodeItemList: any[] = [];
    this.arrSrv.visitTree(res, (item: SelectListItemDtoOfInt32) => {
      nodeItemList.push({
        value: item.value,
        label: item.text,
        isLeaf: true,
      });
    });

    return nodeItemList;
  };

  getProvince() {
    return this.cacheSvc
      .tryGet<SelectListItemDtoOfInt32[]>(this.cacheKey.province, this.stateSvc.getProvinceSelectList())
      .toPromise()
      .then(dataResult => {
        return this.map(dataResult);
      });
  }

  getCity(provinceId: number) {
    return this.cacheSvc
      .tryGet<SelectListItemDtoOfInt32[]>(
        abp.utils.formatString('{0}: {1}', this.cacheKey.city, provinceId),
        this.stateSvc.getCitySelectList(provinceId),
      )
      .toPromise()
      .then(dataResult => {
        return this.map(dataResult);
      });
  }

  getDistrict(cityId: number) {
    return this.cacheSvc
      .tryGet<SelectListItemDtoOfInt32[]>(
        abp.utils.formatString('{0}: {1}', this.cacheKey.district, cityId),
        this.stateSvc.getDistrictSelectList(cityId),
      )
      .toPromise()
      .then(dataResult => {
        return this.mapisLeaf(dataResult);
      });
  }
}
