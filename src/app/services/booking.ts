import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Booking {
  private apiUrl = 'http://127.0.0.1:8000/api/public'; 

  constructor(private http: HttpClient) {}

  // Egy konkrét naptár (és a szabad időpontjainak) lekérése
  getPublicCalendar(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/calendars/${id}`);
  }

  // A foglalás elküldése
  submitBooking(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/bookings`, data);
  }
}
