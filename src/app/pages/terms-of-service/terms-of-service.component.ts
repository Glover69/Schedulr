import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terms-of-service',
  imports: [CommonModule],
  templateUrl: './terms-of-service.component.html',
  styleUrl: './terms-of-service.component.css'
})
export class TermsOfServiceComponent {
  
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/']);
  }
}
