import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AddScheduleComponent } from './pages/add-schedule/add-schedule.component';
import { AuthGuard } from '../guards/auth.guard';
import { AuthComponent } from './pages/auth/auth.component';
import { AuthCallbackComponent } from './pages/auth-callback/auth-callback.component';

// export const routes: Routes = [
//   // { path: '', redirectTo: '/auth', pathMatch: 'full' },
//   { path: 'auth', component: AuthComponent, outlet: "auth" },
//   { path: '', redirectTo: '/home', pathMatch: 'full', outlet: "main" },
//   { path: 'home', component: DashboardComponent, outlet: "main" },
//   { path: 'add-schedule', component: AddScheduleComponent, outlet: "main" },
//   {
//     path: 'add-schedule/edit/:id',
//     component: AddScheduleComponent,
//     outlet: "main"
//   },

//   { path: 'auth-callback', component: AuthCallbackComponent, outlet: "main" },
// ];

// export const routes: Routes = [
//   // Main application routes (will use the "main" outlet)
//   {
//     path: '',
//     outlet: 'main',
//     children: [
//       { path: '', redirectTo: 'home', pathMatch: 'full' },
//       { path: 'home', component: DashboardComponent },
//       { path: 'add-schedule', component: AddScheduleComponent },
//       // ... other main routes
//     ]
//   },
  
//   // Auth routes (will use the "auth" outlet)
//   {
//     path: '',
//     outlet: 'auth',
//     children: [
//       { path: 'login', component: AuthComponent },
//       // { path: 'register', component: RegisterComponent },
//       // { path: 'forgot-password', component: ForgotPasswordComponent },
//       // ... other auth routes
//     ]
//   },
  
//   // // Default redirect
//   // { path: '', redirectTo: '/(main:home)', pathMatch: 'full' },
//   // { path: '**', redirectTo: '/(main:home)' }
// ];


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