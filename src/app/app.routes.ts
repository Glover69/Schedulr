import { Routes } from '@angular/router';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {AddScheduleComponent} from './pages/add-schedule/add-schedule.component';

export const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: DashboardComponent},
  {path: 'add-schedule', component: AddScheduleComponent},
  {path: 'add-schedule/edit/:id', component: AddScheduleComponent}
];
