import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputRegularComponent } from '../../components/inputs/input-regular/input-regular.component';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../../components/button/button.component';
import { ToastService } from '../../../services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  generateICSContent,
  downloadICSFile,
} from '../../../utils/calendar-export.utils';
import { DatePickerComponent } from '../../components/inputs/date-picker/date-picker.component';
import { TimePickerComponent } from '../../components/inputs/time-picker/time-picker.component';

@Component({
  selector: 'app-add-schedule',
  imports: [
    CommonModule,
    InputRegularComponent,
    ReactiveFormsModule,
    ButtonComponent,
    DatePickerComponent,
    TimePickerComponent,
  ],
  templateUrl: './add-schedule.component.html',
  styleUrl: './add-schedule.component.css',
})
export class AddScheduleComponent implements OnInit {
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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private location: Location,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      semester: this.fb.group({
        schedule_name: ['', Validators.required],
        start_date: ['', Validators.required],
        end_date: ['', Validators.required],
        // excluded_dates: this.fb.array([])
      }, { validators: this.dateRangeValidator }),
      classes: this.fb.array([]),
    });

    this.classForm = this.fb.group({
      course_name: ['', [Validators.required]],
      color: ['', Validators.required],
      color_light: ['', Validators.required],
      days: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.scheduleID = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.scheduleID;

    if (this.isEditMode && this.scheduleID) {
    }

    this.updateAvailableDays();
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
    const startTime = formGroup.get('start_time')?.value
    const endTime = formGroup.get('end_time')?.value

    console.log("Start & End times: ", startTime, endTime)
    console.log("Is start time greater than end time?: ", startTime > endTime)
    // console.log(new Date().getHours())


    if(startTime && endTime && startTime < endTime){
      console.log("Lol")
      return { timeRange: true }
    }
    return null
  }

  // loadAllSchedules() {
  //   const saved = localStorage.getItem('schedulr-schedules');
  //   return saved ? JSON.parse(saved) : [];
  // }

  // loadSpecificSchedule(id: number) {
  //   const schedules = this.loadAllSchedules();
  //   return schedules.find((schedule: any) => schedule.id === id);
  // }

  get currentStep() {
    return this.stepMap[this.stepper];
  }

  // Class Form getters
  get classes() {
    return this.form.get('classes') as FormArray;
  }

  get days() {
    return this.classForm.get('days') as FormArray;
  }

  // Methods to manage days in classForm
  toggleDay(day: string) {
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

  isDaySelected(day: string): boolean {
    return this.days.controls.some((control) => control.value.day === day);
  }

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

  getRoomsForClass(days: any[]): string {
    const uniqueRooms = [...new Set(days.map((day) => day.room))];
    return uniqueRooms.join(', ');
  }

  nextStep() {
    if (this.stepper < 2) this.stepper++;
  }

  prevStep() {
    if (this.stepper > 0) this.stepper--;
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

    console.log(`Hour ${hour}:`, events);
    return events;
  }

  finalizeSchedule() {
    const completePayload = this.getCompleteSchedulePayload();
    const existingSchedules = JSON.parse(
      localStorage.getItem('schedulr-schedules') || '[]'
    );

    // Add new schedule to array
    existingSchedules.push({
      ...completePayload,
      id: Date.now(), // Add unique ID
      created_at: new Date().toISOString(),
    });

    // Save array back to localStorage
    localStorage.setItem(
      'schedulr-schedules',
      JSON.stringify(existingSchedules)
    );
    console.log('Schedule added to localStorage array:', existingSchedules);

    this.toastService.showToast(
      'Schedule saved successfully.',
      `Your schedule, ${completePayload.semester.schedule_name} was saved successfully!`
    );

    this.exportToICS();

    this.router.navigate(['/']);
  }

  exportToICS() {
    const scheduleData = this.getCompleteSchedulePayload();
    const icsContent = generateICSContent(scheduleData);
    downloadICSFile(icsContent, `${scheduleData.semester.schedule_name}.ics`);
  }
}
