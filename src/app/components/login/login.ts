import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true, // Ha standalone komponenst használsz, ez fontos
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);
  private authService = inject(Auth);
  private router = inject(Router);
  
  credentials = { email: '', password: '' };
  errorMessage = "";

  constructor() {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['verified'] === 'success') {
        this.toastr.success('Az e-mail címed sikeresen megerősítve! Most már bejelentkezhetsz.', 'Sikeres hitelesítés', { timeOut: 5000 });
      } else if (params['verified'] === 'already') {
        this.toastr.info('Ez az e-mail cím már meg van erősítve. Kérlek, jelentkezz be!', 'Már hitelesített', { timeOut: 5000 });
      }
    });
  }
  
  onSubmit() {
    this.authService.login(this.credentials).subscribe({
      next: (res: any) => {
        // JAVÍTVA: A válasz kiíratása és a token biztos elkapása
        console.log('Backend válasz bejelentkezéskor:', res);
        const token = res.access_token || res.token; 
        
        if (token) {
          localStorage.setItem('auth_token', token);
          this.toastr.success('Sikeres bejelentkezés!');
          this.router.navigate(['/agent']);
        } else {
          this.toastr.error('A szerver nem küldött tokent!');
          console.error('Nincs token a válaszban!');
        }
      },
      error: (err) => {
        console.error('Login hiba:', err);
        
        if (err.status === 403) {
          const errorMsg = err.error?.message || 'Még nem erősítetted meg az e-mailedet!';
          this.toastr.warning(errorMsg, 'Hitelesítés szükséges', { timeOut: 6000 });
        } else {
    
          this.toastr.error('Hibás e-mail cím vagy jelszó!');
        }
      }
    });
  }
}