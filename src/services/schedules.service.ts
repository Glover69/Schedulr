import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Schedule } from '../models/data.models';

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {
  private apiUrl = environment.apiRoute

  constructor(private http: HttpClient) {}

  listMine(): Observable<{ schedules: Schedule[] }> {
    return this.http.get<{ schedules: Schedule[] }>(
      `${this.apiUrl}/schedulr/user/get-data`,
      { withCredentials: true }
    );
  }
}
