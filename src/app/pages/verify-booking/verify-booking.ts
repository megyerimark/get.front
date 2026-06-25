import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Calendar } from '../../services/calendar';

@Component({
  selector: 'app-verify-booking',
  imports: [],
  templateUrl: './verify-booking.html',
  styleUrl: './verify-booking.scss',
  standalone: true,
})
export class VerifyBooking implements OnInit{
  loading = true;
  message = '';
  status = '';
  guestName = '';
  
  constructor(
    private route: ActivatedRoute,
    private calendarService: Calendar
  ) {}

  ngOnInit() {
    // Kiolvassuk az URL-ből: ?id=5
    this.route.queryParams.subscribe(params => {
      const bookingId = params['id'];
      if (bookingId) {
        this.verify(bookingId);
      } else {
        this.message = "Érvénytelen QR kód!";
        this.loading = false;
      }
    });
  }

  verify(id: number) {
    this.calendarService.verifyQrCode(id).subscribe({
      next: (res: any) => {
        this.status = 'success';
        this.message = res.message;
        this.guestName = res.guest_name;
        this.loading = false;
      },
      error: (err) => {
        this.status = 'error';
        this.message = err.error.message || 'Hiba történt!';
        this.loading = false;
      }
    });
  }


}
