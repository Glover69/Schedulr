import { CommonModule } from '@angular/common';
import { Component, ContentChildren, EventEmitter, HostBinding, Input, Output, QueryList } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

export type ButtonProps = {
  id?: string;
  name?: string;               
  value?: string;              
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  hierarchy?: 'primary' | 'secondary' | 'secondary-gray' | 'tertiary' | 'tertiary-gray' | 'link-color' | 'link-gray';
  type?: 'button' | 'submit' | 'reset'; // NEW
  icon?: 'false' | 'leading' | 'trailing' | 'only';
  isDestructive?: boolean;
  text?: string | null;
  iconName?: string | null;
  iconStyle?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone' | null;
  disabled?: boolean;
  loading?: boolean
}

@Component({
  selector: 'app-button-groups',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './button-groups.component.html',
  styleUrl: './button-groups.component.css'
})
export class ButtonGroupsComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() hierarchy: string = ''; // optional cascade
  @Input() label: string = '';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() name?: string;
  @Input() value?: string;


  @Input() buttons: ButtonProps[] = []

  // click re-emitter
  @Output() buttonClick = new EventEmitter<{ index: number; item: ButtonProps; event: MouseEvent }>();

  onItemClick(index: number, item: ButtonProps, event: MouseEvent) {
    this.buttonClick.emit({ index, item, event });
  }


  // Host bindings for a11y and CSS hooks
  // @HostBinding('attr.role') get role() {
  //   return this.style === 'toolbar' ? 'toolbar' : 'group';
  // }
  // @HostBinding('attr.aria-label') get ariaLabel() {
  //   return this.label || (this.style === 'toolbar' ? 'Button toolbar' : 'Button group');
  // }
  // @HostBinding('attr.data-orientation') get dataOrientation() { return this.orientation; }
  // @HostBinding('attr.data-style') get dataStyle() { return this.style; }
  // @HostBinding('class') hostClass = '';

  // ngAfterContentInit(): void {
  //   this.updateHostClass();
  //   this.cascadeToChildren();
  //   this.buttons.changes.subscribe(() => this.cascadeToChildren());
  // }

  // ngOnChanges(): void {
  //   this.updateHostClass();
  //   this.cascadeToChildren();
  // }

  // private updateHostClass() {
  //   const base = 'inline-flex items-stretch';
  //   const dir = this.orientation === 'vertical' ? 'flex-col' : 'flex-row';
  //   const gap = this.style === 'separated' ? 'gap-2' : '';
  //   this.hostClass = [base, dir, gap].filter(Boolean).join(' ');
  // }

  // // Light cascade: only set if the child didn’t explicitly receive a value
  // private cascadeToChildren() {
  //   if (!this.buttons) return;
  //   this.buttons.forEach((btn) => {
  //     if ((btn as any).size == null) (btn as any).size = this.size;
  //     if (this.hierarchy && (btn as any).hierarchy == null) (btn as any).hierarchy = this.hierarchy as any;
  //   });
  // }

}
