import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputRegularComponent } from '../../components/inputs/input-regular/input-regular.component';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-add-schedule',
  imports: [
    CommonModule,
    InputRegularComponent,
    ReactiveFormsModule,
    ButtonComponent,
  ],
  templateUrl: './add-schedule.component.html',
  styleUrl: './add-schedule.component.css',
})
export class AddScheduleComponent {
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

  // New properties for consistent times and rooms (no longer needed globally)
  // keepTimesConstant = false;
  // keepRoomsConstant = false;

  form: FormGroup;
  classForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      semester: this.fb.group({
        schedule_name: ['', Validators.required],
        start_date: ['', Validators.required],
        end_date: ['', Validators.required],
        // excluded_dates: this.fb.array([])
      }),
      classes: this.fb.array([]),
    });

    this.classForm = this.fb.group({
      course_name: ['', Validators.required],
      color: ['', Validators.required],
      color_light: ['', Validators.required],
      days: this.fb.array([]),
    });
  }

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
      room: ['', Validators.required],
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
    } else {
      this.classForm.markAllAsTouched();
      this.days.controls.forEach((control) => control.markAllAsTouched());
    }
  }

  // // Method to add class to schedule
  // addClass() {
  //   this.classes.push(this.classForm.value);
  //   this.classForm.reset();
  //   while (this.days.length) {
  //     this.days.removeAt(0);
  //   }
  // }

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
  } else {
    console.log('Please add at least one class before continuing');
  }
}
}
