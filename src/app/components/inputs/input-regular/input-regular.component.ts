import { CommonModule } from '@angular/common';
import {Component, forwardRef, Input} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-input-regular',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-regular.component.html',
  styleUrl: './input-regular.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputRegularComponent),
      multi: true,
    },
  ],
})
export class InputRegularComponent {
  @Input() label: string = 'Label';
  @Input() placeholder: string = 'Enter value';
  @Input() type: string = 'text';
  @Input() minLength?: number;
  @Input() isLabel: boolean = true;
  @Input() inputType: string = 'text';
  @Input() required: boolean = false;

  value: string = '';
  disabled: boolean = false;



  constructor() {}

  onChange = (item: any) => {};
  onTouched = () => {};

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
    this.onTouched();
  }

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(item : any): void {
    this.onChange = item;
  }

  registerOnTouched(item: any): void {
    this.onTouched = item;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
