import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { inject } from '@angular/core'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private toastr = inject(ToastrService);
  


  credentials = {email: '', password : ''};
  errorMessage = "";

  constructor(private authService: Auth, private router: Router) {}

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
        this.errorMessage = 'Hibás email vagy jelszó!';
        console.error(err);
      }
    });

  }

}
