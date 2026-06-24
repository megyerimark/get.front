import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from './auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Calendar {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient, private authService: Auth) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }
  getCalendars(): Observable<any> {
    return this.http.get(`${this.apiUrl}/calendars`, { headers: this.getHeaders() });
  }
  createCalendar(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/calendars`, data, { headers: this.getHeaders() });
  }
  addAvailability(calendarId: number, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/calendars/${calendarId}/availabilities`, data, { headers: this.getHeaders() });
  }
  
}
