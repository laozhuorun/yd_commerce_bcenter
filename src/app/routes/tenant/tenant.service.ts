import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TenantService {
  constructor(private http: HttpClient) {
  }

  getSettings(): Observable<any> {
    return this.http.get('/api/services/app/TenantSettings/GetAllSettings');
  }

  updateSettings(body): Observable<any> {
    return this.http.put('/api/services/app/TenantSettings/UpdateAllSettings', body);
  }
}
