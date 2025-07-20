// date-picker.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { animateDrawer } from '../../../../utils/normal-functions';
import gsap from 'gsap';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
})
export class DatePickerComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = 'Select a date';
  @Input() required: boolean = false;
  @ViewChild('drawer', { static: false }) drawerRef!: ElementRef;

  value: string = '';
  isOpen: boolean = false;

  // Calendar state
  currentMonth: Date = new Date();
  selectedDate: Date | null = null;

  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // ControlValueAccessor methods
  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this.value = value;
    if (value) {
      this.selectedDate = new Date(value);
      this.currentMonth = new Date(this.selectedDate);
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  animateDrawer(state: string) {
    const element = this.drawerRef?.nativeElement;
    if (!element) return;

    switch (state) {
      case 'open':
        // Element already starts at translateY(100%) from CSS
        gsap.to(element, {
          y: 0, // Animate to final position
          duration: 0.25,
          ease: 'power3.out',
        });
        break;
      case 'close':
        gsap.to(element, {
          y: '100%', // Animate back down
          duration: 0.25,
          ease: 'power3.in',
          onComplete: () => {
            this.isOpen = false;
          },
        });
        break;
    }
  }

  // Calendar methods
  toggleCalendar() {
    if (this.isOpen) return;

    this.isOpen = true;
    setTimeout(() => {
      const element = this.drawerRef?.nativeElement;
      if (element) {
        // Kill any existing animations first
        gsap.killTweensOf(element);

        // Set initial position
        // gsap.set(element, { y: '100%' });

        // Then animate
        this.animateDrawer('open');
      }
    }, 0);
  }

  // closeCalendar() {
  //   setTimeout(() => {
  //     this.animateDrawer('close');
  //   }, 0)
  //   this.onTouched();
  // }

  closeCalendar() {
    if (!this.isOpen) return; // Prevent closing if already closed

    const element = this.drawerRef?.nativeElement;
    if (element) {
      gsap.killTweensOf(element);
      this.animateDrawer('close');
    }
    this.onTouched();
  }

  previousMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1
    );
  }

  nextMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1
    );
  }

  getDaysInMonth(): (number | null)[] {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Get first day of week (0 = Sunday, 1 = Monday, etc.)
    let startingDayOfWeek = firstDay.getDay();
    // Convert to Monday = 0 format
    startingDayOfWeek = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    const days: (number | null)[] = [];

    // Add empty cells for previous month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }

  selectDate(day: number | null) {
    if (day) {
      const selectedDate = new Date(
        this.currentMonth.getFullYear(),
        this.currentMonth.getMonth(),
        day
      );
      this.selectedDate = selectedDate;

      // Format as YYYY-MM-DD for form compatibility
      const formattedDate = selectedDate.toISOString().split('T')[0];
      this.value = formattedDate;
      this.onChange(formattedDate);
      this.closeCalendar();
    }
  }

  isSelectedDate(day: number | null): boolean {
    if (!this.selectedDate || !day) return false;

    return (
      this.selectedDate.getDate() === day &&
      this.selectedDate.getMonth() === this.currentMonth.getMonth() &&
      this.selectedDate.getFullYear() === this.currentMonth.getFullYear()
    );
  }

  formatDisplayDate(): string {
    if (!this.selectedDate) return this.placeholder;

    const day = this.selectedDate.getDate().toString().padStart(2, '0');
    const month = (this.selectedDate.getMonth() + 1)
      .toString()
      .padStart(2, '0');
    const year = this.selectedDate.getFullYear();

    return `${day}.${month}.${year}`;
  }
}
