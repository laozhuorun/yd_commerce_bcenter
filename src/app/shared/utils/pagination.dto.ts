import { AppConsts } from '@shared/consts/app-consts';

export class PaginationBaseDto {
  constructor(maxResultCount: number) {
    this.pageSize = maxResultCount;
    this.pageSizeOptions = AppConsts.grid.pageSizeOptions;
    this.index = 1;
  }
  index: number;
  sorting: string;
  pageSize: number;
  pageSizeOptions: number[];
  skipCount: number;

  getSkipCount(): number {
    return (this.index - 1) * this.pageSize;
  }
}
