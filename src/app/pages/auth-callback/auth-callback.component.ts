import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth-callback',
  imports: [CommonModule],
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.css'
})
export class AuthCallbackComponent {
  isProcessing = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Handle the credential from Google's POST request
    this.handleAuthCallback();
  }

  private handleAuthCallback(): void {
    // Check URL parameters for authentication data from your backend
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const user = params['user'];
      const error = params['error'];

      if (error) {
        this.error = error;
        this.isProcessing = false;
        return;
      }

      if (token && user) {
        try {
          // Parse user data if it's JSON string
          const userData = typeof user === 'string' ? JSON.parse(user) : user;
          
          // Redirect to dashboard
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1000); // Small delay to show success message
          
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
          this.error = 'Failed to process authentication data';
          this.isProcessing = false;
        }
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth']);
  }

}
