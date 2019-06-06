export class CommonHelper {
  static toPercent(num: number, total: number): any {
    return num / total - 1; // 小数点后两位百分比
  }
}
