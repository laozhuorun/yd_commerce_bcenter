import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class FileService {
  constructor(private http: HttpClient) {
  }

  get(): Observable<any> {
    return this.http.get('/api/services/app/SMSTemplate/GetAvailableSMSTemplates');
  }

  /**
   * 下载临时文件
   * @param fileName 文件名称
   * @param fileType 文件类型
   * @param fileToken 文件 Token
   * @return Success
   */
  downloadTempFile(fileName: string, fileType: string, fileToken: string): Observable<void> {
    let url = '/api/File/DownloadTempFile?';
    if (fileName === undefined || fileName === null)
      throw new Error('The parameter \'fileName\' must be defined and cannot be null.');
    else
      url += 'FileName=' + encodeURIComponent('' + fileName) + '&';
    if (fileType === undefined || fileType === null)
      throw new Error('The parameter \'fileType\' must be defined and cannot be null.');
    else
      url += 'FileType=' + encodeURIComponent('' + fileType) + '&';
    if (fileToken === undefined || fileToken === null)
      throw new Error('The parameter \'fileToken\' must be defined and cannot be null.');
    else
      url += 'FileToken=' + encodeURIComponent('' + fileToken) + '&';
    url = url.replace(/[?&]$/, '');
    location.href = url;
    return null
  }
}
