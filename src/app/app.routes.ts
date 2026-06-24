import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Admin } from './components/admin/admin';
import { Agent } from './components/agent/agent';
import { Book } from './components/book/book';


export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'admin', component: Admin },
    { path: 'agent', component: Agent },
    { path: 'book/:id', component: Book },
];
