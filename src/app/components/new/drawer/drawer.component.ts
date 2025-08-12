import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-drawer',
  imports: [CommonModule],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.css'
})
export class DrawerComponent {
  isOpen: boolean = false;
  @ViewChild('drawer', { static: false }) drawerRef!: ElementRef;
  onTouched = () => {};

  @Input()
  get open(): boolean { return this.isOpen; }
  set open(v: boolean) {
    const next = !!v;
    if (next === this.isOpen) return;
    next ? this.openDrawer() : this.closeDrawer();
  }

  @Output() openChange = new EventEmitter<boolean>();

  @HostListener('document:keydown.escape')
  onEsc() { this.closeDrawer(); }

  private lockScroll(lock: boolean) {
    document.body.style.overflow = lock ? 'hidden' : '';
  }



  animateDrawer(state: string) {
    const element = this.drawerRef?.nativeElement;
    if (!element) return;

    switch (state) {
      case 'open':
        // Element already starts at translateY(100%) from CSS
        gsap.fromTo(
          element,
          { y: '100%' },
          {
            y: 0, // Animate to final position
            duration: 0.25,
            ease: 'power3.out',
            onStart: () => this.lockScroll(true)
          }
        );
        break;
      case 'close':
        gsap.to(element, {
          y: '100%', // Animate back down
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

  // toggleDrawer() {
  //   if (this.isOpen) return;

  //   this.isOpen = true;
  //   setTimeout(() => {
  //     const element = this.drawerRef?.nativeElement;
  //     if (element) {
  //       // Kill any existing animations first
  //       gsap.killTweensOf(element);

  //       // Then animate
  //       this.animateDrawer('open');
  //     }
  //   }, 0);
  // }

  openDrawer() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.openChange.emit(true); // notify parent immediately

    // Wait for *ngIf to render the element, then animate
    requestAnimationFrame(() => {
      const element = this.drawerRef?.nativeElement;
      if (element) {
        gsap.killTweensOf(element);
        this.animateDrawer('open');
      }
    });
  }

  toggleDrawer() {
    this.isOpen ? this.closeDrawer() : this.openDrawer();
  }

  closeDrawer() {
    if (!this.isOpen) return;
     const element = this.drawerRef?.nativeElement;
    if (element) {
      gsap.killTweensOf(element);
      this.animateDrawer('close');
    }else {
      // Fallback if element already gone
      this.isOpen = false;
      this.lockScroll(false);
      this.openChange.emit(false);
    }
    this.onTouched();
  }

}
