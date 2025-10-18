import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ToastService } from '../../../services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  generateICSContent,
  downloadICSFile,
} from '../../../utils/calendar-export.utils';
import { InputFieldBaseComponent } from '../../components/new/input-field-base/input-field-base.component';
import { DatePickerComponent } from '../../components/new/date-picker/date-picker.component';
import { ButtonComponent } from '../../components/new/button/button.component';
import { TimePickerComponent } from '../../components/new/time-picker/time-picker.component';
import { DrawerComponent } from '../../components/new/drawer/drawer.component';
import { SheetComponent } from '../../components/new/sheet/sheet.component';
import { SchedulesService } from '../../../services/schedules.service';
import { GoogleAuthService } from '../../../services/google-auth.service';

export type StepKey = 'SemInfo' | 'AddClasses' | 'PreviewSchedule';
export type StepStatus = 'done' | 'current' | 'todo';
type PreviewEvent = {
  id: string;
  course_name: string;
  start_time: string;
  end_time: string;
  room?: string;
  color: string;
  color_light: string;
  topOffset: number;
  height: number;
};

@Component({
  selector: 'app-add-schedule',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    DatePickerComponent,
    TimePickerComponent,
    InputFieldBaseComponent,
    DrawerComponent,
    SheetComponent,
  ],
  templateUrl: './add-schedule.component.html',
  styleUrl: './add-schedule.component.css',
})
export class AddScheduleComponent implements OnInit {
  currentStep: StepKey = 'SemInfo';
  steps: { key: StepKey; label: string; summary?: string }[] = [
    { key: 'SemInfo', label: 'Semester info', summary: 'Name and dates' },
    {
      key: 'AddClasses',
      label: 'Add classes',
      summary: 'Courses, days, times',
    },
    { key: 'PreviewSchedule', label: 'Preview', summary: 'Review and save' },
  ];

  stepper = 0;
  stepMap = ['SemInfo', 'AddClasses', 'PreviewSchedule'];
  daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  colorArray = [
    '#1084FE',
    '#00BC7C',
    '#FF9900',
    '#FE2B3A',
    '#9359FF',
    '#02B9D8',
    '#FF6800',
    '#6BCE00',
  ];
  currentDayIndex = 0;
  timeSlots = Array.from({ length: 16 }, (_, i) => i + 8); // 8:00 to 23:00
  availableDays: string[] = [];
  isEditMode = false;
  scheduleID: any;

  form: FormGroup;
  classForm: FormGroup;
  dayEntryForm: FormGroup;

  drawerOpen: boolean = false;
  sheetOpen: boolean = false;
  activeDay: string | null = null;
  editingIndex: number | null = null;

  isLoading = false
  isLoadingFinalize: boolean = false

