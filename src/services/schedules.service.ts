import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Schedule } from '../models/data.models';

@Injectable({
  providedIn: 'root',
})
export class SchedulesService {
  private apiUrl = environment.apiRoute;

  constructor(private http: HttpClient) {}

  listMine(): Observable<{ schedules: Schedule[] }> {
    return this.http.get<{ schedules: Schedule[] }>(
      `${this.apiUrl}/schedulr/user/get-data`,
      { withCredentials: true }
    );
  }

  createSchedule(
    userId: string,
    scheduleData: Partial<Schedule>
  ): Observable<{ message: string; schedule: Schedule }> {
    return this.http.post<{ message: string; schedule: Schedule }>(
      `${this.apiUrl}/schedulr/user/save-schedule?id=${userId}`,
      scheduleData,
      { withCredentials: true }
    );
  }

  getScheduleById(scheduleId: string): Observable<{ schedule: Schedule }> {
    return this.http.get<{ schedule: Schedule }>(
      `${this.apiUrl}/schedulr/user/get-schedule?scheduleId=${scheduleId}`,
      { withCredentials: true }
    );
  }

  updateSchedule(
    scheduleId: string,
    scheduleData: Partial<Schedule>
  ): Observable<{ message: string; schedule: Schedule }> {
    return this.http.put<{ message: string; schedule: Schedule }>(
      `${this.apiUrl}/schedulr/user/update-schedule?scheduleId=${scheduleId}`,
      scheduleData,
      { withCredentials: true }
    );
  }

  deleteSchedule(scheduleId: string): Observable<{
    message: string;
    deletedSchedule: {
      schedule_id: string;
      schedule_name: string;
      created_at: string;
    };
  }> {
    return this.http.delete<{
      message: string;
      deletedSchedule: {
        schedule_id: string;
        schedule_name: string;
        created_at: string;
      };
    }>(
      `${this.apiUrl}/schedulr/user/delete-one?scheduleId=${scheduleId}`,
      { withCredentials: true }
    );
  }

  submitFeedback(feedbackData: {
    rating: string;
    message: string;
  }): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/schedulr/feedback/submit`,
      feedbackData,
      { withCredentials: true }
    );
  }
}
