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
import { DrawerComponent } from '../../components/new/drawer/drawer.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastService } from '../../../services/toast.service';
import { DialogComponent } from "../../components/new/dialog/dialog.component";

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    ButtonComponent,
    ReactiveFormsModule,
    DrawerComponent,
    InputFieldBaseComponent,
    DialogComponent
],
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
    { icon: '🔥', label: 'Excellent' },
  ];

  feedbackForm: FormGroup;
  selectedRating!: string;

  clientId = environment.googleClientId;
  user!: GoogleUser | null;
  first_name?: string = '';

  // Mobile sidebar state
  isSidebarOpen = false;
  isLoading = true;
  isDeleteLoading: boolean = false;
  isDeleteDialogOpen = false;
  scheduleToDelete: Schedule | null = null;

  greeting = 'Hello';
  private greetingTimer?: number;

  drawerOpen = false;
  selectedSchedule: Schedule | null = null;

  isFeedbackDialogOpen: boolean = false;
  isFeedbackLoading: boolean = false;
  isLogoutLoading: boolean = false;
  isLogoutDialogOpen: boolean = false;

  constructor(
    private googleAuthService: GoogleAuthService,
    private schedulesService: SchedulesService,
    private router: Router,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.feedbackForm = this.fb.group({
      rating: ['', Validators.required],
      message: ['', Validators.required],
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
    if (h >= 0 && h < 12) this.greeting = 'Good morning';
    else if (h >= 12 && h < 16) this.greeting = 'Good afternoon';
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
    // Navigate to edit mode using the proper route
    this.router.navigate(['/add-schedule/edit', schedule.schedule_id]);
  }

  deleteSchedule(schedule: Schedule, event: Event) {
    event.stopPropagation();
    
    // Open confirmation dialog instead of browser confirm
    this.scheduleToDelete = schedule;
    this.isDeleteDialogOpen = true;
  }

  confirmDelete() {
    if (!this.scheduleToDelete) return;
    
    this.isDeleteLoading = true;
    this.schedulesService.deleteSchedule(this.scheduleToDelete.schedule_id).subscribe({
      next: (response) => {
        console.log(response.message);
        this.toastService.showToast(
          'Schedule deleted.',
          `You've deleted your schedule, ${response.deletedSchedule.schedule_name} successfully.`
        );
        
        // Remove from local schedules array
        // this.schedules = this.schedules.filter(s => s.schedule_id !== this.scheduleToDelete!.schedule_id);
        
        this.isDeleteLoading = false;
        this.closeDeleteDialog();

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      },
      error: (error) => {
        console.error('Delete failed:', error);
        this.isDeleteLoading = false;
        this.closeDeleteDialog();
      },
    });
  }

  closeDeleteDialog() {
    this.isDeleteDialogOpen = false;
    this.scheduleToDelete = null;
  }

  // deleteSchedule(schedule: Schedule, event: Event) {
  //   event.stopPropagation();

  //   this.isDeleteLoading = true;
  //   this.schedulesService.deleteSchedule(schedule.schedule_id).subscribe({
  //     next: (response) => {
  //       console.log(response.message);
  //       this.toastService.showToast(
  //       'Schedule deleted.',
  //       `You've deleted your schedule, ${response.deletedSchedule.schedule_name} successfully.`
  //     );
  //     this.isDeleteLoading = false;
  //     },
  //     error: (error) => {
  //       console.error('Delete failed:', error);
  //       this.isDeleteLoading = false;
  //     },
  //   });
  // }

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

  downloadSchedule(schedule: Schedule) {
    console.log(schedule);
    const icsContent = generateICSContent(schedule);
    downloadICSFile(icsContent, `${schedule.semester.schedule_name}.ics`);
  }

  exportToICS(id: number) {
    const scheduleData = this.loadSpecificSchedule(id);
    const icsContent = generateICSContent(scheduleData);
    downloadICSFile(icsContent, `${scheduleData.semester.schedule_name}.ics`);
  }

  // Feedback form functions

  selectRating(label: string) {
    this.selectedRating = label;
    this.feedbackForm.patchValue({ rating: label });
    console.log(this.feedbackForm.get('rating')?.value)
    console.log(this.feedbackForm.value)

  }

  getRatingButtonClass(label: string): string {
    const baseClass = 'flex-1 p-4 rounded-lg border-2 transition-colors';
    if (this.selectedRating === label) {
      return `${baseClass} border-blue-500 bg-blue-50`;
    }
    return `${baseClass} border-gray-200 hover:border-gray-300`;
  }

  // isFormValid(): boolean {
  //   return this.feedbackForm.get('feedback')?.valid && (this.feedbackForm.get('rating')?.valid ?? false);
  // }

  onSubmit() {
    if (this.feedbackForm.valid) {
      this.isFeedbackLoading = true;
      
      const formValue = {
        ...this.feedbackForm.value,
      };

      console.log(formValue)

      this.schedulesService.submitFeedback(formValue).subscribe({
        next: (response) => {
          console.log('Feedback submitted:', response);
          this.toastService.showToast(
            'Thank you for your feedback!',
            'Your feedback has been submitted successfully. We appreciate your input!'
          );
          this.isFeedbackLoading = false;
          this.onClose();
        },
        error: (error) => {
          console.error('Feedback submission failed:', error);
          this.toastService.showToast(
            'Submission failed',
            'There was an error submitting your feedback. Please try again later.'
          );
          this.isFeedbackLoading = false;
        }
      });
    } else {
      // Mark form as touched to show validation errors
      this.feedbackForm.markAllAsTouched();
    }
  }

  onClose() {
    this.isFeedbackDialogOpen = false;
    this.resetForm();
  }

  private resetForm() {
    this.feedbackForm.reset({
      rating: '',
      message: '',
    });
  }

  logout() {
    // Open confirmation dialog instead of logging out immediately
    this.isLogoutDialogOpen = true;
  }

  async confirmLogout() {
    this.isLogoutLoading = true;
    
    try {
      await this.googleAuthService.logout();
      this.toastService.showToast(
        'Logged out successfully',
        'You have been logged out. Redirecting to login...'
      );
      
      // Close dialog first
      this.isLogoutDialogOpen = false;
      this.isLogoutLoading = false;
      
      // Small delay to show the toast, then redirect
      // setTimeout(() => {
      //   this.router.navigate(['/auth']);
      // }, 500);
              this.router.navigate(['/auth']);

    } catch (error) {
      console.error('Logout failed:', error);
      this.toastService.showToast(
        'Logout failed',
        'There was an error logging out. Please try again.'
      );
      this.isLogoutLoading = false;
    }
  }

  closeLogoutDialog() {
    if (!this.isLogoutLoading) {
      this.isLogoutDialogOpen = false;
    }
  }
}