  sourceDayIndex = 0;
  syncTimes = false;
  syncRooms = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private location: Location,
    private route: ActivatedRoute,
    private schedulesService: SchedulesService,
    private googleAuthServices: GoogleAuthService
  ) {
    this.form = this.fb.group({
      semester: this.fb.group(
        {
          schedule_name: ['', Validators.required],
          start_date: ['', Validators.required],
          end_date: ['', Validators.required],
          // excluded_dates: this.fb.array([])
        },
        { validators: this.dateRangeValidator }
      ),
      classes: this.fb.array([]),
    });

    this.classForm = this.fb.group({
      course_name: ['', [Validators.required]],
      color: ['', Validators.required],
      color_light: ['', Validators.required],
      days: this.fb.array([]),
    });

    this.dayEntryForm = this.fb.group({
      day: [''],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      room: [''],
    });
  }

  ngOnInit() {
    this.scheduleID = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.scheduleID;

    if (this.isEditMode && this.scheduleID) {
      this.loadScheduleForEdit(this.scheduleID);
    }

    this.updateAvailableDays();
  }

  loadScheduleForEdit(scheduleId: string) {
    this.isLoading = true;
    this.schedulesService.getScheduleById(scheduleId).subscribe({
      next: (response) => {
        this.populateFormWithScheduleData(response.schedule);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading schedule for edit:', error);
        this.toastService.showToast(
          'Error loading schedule',
          'Failed to load schedule data for editing.'
        );
        this.isLoading = false;
        this.router.navigate(['/home']);
      }
    });
  }

  populateFormWithScheduleData(schedule: any) {
    // Populate semester form
    this.form.patchValue({
      semester: {
        schedule_name: schedule.semester.schedule_name,
        start_date: schedule.semester.start_date,
        end_date: schedule.semester.end_date
      }
    });

    // Clear existing classes
    while (this.classes.length !== 0) {
      this.classes.removeAt(0);
    }

    // Populate classes
    schedule.classes.forEach((classData: any) => {
      this.classes.push(this.fb.control(classData));
    });

    this.updateAvailableDays();
  }

  get currentStepIndex(): number {
    return Math.max(
      0,
      this.steps.findIndex((s) => s.key === this.currentStep)
    );
  }
  get progressPercent(): number {
    return (this.currentStepIndex / (this.steps.length - 1)) * 100;
  }

  getStepStatus(i: number): StepStatus {
    if (i < this.currentStepIndex) return 'done';
    if (i === this.currentStepIndex) return 'current';
    return 'todo';
  }

  goToStep(step: StepKey) {
    const targetIndex = this.steps.findIndex((s) => s.key === step);
    const currentIndex = this.currentStepIndex;

    // If trying to go backwards, allow it
    if (targetIndex <= currentIndex) {
      this.currentStep = step;
      return;
    }

    // If trying to go forward, validate current step first
    if (!this.isCurrentStepValid()) {
      this.toastService.showToast(
        'Step incomplete',
        'Please complete the current step before proceeding.'
      );
      return;
    }

    // Only allow going to the immediate next step
    if (targetIndex === currentIndex + 1) {
      // If navigating to PreviewSchedule step, call onSubmitSecondStep
      if (step === 'PreviewSchedule') {
        this.onSubmitSecondStep();
      } else {
        this.currentStep = step;
      }
    } else {
      this.toastService.showToast(
        'Steps must be completed in order',
        'Please complete steps sequentially.'
      );
    }

    // Only allow going to the immediate next step
    if (targetIndex === currentIndex + 1) {
      this.currentStep = step;
    } else {
      this.toastService.showToast(
        'Steps must be completed in order',
        'Please complete steps sequentially.'
      );
    }
  }

  // Add this new method to validate the current step
  isCurrentStepValid(): boolean {
    switch (this.currentStep) {
      case 'SemInfo':
        return this.form.get('semester')?.valid ?? false;

      case 'AddClasses':
        return this.classes.length > 0;

      case 'PreviewSchedule':
        return true; // Preview step doesn't need validation

      default:
        return false;
    }
  }

  // nextStep() {
  //   const i = this.currentStepIndex;
  //   if (i < this.steps.length - 1) this.currentStep = this.steps[i + 1].key;
  // }

  nextStep() {
    if (!this.isCurrentStepValid()) {
      this.markCurrentStepAsTouched();
      this.toastService.showToast(
        'Step incomplete',
        'Please complete all required fields before proceeding.'
      );
      return;
    }

    const i = this.currentStepIndex;

    if (i == 1) {
      console.log('hi there!');
    }
    if (i < this.steps.length - 1) this.currentStep = this.steps[i + 1].key;
  }

  prevStep() {
    const i = this.currentStepIndex;
    if (i > 0) this.currentStep = this.steps[i - 1].key;
  }

  markCurrentStepAsTouched() {
    switch (this.currentStep) {
      case 'SemInfo':
        this.form.get('semester')?.markAllAsTouched();
        break;

      case 'AddClasses':
        // No specific form to mark as touched since validation is just checking if classes exist
        break;
    }
  }

  // Add this method to check if a step is accessible
  isStepAccessible(stepKey: StepKey): boolean {
    const targetIndex = this.steps.findIndex((s) => s.key === stepKey);
    const currentIndex = this.currentStepIndex;

    // Current and previous steps are always accessible
    if (targetIndex <= currentIndex) {
      return true;
    }

    // Next step is accessible only if current step is valid
    if (targetIndex === currentIndex + 1 && this.isCurrentStepValid()) {
      return true;
    }

    return false;
  }

  goBack() {
    this.location.back();
  }

  // Add this custom validator method
  dateRangeValidator(formGroup: AbstractControl): ValidationErrors | null {
    const startDate = formGroup.get('start_date')?.value;
    const endDate = formGroup.get('end_date')?.value;

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      return { dateRange: true };
    }
    return null;
  }

  timeRangeValidator(formGroup: AbstractControl): ValidationErrors | null {
    const startTime = formGroup.get('start_time')?.value;
    const endTime = formGroup.get('end_time')?.value;

    console.log('Start & End times: ', startTime, endTime);
    console.log('Is start time greater than end time?: ', startTime > endTime);
    // console.log(new Date().getHours())

    if (startTime && endTime && startTime < endTime) {
      console.log('Lol');
      return { timeRange: true };
    }
    return null;
  }

  // loadAllSchedules() {
  //   const saved = localStorage.getItem('schedulr-schedules');
  //   return saved ? JSON.parse(saved) : [];
  // }

  // loadSpecificSchedule(id: number) {
  //   const schedules = this.loadAllSchedules();
  //   return schedules.find((schedule: any) => schedule.id === id);
  // }

  // get currentStep() {
  //   return this.stepMap[this.stepper];
  // }

  // Class Form getters
  get classes() {
    return this.form.get('classes') as FormArray;
  }

  get days() {
    return this.classForm.get('days') as FormArray;
  }

  openDayDrawer(day: string, editIndex?: number) {
    console.log(day, editIndex);
    this.activeDay = day;
    this.editingIndex = editIndex ?? null;

    if (editIndex != null) {
      const v = this.days.at(editIndex).value;
      this.dayEntryForm.reset({
        day: v.day,
        start_time: v.start_time,
        end_time: v.end_time,
        room: v.room ?? '',
      });
    } else {
      this.dayEntryForm.reset({
        day,
        start_time: '',
        end_time: '',
        room: '',
      });
    }

    this.drawerOpen = true;
  }

  saveDayEntry() {
    if (this.dayEntryForm.invalid) return;

    const payload = this.dayEntryForm.value;

    // Optional: simple time validation (start < end)
    const toMins = (t: string) => {
      const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
      if (!m) return 0;
      let h = +m[1];
      const min = +m[2];
      const ap = m[3]?.toUpperCase();
      if (ap === 'AM' && h === 12) h = 0;
      if (ap === 'PM' && h < 12) h += 12;
      return h * 60 + min;
    };
    if (toMins(payload.start_time) >= toMins(payload.end_time)) return;

    if (this.editingIndex != null) {
      this.days.at(this.editingIndex).patchValue(payload);
    } else {
      this.days.push(this.fb.group(payload));
    }

    this.drawerOpen = false;
    this.activeDay = null;
    this.editingIndex = null;
  }

  removeDayEntry(index: number) {
    this.days.removeAt(index);
  }

  // Used by template to render microcards with their original indices
  getDayEntries(day: string): { index: number; value: any }[] {
    return this.days.controls
      .map((ctrl, idx) => ({ index: idx, value: ctrl.value }))
      .filter((e) => e.value.day === day);
  }

  isDaySelected(day: string): boolean {
    return this.getDayEntries(day).length > 0;
  }

  // Methods to manage days in classForm
  toggleDay(day: string) {
    this.drawerOpen = true;
    const dayIndex = this.days.controls.findIndex(
      (control) => control.value.day === day
    );

    if (dayIndex > -1) {
      // Day is already selected, so remove it
      this.removeDay(dayIndex);
    } else {
      // Day is not selected, so add it
      this.addDay(day);
    }
  }

  // isDaySelected(day: string): boolean {
  //   return this.days.controls.some((control) => control.value.day === day);
  // }

  // Methods to manage days in classForm
  addDay(day: string) {
    const dayForm = this.fb.group({
      day: [day, Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      room: [''],
    });

    this.days.push(dayForm);
    console.log(this.classForm.value);
  }

  removeDay(index: number) {
    this.days.removeAt(index);
  }

  // Method to add class to schedule
  addClass() {
    if (this.classForm.valid) {
      const classData = {
        course_name: this.classForm.get('course_name')?.value,
        color: this.classForm.get('color')?.value,
        color_light: this.classForm.get('color_light')?.value,
        days: this.days.value, // Get the days array value
      };

      // Add the class data as a FormControl to the classes FormArray
      this.classes.push(this.fb.control(classData));

      this.classForm.reset({
        course_name: '',
        color: '',
        color_light: '',
      });

      this.days.clear(); // Clear the days FormArray

      console.log('Added class:', classData);
      console.log('All classes:', this.classes.value);
      this.toastService.showToast(
        'Class added successfully.',
        `Your class, ${classData.course_name} was added successfully!`
      );
    } else {
      this.classForm.markAllAsTouched();
      this.days.controls.forEach((control) => control.markAllAsTouched());
    }
  }

  removeClass(index: number) {
    this.classes.removeAt(index);

    console.log('Removed class at index:', index);
    console.log('Remaining classes:', this.classes.value);

    this.toastService.showToast(
      'Class removed successfully.',
      `Your class, ${this.classes.value[index].course_name} was removed from the list.`
    );

    // Update available days after removing a class
    this.updateAvailableDays();

    // Reset current day index if it's out of bounds
    if (this.currentDayIndex >= this.availableDays.length) {
      this.currentDayIndex = Math.max(0, this.availableDays.length - 1);
    }
  }

  editClass(index: number){
    // Pick the particular class to be edited using it's index
    const classData = this.classes.at(index).value;

    // Reset the add class form with its data
    this.classForm.reset({
      course_name: classData.course_name,
      color: classData.color,
      color_light: classData.color_light,
    });

    // Clear the previous days selected and update it with
    // the days of the class being edited
    this.days.clear();
    classData.days.forEach((dayEntry: any) => {
      this.days.push(
        this.fb.group({
          day: [dayEntry.day, Validators.required],
          start_time: [dayEntry.start_time, Validators.required],
          end_time: [dayEntry.end_time, Validators.required],
          room: [dayEntry.room || ''],
        })
      );
    });

    // Finally remove the class from the list of added classes
    this.classes.removeAt(index);
  }

  getRoomsForClass(days: any[]): string {
    const uniqueRooms = [...new Set(days.map((day) => day.room))];
    return uniqueRooms.join(', ');
  }

  toggleColor(color: string) {
    const currentColor = this.classForm.get('color')?.value;

    if (currentColor === color) {
      // If the color is already selected, deselect it
      this.classForm.patchValue({
        color: '',
        color_light: '',
      });
    } else {
      // Select the new color
      this.classForm.patchValue({
        color: color,
        color_light: color + '20', // Adding transparency for light version
      });
    }
  }

  isColorSelected(color: string): boolean {
    return this.classForm.get('color')?.value === color;
  }

  applyConsistencyFromSource(): void {
    const src = this.days.at(this.sourceDayIndex) as FormGroup;
    if (!src) return;

    const srcStart = src.get('start_time')?.value;
    const srcEnd = src.get('end_time')?.value;
    const srcRoom = src.get('room')?.value;

    this.days.controls.forEach((ctrl, idx) => {
      if (idx === this.sourceDayIndex) return; // skip source itself
      const fg = ctrl as FormGroup;

      if (this.syncTimes) {
        fg.patchValue(
          { start_time: srcStart, end_time: srcEnd },
          { emitEvent: false }
        );
      }
      if (this.syncRooms) {
        fg.patchValue({ room: srcRoom }, { emitEvent: false });
      }
    });
  }

  onChangeSourceIndex(i: number) {
    this.sourceDayIndex = i;
    this.applyConsistencyFromSource();
  }

  onToggleSyncTimes(checked: boolean) {
    this.syncTimes = checked;
    this.applyConsistencyFromSource();
  }

  onToggleSyncRooms(checked: boolean) {
    this.syncRooms = checked;
    this.applyConsistencyFromSource();
  }

  // New methods for per-day consistency
  copyTimeFromPrevious(currentIndex: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked && currentIndex > 0) {
      const previousDay = this.days.at(currentIndex - 1).value;
      const currentDay = this.days.at(currentIndex);

      currentDay.patchValue({
        start_time: previousDay.start_time,
        end_time: previousDay.end_time,
      });
    }
  }

  copyRoomFromPrevious(currentIndex: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked && currentIndex > 0) {
      const previousDay = this.days.at(currentIndex - 1).value;
      const currentDay = this.days.at(currentIndex);

      currentDay.patchValue({
        room: previousDay.room,
      });
    }
  }

  getCompleteSchedulePayload() {
    return {
      semester: this.form.get('semester')?.value,
      classes: this.classes.value,
    };
  }

  onSubmitFirstStep() {
    if (this.form.get('semester')?.valid) {
      this.nextStep();
      console.log(this.form.value);
    } else {
      this.form.get('semester')?.markAllAsTouched();
    }
  }

  onSubmitSecondStep() {
    if (this.classes.length > 0) {
      // Create complete payload for preview
      const completePayload = this.getCompleteSchedulePayload();
      console.log('Complete schedule payload:', completePayload);
      this.nextStep();
      this.updateAvailableDays();
    } else {
      console.log('Please add at least one class before continuing');
    }
  }

  updateAvailableDays() {
    const allDays = new Set<string>();
    this.classes.value.forEach((classItem: any) => {
      classItem.days.forEach((day: any) => allDays.add(day.day));
    });
    this.availableDays = Array.from(allDays).sort((a, b) => {
      const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return dayOrder.indexOf(a) - dayOrder.indexOf(b);
    });
  }

  getCurrentDayName(): string {
    return this.availableDays[this.currentDayIndex] || 'No Days';
  }

  previousDay() {
    if (this.currentDayIndex > 0) {
      this.currentDayIndex--;
    }
  }

  nextDay() {
    if (this.currentDayIndex < this.availableDays.length - 1) {
      this.currentDayIndex++;
    }
  }

  private toMinutes(time: string): number {
    // Accepts "HH:mm" or "h:mm AM/PM"
    if (!time) return 0;
    const m = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!m) return 0;
    let h = parseInt(m[1], 10);
    const mins = parseInt(m[2], 10);
    const ap = m[3]?.toUpperCase();
    if (ap === 'AM' && h === 12) h = 0;
    if (ap === 'PM' && h < 12) h += 12;
    return h * 60 + mins;
  }

  // Returns events overlapping the [hour, hour+1) slot for a given day
  getEventsForDayAndTimeSlot(dayName: string, hour: number): PreviewEvent[] {
    const slotStart = hour * 60;
    const slotEnd = slotStart + 60;

    const items = (this.classes?.value ?? []) as any[];
    const out: PreviewEvent[] = [];

    for (const cls of items) {
      const course = cls.course_name;
      const color = cls.color;
      const color_light = cls.color_light ?? (cls.color_light || '#EEF2FF');

      for (const d of cls.days ?? []) {
        if (d.day !== dayName) continue;

        const start = this.toMinutes(d.start_time);
        const end = this.toMinutes(d.end_time);
        const overlapStart = Math.max(start, slotStart);
        const overlapEnd = Math.min(end, slotEnd);
        if (overlapEnd <= overlapStart) continue;

        out.push({
          id: `${course}-${dayName}-${start}-${end}`,
          course_name: course,
          start_time: d.start_time,
          end_time: d.end_time,
          room: d.room,
          color,
          color_light,
          topOffset: overlapStart - slotStart, // 1px per minute (hour = 60px tall)
          height: overlapEnd - overlapStart,
        });
      }
    }
    return out;
  }

  // Get events for a specific time slot
  getEventsForTimeSlot(hour: number) {
    const currentDay = this.availableDays[this.currentDayIndex];
    const events: any = [];
    const processedEvents = new Set(); // Track which events we've already processed

    this.classes.value.forEach((classItem: any) => {
      classItem.days.forEach((daySchedule: any) => {
        if (daySchedule.day === currentDay) {
          const startHour = parseInt(daySchedule.start_time.split(':')[0]);
          const endHour = parseInt(daySchedule.end_time.split(':')[0]);
          const startMinutes = parseInt(daySchedule.start_time.split(':')[1]);
          const endMinutes = parseInt(daySchedule.end_time.split(':')[1]);

          // Create unique event ID
          const eventId = `${classItem.course_name}-${daySchedule.day}-${daySchedule.start_time}`;

          // Only process this event once, and only if it starts in this hour slot
          if (startHour === hour && !processedEvents.has(eventId)) {
            processedEvents.add(eventId);

            // Calculate total duration and position
            const totalMinutes =
              (endHour - startHour) * 60 + (endMinutes - startMinutes);
            const topOffset = (startMinutes / 60) * 60; // Position within the starting hour
            const totalHeight = (totalMinutes / 60) * 60; // Convert duration to pixels

            events.push({
              id: eventId,
              course_name: classItem.course_name,
              start_time: daySchedule.start_time,
              end_time: daySchedule.end_time,
              room: daySchedule.room,
              color: classItem.color,
              color_light: classItem.color_light,
              topOffset,
              height: totalHeight,
            });
          }
        }
      });
    });

    // console.log(`Hour ${hour}:`, events);
    return events;
  }


