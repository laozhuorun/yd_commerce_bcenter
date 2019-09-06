import * as addDays from 'date-fns/add_days';
import * as format from 'date-fns/format';

export function addDate(date: Date, days: number) {
  return addDays(new Date(), days);
}

export function genData(days: number, dateFormat = 'YYYY-MM-DD') {
  return format(addDays(new Date(), days), dateFormat);
}

export function rudeCopy(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

export function getIndex(arr, key, value) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === value) {
      return i;
    }
  }
}
