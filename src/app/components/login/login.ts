import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router, RouterModule ,ActivatedRoute} from '@angular/router';
import { inject } from '@angular/core'
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);
  private authService = inject(Auth);
  private router = inject(Router);
  


  credentials = {email: '', password : ''};
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
        localStorage.setItem('auth_token', res.access_token);
        this.toastr.success('Sikeres bejelentkezés!');
        this.router.navigate(['/agent']);
      },
      error: (err) => {
        console.error('Login hiba:', err);
        // Itt majd később le lehet kezelni a "Még nem erősítetted meg az e-mailedet" hibaüzenetet is!
        this.toastr.error('Hibás e-mail cím vagy jelszó!');
      }
    });
  }


/* 
  onSubmit() {
    this.authService.login(this.credentials).subscribe({
      next: (res: any) => {
        // 1. Token elmentése
        localStorage.setItem('auth_token', res.token);
        this.toastr.success('Sikeres belépés')
       
        if (res.user.role === 'admin') {
          this.router.navigate(['/admin']);
        
        } else if (res.user.role === 'agent') {
          this.router.navigate(['/agent']);
        }
      },
      error: (err) => {
        this.toastr.error("Sikertelen belépés")
      }
    });

  }
 */
}
