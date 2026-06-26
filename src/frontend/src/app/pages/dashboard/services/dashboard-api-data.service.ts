import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardDto } from '../models/dashboard.models';

@Injectable({ providedIn: 'root' })
export class DashboardApiDataService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api';

  getDashboard(): Observable<DashboardDto> {
    return this.http.get<DashboardDto>(`${this.baseUrl}/dashboard`);
  }
}
