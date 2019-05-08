import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StoreService {
  constructor(private http: HttpClient) {
  }

  get(): Observable<any> {
    return this.http.get('/api/services/app/Store/GetStores');
  }

  getSelected(): Observable<any> {
    return this.http.get('/api/services/app/Store/GetStoreSelectList');
  }

  add(body): Observable<any> {
    return this.http.post('/api/services/app/Store/CreateOrUpdateStore', body);
  }

  update(body): Observable<any> {
    return this.http.post('/api/services/app/Store/CreateOrUpdateStore', body);
  }
}
