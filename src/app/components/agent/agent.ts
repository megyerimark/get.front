import { ToastrService } from 'ngx-toastr';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Calendar } from '../../services/calendar';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-agent',
  standalone: true,
  imports: [FormsModule, CommonModule, ZXingScannerModule],
  templateUrl: './agent.html',
  styleUrl: './agent.scss',
})
export class Agent implements OnInit {
  calendars: any[] = [];
  newCalendar = { title: '', external_url: '' };
  allowedFormats = [ BarcodeFormat.QR_CODE ];
  
  isSubscribed: boolean = false;
  isLoading: boolean = true;

  scannerEnabled = false;
  scanMessage = '';
  scanStatus = '';

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
      next: (data: any) => {
        // Ha TÉNYLEG megkaptuk a naptárakat a Laraveltől, csak akkor engedjük be!
        this.calendars = data;
        this.isSubscribed = true; 
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.isSubscribed = false; // Hiba esetén a fal kint marad

        if (err.status === 402) {
          // Nincs előfizetés: Ez az ÚJ fiókoknál a normális. Itt nem kell hibaüzenet, csak jön a sárga doboz.
        } else if (err.status === 403 || err.status === 401) {
          // E-mail megerősítés hiányzik, vagy lejárt a bejelentkezés!
          this.toastr.warning('Kérlek, erősítsd meg az e-mail címedet a postafiókodban kapott linkkel!', 'Hitelesítés szükséges');
        } else {
          console.error('Szerver hiba:', err);
          this.toastr.error('Nem sikerült betölteni az adatokat.');
        }
      }
    })}

  /* loadCalendars() {
    this.calendarService.getCalendars().subscribe({
      next: (data: any) => {
        this.calendars = data;
        this.isSubscribed = true; 
        this.isLoading = false;
      },
      error: (err) => {
        if (err.status === 402) {
          this.isSubscribed = false; // 402-es hiba: nincs fizetve!
        } else {
          console.error('Hiba a naptárak lekérésekor:', err);
          this.toastr.error('Nem sikerült betölteni a naptárakat.');
        }
      }
    });
  } */

  startSubscription() {
    this.toastr.info('Átirányítás a Stripe fizetési oldalára...', 'Kérjük, várjon');
    
    this.calendarService.startStripeSubscription().subscribe({
      next: (res: any) => {
        // Megkaptuk a linket a Laraveltől, a böngészőt átirányítjuk a Stripe-ra
        window.location.href = res.url;
      },
      error: (err) => {
        console.error('Stripe hiba:', err);
        this.toastr.error('Nem sikerült elindítani a fizetést.');
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

  toggleScanner() {
    this.scannerEnabled = !this.scannerEnabled;
    this.scanMessage = '';
  }

  onCodeResult(resultString: string) {
    this.scannerEnabled = false; 
    const bookingId = Number(resultString);

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
        this.scanMessage = err.error?.message || 'Ismeretlen hiba történt a beolvasáskor.';
        this.toastr.error(this.scanMessage);
      }
    });
  }
}