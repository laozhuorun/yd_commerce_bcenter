import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

interface sendInput {

}

interface sendOutput {

}

@Injectable({ providedIn: 'root' })
export class SmsService {
  constructor(private http: HttpClient) {
  }

  get(): Observable<any> {
    return this.http.get('/api/services/app/SMSTemplate/GetAvailableSMSTemplates');
  }

  send(body: { targetNumber: string, codeType: number, captchaResponse: string }): Observable<any> {
    return this.http.post('/api/services/app/SMS/SendCode?_allow_anonymous=true', body);
  }
}
