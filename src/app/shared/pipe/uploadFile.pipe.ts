import {Injectable, Pipe, PipeTransform} from '@angular/core';
import {UploadFile} from "ng-zorro-antd";

@Pipe({
  name: 'uploadFile',
  pure: false
})

@Injectable()
export class UploadFilePipe implements PipeTransform {
  transform(files) {
    return files;
  }
}

