// time-picker.component.ts
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-time-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePickerComponent),
      multi: true
    }
  ]
})
export class TimePickerComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = 'Select time';
  @Input() required: boolean = false;
  @Input() placeholder_two: string = ''
  
  value: string = '';
  isOpen: boolean = false;
  
  selectedHour: string = '09';
  selectedMinute: string = '00';
  selectedPeriod: 'AM' | 'PM' = 'AM';
  
  // Generate hours (01-12)
  hours = Array.from({length: 12}, (_, i) => {
    const hour = i + 1;
    return hour.toString().padStart(2, '0');
  });
  
  // Generate minutes in 30-minute intervals
  minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  
  // ControlValueAccessor methods
  onChange = (value: string) => {};
  onTouched = () => {};
  
  writeValue(value: string): void {
    this.value = value;
    if (value) {
      this.parseTimeValue(value);
    }
  }
  
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  
  parseTimeValue(timeString: string) {
    // Parse "HH:MM" format (24-hour) to 12-hour format
    const [hours, minutes] = timeString.split(':');
    const hour24 = parseInt(hours);
    
    this.selectedMinute = minutes;
    
    if (hour24 === 0) {
      this.selectedHour = '12';
      this.selectedPeriod = 'AM';
    } else if (hour24 < 12) {
      this.selectedHour = hour24.toString().padStart(2, '0');
      this.selectedPeriod = 'AM';
    } else if (hour24 === 12) {
      this.selectedHour = '12';
      this.selectedPeriod = 'PM';
    } else {
      this.selectedHour = (hour24 - 12).toString().padStart(2, '0');
      this.selectedPeriod = 'PM';
    }
  }
  
  formatDisplayTime(): string {
    if (!this.value) return this.placeholder;
    return `${this.selectedHour}:${this.selectedMinute} ${this.selectedPeriod}`;
  }
  
  convertTo24Hour(): string {
    let hour24 = parseInt(this.selectedHour);
    
    if (this.selectedPeriod === 'AM' && hour24 === 12) {
      hour24 = 0;
    } else if (this.selectedPeriod === 'PM' && hour24 !== 12) {
      hour24 += 12;
    }
    
    return `${hour24.toString().padStart(2, '0')}:${this.selectedMinute}`;
  }
  
  toggleTimePicker() {
    this.isOpen = !this.isOpen;
  }
  
  closeTimePicker() {
    this.isOpen = false;
    this.onTouched();
  }
  
  selectHour(hour: string) {
    this.selectedHour = hour;
    this.updateValue();
  }
  
  selectMinute(minute: string) {
    this.selectedMinute = minute;
    this.updateValue();
  }
  
  selectPeriod(period: 'AM' | 'PM') {
    this.selectedPeriod = period;
    this.updateValue();
  }
  
  updateValue() {
    const time24 = this.convertTo24Hour();
    this.value = time24;
    this.onChange(time24);
  }
  
  confirmSelection() {
    this.updateValue();
    this.closeTimePicker();
  }
}