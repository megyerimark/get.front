import { ToastrService } from 'ngx-toastr';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Calendar } from '../../services/calendar';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-agent',
  imports: [FormsModule, CommonModule, ZXingScannerModule],
  templateUrl: './agent.html',
  styleUrl: './agent.scss',
})
export class Agent implements OnInit {
  calendars: any[] = [];
  newCalendar = { title: '', external_url: '' };
  

  scannerEnabled = false;
  scanMessage = '';
  scanStatus = ''; // 'success' vagy 'error'

  private toastr = inject(ToastrService);

  constructor(
    private calendarService: Calendar,
    private authService: Auth,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCalendars();
  }

  loadCalendars() {
    this.calendarService.getCalendars().subscribe({
      next: (data: any) => this.calendars = data,
      error: (err) => {
        console.error('Hiba a naptárak lekérésekor:', err);
        this.toastr.error('Nem sikerült betölteni a naptárakat.');
      }
    });
  }

  onSubmit() {
    this.calendarService.createCalendar(this.newCalendar).subscribe({
      next: (res: any) => {
        this.calendars.push(res.calendar);
        this.toastr.success('Naptár sikeresen létrehozva');
        this.newCalendar = { title: '', external_url: '' };
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Sikertelen mentés');
      }
    });
  }

  addSlot(calendar: any, slotTime: string) {
    if (!slotTime) return;

    this.calendarService.addAvailability(calendar.id, { slot_time: slotTime }).subscribe({
      next: (res: any) => {
        if (!calendar.availabilities) {
          calendar.availabilities = [];
        }
        calendar.availabilities.push(res.availability);
        this.toastr.success('Időpont hozzáadva!');
      },
      error: (err) => {
        console.error('Hiba az időpont hozzáadásakor:', err);
        this.toastr.error('Nem sikerült hozzáadni az időpontot.');
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // --- SZKENNER LOGIKA ---

  toggleScanner() {
    this.scannerEnabled = !this.scannerEnabled;
    this.scanMessage = ''; // Ha újra bekapcsoljuk, eltüntetjük a régi üzenetet
  }

  onCodeResult(resultString: string) {
    this.scannerEnabled = false; 
    const bookingId = Number(resultString);

    // Biztonsági ellenőrzés: ha a QR kód nem szám, ne küldjünk kérést
    if (isNaN(bookingId)) {
      this.scanStatus = 'error';
      this.scanMessage = 'Érvénytelen QR kód formátum!';
      this.toastr.error('Érvénytelen QR kód!');
      return;
    }

    this.calendarService.verifyQrCode(bookingId).subscribe({
      next: (res: any) => {
        this.scanStatus = 'success';
        this.scanMessage = res.message + ' (Vendég: ' + res.guest_name + ')';
        this.toastr.success('Sikeres jegyérvényesítés!');
      },
      error: (err) => {
        this.scanStatus = 'error';
        // Lekezeljük a Laravelből jövő hibaüzenetet (vagy egy alapértelmezettet adunk)
        this.scanMessage = err.error?.message || 'Ismeretlen hiba történt a beolvasáskor.';
        this.toastr.error(this.scanMessage);
      }
    });
  }
}