import { ToastrService } from 'ngx-toastr';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Calendar } from '../../services/calendar';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agent',
  imports: [FormsModule, CommonModule],
  templateUrl: './agent.html',
  styleUrl: './agent.scss',
})
export class Agent implements OnInit {
  calendars: any[] = [];
  newCalendar = { title: '', external_url: '' };
   private toastr = inject(ToastrService);

  constructor(
    private calendarService: Calendar,
    private authService: Auth,
    private router: Router
  ) {}

  // Amikor betölt az oldal, azonnal lekérjük a naptárakat
  ngOnInit() {
    this.loadCalendars();
  }

  loadCalendars() {
    this.calendarService.getCalendars().subscribe({
      next: (data: any) => this.calendars = data,
      error: (err) => console.error('Hiba a naptárak lekérésekor:', err)
    });
  }

  onSubmit() {
    this.calendarService.createCalendar(this.newCalendar).subscribe({
      next: (res: any) => {
        // Sikeres mentés után azonnal betesszük a listába, hogy látszódjon
        this.calendars.push(res.calendar);
        this.toastr.success('Naptár sikeresen létrehozva')
        // Kiürítjük az űrlapot
        this.newCalendar = { title: '', external_url: '' };
      },
      error: (err) => {
        this.toastr.error('Sikertelen')
      }
    },
  );
  }
  addSlot(calendar: any, slotTime: string) {
    if (!slotTime) return;

    this.calendarService.addAvailability(calendar.id, { slot_time: slotTime }).subscribe({
      next: (res: any) => {
        
        if (!calendar.availabilities) {
          calendar.availabilities = [];
        }
        calendar.availabilities.push(res.availability);
      },
      error: (err) => console.error('Hiba az időpont hozzáadásakor:', err)
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}