import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Booking } from '../../services/booking';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book.html',
  styleUrl: './book.scss',
})
export class Book implements OnInit {
  calendar: any = null;
  selectedSlot: any = null;
  guest = { guest_name: '', guest_phone: '', guest_email: '' };
  successMessage = '';
  termsAccepted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private bookingService: Booking,
    private tstr: ToastrService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCalendar(Number(id));
    }
  }

  onTermsChange(event: any) {
    if (event.target.checked) {
      this.tstr.info(
        "Tájékoztató a fizetésről:\n\nA foglalás véglegesítéséhez 500 Ft letét, valamint 51 Ft rendszerhasználati díj kerül felszámításra.\n\nA letét a találkozó sikeres lezárása után visszajár.",
        "Fontos információ", 
        { timeOut: 8000 } 
      );
    }
  }

  loadCalendar(id: number) {
    this.bookingService.getPublicCalendar(id).subscribe({
      next: (data) => this.calendar = data,
      error: (err) => console.error('Hiba a naptár betöltésekor:', err)
    });
  }

  selectSlot(slot: any) {
    this.selectedSlot = slot;
    this.successMessage = '';
  }

  onSubmit() {
    // Két biztonsági ellenőrzés
    if (!this.selectedSlot) return;
    if (!this.termsAccepted) {
      this.tstr.error('Kérjük, fogadja el a feltételeket a folytatáshoz!');
      return;
    }

    const payload = {
      availability_id: this.selectedSlot.id,
      guest_name: this.guest.guest_name,
      guest_phone: this.guest.guest_phone,
      guest_email: this.guest.guest_email
    };

    this.bookingService.submitBooking(payload).subscribe({
      next: (res: any) => {
        this.successMessage = 'Sikeres foglalás! Az ingatlanos hamarosan keresni fog.';
        this.selectedSlot = null; 
        this.guest = { guest_name: '', guest_phone: '' , guest_email: ''};
        this.termsAccepted = false; // Sikeres foglalás után visszavesszük a pipát
        this.loadCalendar(this.calendar.id);
      },
      error: (err) => console.error('Hiba a foglalásnál:', err)
    });
  }
}