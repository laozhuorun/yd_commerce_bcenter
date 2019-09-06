import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest, HttpResponse, HttpEventType } from '@angular/common/http';

import { Observable, Observer } from 'rxjs';

import { NzMessageService } from 'ng-zorro-antd';
import { UploadFile, UploadXHRArgs } from 'ng-zorro-antd';
import { PictureServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-store-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.less'],
})
export class StoreLogoComponent implements OnInit {
  loading = false;
  avatarUrl: string;
  file = null;

  constructor(private http: HttpClient, 
    private pictureService: PictureServiceProxy, 
    private msg: NzMessageService) {}

  beforeUpload = (file: File) => {
    return new Observable((observer: Observer<boolean>) => {
      // const isJPG = file.type === 'image/jpeg';
      // if (!isJPG) {
      //   this.msg.error('You can only upload JPG file!');
      //   observer.complete();
      //   return;
      // }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.msg.error('图片必须小于 2MB!');
        observer.complete();
        return;
      }
      // check height
      this.checkImageDimension(file).then(dimensionRes => {
        if (!dimensionRes) {
          this.msg.error('Image only 300x300 above');
          observer.complete();
          return;
        }

        // observer.next(isJPG && isLt2M && dimensionRes);
        observer.complete();
      });
    });
  };

  nzCustomRequest;

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result.toString()));
    reader.readAsDataURL(img);
  }

  private checkImageDimension(file: File): Promise<boolean> {
    return new Promise(resolve => {
      const img = new Image(); // create image
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        window.URL.revokeObjectURL(img.src);
        resolve(width === height);
      };
    });
  }

  ngOnInit() {
    this.pictureService.getPictureUploadToken().subscribe(result => {
      this.nzCustomRequest = (item: UploadXHRArgs) => {
        // 构建一个 FormData 对象，用于存储文件或其他参数
        const formData = new FormData();
        // tslint:disable-next-line:no-any
        formData.append('file', item.file as any);
        formData.append(
          'key',
          Math.random()
            .toString(36)
            .substr(2, 15),
        );
        formData.append('x:groupid', '1');
        formData.append('token', result.token);
        const req = new HttpRequest('POST', 'https://upload-z2.qiniup.com/', formData, {
          reportProgress: true,
        });
        // 始终返回一个 `Subscription` 对象，nz-upload 会在适当时机自动取消订阅
        return this.http.request(req).subscribe(
          (event: HttpEvent<{}>) => {
            if (event.type === HttpEventType.UploadProgress) {
              if (event.total > 0) {
                // tslint:disable-next-line:no-any
                (event as any).percent = (event.loaded / event.total) * 100;
              }
              // 处理上传进度条，必须指定 `percent` 属性来表示进度
              item.onProgress(event, item.file);
            } else if (event instanceof HttpResponse) {
              // 处理成功
              item.onSuccess(event.body, item.file, event);
            }
          },
          err => {
            // 处理失败
            item.onError(err, item.file);
          },
        );
      };
    });
  }

  handleChange(info: { file: UploadFile }): void {
    console.log(info);
    if (info.file.status === 'uploading') {
      this.loading = true;
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.file = info.file.originFileObj;
      this.getBase64(info.file.originFileObj, (img: string) => {
        this.loading = false;
        this.avatarUrl = img;
      });
    }
  }
}
