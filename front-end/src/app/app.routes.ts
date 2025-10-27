import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]  // 🔐 Protegido pelo AuthGuard
  },
  { path: '**', redirectTo: '/dashboard' }
];