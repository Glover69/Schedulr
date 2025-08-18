import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Schedule } from '../../../models/data.models';
import {
  downloadICSFile,
  generateICSContent,
} from '../../../utils/calendar-export.utils';
import { environment } from '../../../environments/environment';
import {
  GoogleAuthService,
  GoogleUser,
} from '../../../services/google-auth.service';
import { SchedulesService } from '../../../services/schedules.service';
import { ButtonComponent } from '../../components/new/button/button.component';
import { InputFieldBaseComponent } from '../../components/new/input-field-base/input-field-base.component';
import { finalize, generate } from 'rxjs';
import { Router } from '@angular/router';
import { DrawerComponent } from "../../components/new/drawer/drawer.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogComponent } from "../../components/new/dialog/dialog.component";

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ButtonComponent, ReactiveFormsModule, DrawerComponent, DialogComponent, InputFieldBaseComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  schedules: Schedule[] = [];
  emojiOptions = [
    { icon: '😞', label: 'Poor' },
    { icon: '😐', label: 'Fair' },
    { icon: '👍', label: 'Good' },
    { icon: '👌', label: 'Great' },
    { icon: '🔥', label: 'Excellent' }
  ];

  feedbackForm: FormGroup;
  selectedRating = -1;

  clientId = environment.googleClientId;
  user!: GoogleUser | null;
  first_name?: string = '';

  // Mobile sidebar state
  isSidebarOpen = false;
  isLoading = true;

  greeting = 'Hello';
  private greetingTimer?: number;

  drawerOpen = false;
  selectedSchedule: Schedule | null = null;

  isFeedbackDialogOpen: boolean = false

  constructor(
    private googleAuthService: GoogleAuthService,
    private schedulesService: SchedulesService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.feedbackForm = this.fb.group({
      rating: ['', Validators.required],
      feedback: [''],
      contactPermission: [true],
      joinBeta: [false]
    });
  }

  hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  ngOnInit() {
    this.updateGreeting();
    this.greetingTimer = window.setInterval(
      () => this.updateGreeting(),
      60_000
    );

    // hydrate user, then fetch schedules
    this.googleAuthService.hydrate().then(() => {
      this.googleAuthService.user$.subscribe((u: GoogleUser | null) => {
        this.user = u;
        this.first_name = u?.name.split(' ')[0];
        // console.log(u)
        if (u) {
          this.fetchSchedules();
        } else {
          // no user; stop loading so empty/login UI can show
          this.isLoading = false;
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.greetingTimer) window.clearInterval(this.greetingTimer);
  }

  private updateGreeting(date: Date = new Date()) {
    const h = date.getHours(); // user’s local time
    if (h >= 5 && h < 12) this.greeting = 'Good morning';
    else if (h >= 12 && h < 17) this.greeting = 'Good afternoon';
    else this.greeting = 'Good evening';
  }

  private fetchSchedules() {
    this.isLoading = true;
    this.schedulesService
      .listMine()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res) => {
          this.schedules = res?.schedules ?? [];
          console.log(this.schedules);
        },
        error: () => (this.schedules = []),
      });
  }

  // Toggle helpers
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  closeSidebar() {
    this.isSidebarOpen = false;
  }

  openSchedulePreview(schedule: Schedule) {
    this.selectedSchedule = schedule;
    this.drawerOpen = true;
  }

  closeDrawer() {
    this.drawerOpen = false;
    // this.selectedSchedule = null;
  }

  editSchedule(schedule: Schedule) {
    // Navigate to edit mode
    this.router.navigate(['/add-schedule'], {
      queryParams: {
        edit: true,
        id: schedule.id,
      },
    });
  }

  loadAllSchedules() {
    const saved = localStorage.getItem('schedulr-schedules');

    if (saved) {
      console.log(JSON.parse(saved));
      this.schedules = JSON.parse(saved);
    } else {
      console.log('not found');
    }

    return saved ? JSON.parse(saved) : [];
  }

  loadSpecificSchedule(id: number) {
    const schedules = this.loadAllSchedules();
    return schedules.find((schedule: any) => schedule.id === id);
  }

  downloadSchedule(schedule: Schedule){
    console.log(schedule)
    const icsContent = generateICSContent(schedule);
    downloadICSFile(icsContent, `${schedule.semester.schedule_name}.ics`)
  }

  exportToICS(id: number) {
    const scheduleData = this.loadSpecificSchedule(id);
    const icsContent = generateICSContent(scheduleData);
    downloadICSFile(icsContent, `${scheduleData.semester.schedule_name}.ics`);
  }



  // Feedback form functions

  selectRating(index: number) {
    this.selectedRating = index;
    this.feedbackForm.patchValue({ rating: index });
  }

  getRatingButtonClass(index: number): string {
    const baseClass = 'flex-1 p-4 rounded-lg border-2 transition-colors';
    if (this.selectedRating === index) {
      return `${baseClass} border-blue-500 bg-blue-50`;
    }
    return `${baseClass} border-gray-200 hover:border-gray-300`;
  }

  isFormValid(): boolean {
    return this.feedbackForm.get('rating')?.valid ?? false;
  }

  onSubmit() {
    if (this.isFormValid()) {
      const formValue = {
        ...this.feedbackForm.value,
        ratingLabel: this.emojiOptions[this.selectedRating]?.label
      };
      this.onClose();
    }
  }

  onClose() {
    this.isFeedbackDialogOpen = false;
    this.resetForm();
  }

  private resetForm() {
    this.selectedRating = -1;
    this.feedbackForm.reset({
      rating: '',
      feedback: '',
      contactPermission: true,
      joinBeta: false
    });
  }
}
