import { CommonModule } from '@angular/common';
import { Component , OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Booking } from '../../services/booking';

@Component({
  selector: 'app-book',
  imports: [CommonModule, FormsModule],
  templateUrl: './book.html',
  styleUrl: './book.scss',
})
export class Book implements OnInit{
  calendar: any = null;
  selectedSlot: any = null;
  guest = { guest_name: '', guest_phone: '', guest_email: '' };
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private bookingService: Booking
  ) {}
  ngOnInit() {
    // Kiolvassuk az ID-t az URL-ből (pl. localhost:4200/book/1 -> ID lesz az 1)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCalendar(Number(id));
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
    this.successMessage = ''; // Ha újat választ, eltüntetjük az esetleges korábbi siker üzenetet
  }

  onSubmit() {
    if (!this.selectedSlot) return;

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
        this.guest = { guest_name: '', guest_phone: '' , guest_email: ''}; // Kiürítjük a formot
        this.loadCalendar(this.calendar.id); // Frissítjük a naptárat, hogy eltűnjön a lefoglalt időpont
      },
      error: (err) => console.error('Hiba a foglalásnál:', err)
    });
  }

}
