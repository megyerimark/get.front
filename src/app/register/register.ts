import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Auth } from '../services/auth';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  user = {
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  };

  // Injektáljuk a szükséges szervizeket
  private authService = inject(Auth);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  onSubmit() {
    if (this.user.password !== this.user.password_confirmation) {
      this.toastr.error('A két jelszó nem egyezik!');
      return;
    }

    this.authService.register(this.user).subscribe({
      next: (res: any) => {
        // NEM mentjük el a tokent és nem dobjuk be a vezérlőpultra azonnal!
        this.toastr.success(
          'Sikeres regisztráció! Kérlek, erősítsd meg az e-mail címedet a postafiókodban található linkkel.', 
          'Nézd meg az e-mailed!', 
          { timeOut: 8000 }
        );
        
        // Visszairányítjuk a login oldalra
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Hiba regisztrációkor:', err);
        const errorMsg = err.error?.message || 'Hiba történt a regisztráció során.';
        this.toastr.error(errorMsg);
      }
    });
  }
}