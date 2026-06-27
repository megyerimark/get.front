import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Admin } from './components/admin/admin';
import { Agent } from './components/agent/agent';
import { Book } from './components/book/book';
import { VerifyBooking } from './pages/verify-booking/verify-booking';
import { Register } from './register/register';
import { Home } from './home/home';


export const routes: Routes = [
  {path: '', redirectTo: '/home' , pathMatch: 'full'}  ,
    /* { path: '', redirectTo: '/login', pathMatch: 'full' }, */
    { path: 'login', component: Login },
    { path: 'admin', component: Admin },
    { path: 'agent', component: Agent },
    { path: 'book/:id', component: Book },
    { path: 'verify-booking', component: VerifyBooking },
    { path: 'register', component: Register },
];