finalizeSchedule() {
  this.isLoadingFinalize = true;
  const completePayload = this.getCompleteSchedulePayload();

  const userId = this.googleAuthServices.getCurrentUser()?.uid;

  if (userId) {
    if (this.isEditMode && this.scheduleID) {
      // Update existing schedule
      this.schedulesService.updateSchedule(this.scheduleID, completePayload).subscribe({
        next: (res: any) => {
          console.log('Schedule updated:', res);
          this.toastService.showToast(
            'Schedule updated successfully.',
            `Your schedule, ${completePayload.semester.schedule_name} was updated successfully!`
          );
          this.isLoadingFinalize = false;

          // Navigate after a short delay to show the success state
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1500);
        },
        error: (err: any) => {
          console.error('Error updating schedule:', err);
          this.toastService.showToast(
            'Error updating schedule',
            `An issue was encountered while updating your schedule. Please try again later.`
          );
          this.isLoadingFinalize = false;
        },
      });
    } else {
      // Create new schedule
      this.schedulesService.createSchedule(userId, completePayload).subscribe({
        next: (res: any) => {
          console.log('Schedule created:', res);
          this.toastService.showToast(
            'Schedule saved successfully.',
            `Your schedule, ${completePayload.semester.schedule_name} was saved successfully!`
          );
          this.isLoadingFinalize = false;

          // Navigate after a short delay to show the success state
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1500);
        },
        error: (err: any) => {
          console.error('Error creating schedule:', err);
          this.toastService.showToast(
            'Error saving schedule',
            `An issue was encountered while saving your schedule. Please try again later.`
          );
          this.isLoadingFinalize = false;
        },
      });
    }
  } else {
    console.log('missing user id');
    this.isLoadingFinalize = false;
    return;
  }
}

  exportToICS() {
    const scheduleData = this.getCompleteSchedulePayload();
    const icsContent = generateICSContent(scheduleData);
    downloadICSFile(icsContent, `${scheduleData.semester.schedule_name}.ics`);
  }
}
