import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AddScheduleComponent } from './pages/add-schedule/add-schedule.component';
import { AuthGuard } from '../guards/auth.guard';
import { AuthComponent } from './pages/auth/auth.component';
import { AuthCallbackComponent } from './pages/auth-callback/auth-callback.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './pages/terms-of-service/terms-of-service.component';


export const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'auth-callback', component: AuthCallbackComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms-of-service', component: TermsOfServiceComponent },
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
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];