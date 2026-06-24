import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  credentials = {email: '', password : ''};
  errorMessage = "";

  constructor(private authService: Auth, private router: Router) {}

  onSubmit() {
    console.log('Ezt próbálja elküldeni az Angular:', this.credentials);
    this.authService.login(this.credentials).subscribe({
      next: (res: any) => {
        // 1. Token elmentése
        localStorage.setItem('auth_token', res.token);
        
        // 2. KÖZLEKEDÉSI RENDŐR: Szerepkör alapján navigálunk
        if (res.user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (res.user.role === 'agent') {
          this.router.navigate(['/agent']);
        }
      },
      error: (err) => {
        this.errorMessage = 'Hibás email vagy jelszó!';
        console.error(err);
      }
    });

  }

}
