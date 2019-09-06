import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileDto } from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/consts/app-consts';

@Injectable({ providedIn: 'root' })
export class FileService {
  constructor(private http: HttpClient) {}

  get(): Observable<any> {
    return this.http.get('/api/services/app/SMSTemplate/GetAvailableSMSTemplates');
  }

  downloadTempFile(file: FileDto) {
    const url =
      AppConsts.remoteServiceBaseUrl +
      '/api/File/DownloadTempFile?fileType=' +
      file.fileType +
      '&fileToken=' +
      file.fileToken +
      '&fileName=' +
      file.fileName;
    location.href = url; //TODO: This causes reloading of same page in Firefox
  }
}
