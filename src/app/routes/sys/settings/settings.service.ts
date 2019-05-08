import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  constructor(private http: HttpClient) {
  }

  get(): Observable<any> {
    return this.http.get('/api/services/app/HostSettings/GetAllSettings');
  }

  // @params identifier:string,password:password
  // return jwf & user
  set(body): Observable<any> {
    return this.http.put('/api/services/app/HostSettings/UpdateAllSettings', body);
  }
}
