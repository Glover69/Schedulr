import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-sheet',
  imports: [CommonModule],
  templateUrl: './sheet.component.html',
  styleUrl: './sheet.component.css'
})
export class SheetComponent {
  isOpen: boolean = false;
  @ViewChild('sheet', { static: false }) sheetRef!: ElementRef;
  onTouched = () => {};

  @Input()
  get open(): boolean { return this.isOpen; }
  set open(v: boolean) {
    const next = !!v;
    if (next === this.isOpen) return;
    next ? this.openSheet() : this.closeSheet();
  }

  @Output() openChange = new EventEmitter<boolean>();

  @HostListener('document:keydown.escape')
  onEsc() { this.closeSheet(); }

  private lockScroll(lock: boolean) {
    document.body.style.overflow = lock ? 'hidden' : '';
  }


  animatesheet(state: string) {
    const element = this.sheetRef?.nativeElement;
    if (!element) return;

    switch (state) {
      case 'open':
        // Element already starts at translateY(100%) from CSS
        gsap.fromTo(
          element,
          { x: '100%' },
          {
            x: 0, // Animate to final position
            duration: 0.25,
            ease: 'power3.out',
            onStart: () => this.lockScroll(true)
          }
        );
        break;
      case 'close':
        gsap.to(element, {
          x: '100%', // Animate back down
          duration: 0.3,
          ease: 'power3.in',
          onComplete: () => {
            this.isOpen = false;
            this.lockScroll(false);
            this.openChange.emit(false);
          },
        });
        break;
    }
  }

  openSheet() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.openChange.emit(true); // notify parent immediately

    // Wait for *ngIf to render the element, then animate
    requestAnimationFrame(() => {
      const element = this.sheetRef?.nativeElement;
      if (element) {
        gsap.killTweensOf(element);
        this.animatesheet('open');
      }
    });
  }

  togglesheet() {
    this.isOpen ? this.closeSheet() : this.openSheet();
  }

  closeSheet() {
    if (!this.isOpen) return;
     const element = this.sheetRef?.nativeElement;
    if (element) {
      gsap.killTweensOf(element);
      this.animatesheet('close');
    }else {
      // Fallback if element already gone
      this.isOpen = false;
      this.lockScroll(false);
      this.openChange.emit(false);
    }
    this.onTouched();
  }

}
