import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AddScheduleComponent } from './pages/add-schedule/add-schedule.component';
import { AuthGuard } from '../guards/auth.guard';
import { AuthComponent } from './pages/auth/auth.component';
import { AuthCallbackComponent } from './pages/auth-callback/auth-callback.component';


export const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'auth-callback', component: AuthCallbackComponent },
  { 
    path: 'home', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'add-schedule', 
    component: AddScheduleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-schedule/edit/:id',
    component: AddScheduleComponent,
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth' }
];