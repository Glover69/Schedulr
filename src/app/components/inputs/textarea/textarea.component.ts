import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, forwardRef, Input } from '@angular/core';

@Component({
  selector: 'app-textarea',
  imports: [],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    }
  ]
})
export class TextareaComponent {
  @Input() label: string = 'Label';
  @Input() placeholder: string = 'Enter value';
  @Input() type: string = 'text';
  @Input() minLength?: number;
  @Input() isLabel: boolean = true;
  @Input() inputType: string = 'text';

  value: string = '';

  constructor() {}

  onChange = (item: any) => {};
  onTouched = () => {};

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
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
}
