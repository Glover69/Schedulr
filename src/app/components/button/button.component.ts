import { Component, Input } from '@angular/core';
import { LottieComponent } from 'ngx-lottie';
import {CommonModule, NgClass} from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-button',
  imports: [LottieComponent, CommonModule, NgClass, RouterModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  @Input() hasIcon: boolean = false;
  @Input() iconPath: string = '';
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Input() isLoadingKey: string = '';
  isLoadingChange: { [key: string]: boolean } = {};
  @Input() disabled: any;
  @Input() label: string = 'Label';
  @Input() type: string = 'submit';
  @Input() clickFunction?: () => Promise<any> | void;
  @Input() routerLink?: string | any[]; 
  
  // External loading flag for use with (ngSubmit)
  @Input() externalLoading: boolean = false;

  lottieConfig = {
    path: '/lottie/loader-2.json', // Relative path to the animation file
    autoplay: true, // Autoplay the animation
    loop: true, // Loop the animation
  };

  constructor() {}

  handleClick() {
    if (this.clickFunction) {
      // Set loading true before calling the function
      this.setLoading(true);
      const result = this.clickFunction();
      if (result && result.finally) {
        result.finally(() => this.setLoading(false));
      } else {
        this.setLoading(false);
      }
    }
  }

  setLoading(loading: boolean) {
    this.isLoadingChange[this.isLoadingKey] = loading;
  }
}
