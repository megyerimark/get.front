import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class Calendar {
  private apiUrl = 'http://127.0.0.1:8000/api';
  

  constructor(private http: HttpClient,  private toastr: ToastrService) {}

 /*  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  } */
private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.warn('Nincs bejelentkezett felhasználó!');
    }
    return new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}` 
    });
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

  verifyQrCode(bookingId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/bookings/verify`, { booking_id: bookingId }, { headers: this.getHeaders() });
  }

  startStripeSubscription(): Observable<any> {
    return this.http.post(`${this.apiUrl}/subscription/checkout`, {}, { headers: this.getHeaders() });
  }
  
}