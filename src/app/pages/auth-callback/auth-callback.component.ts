import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleAuthService } from '../../../services/google-auth.service';

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
    private googleAuthService: GoogleAuthService
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
          
          // Update the auth service with the user data
          this.googleAuthService.handleSuccessfulAuth(userData, token);
          
          // Redirect to dashboard
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1000); // Small delay to show success message
          
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
          this.error = 'Failed to process authentication data';
          this.isProcessing = false;
        }
      } else {
        // If no params, check localStorage for any stored auth data
        this.checkStoredAuth();
      }
    });
  }


  private checkStoredAuth(): void {
    // Check if your backend stored auth data in localStorage
    const storedToken = localStorage.getItem('google_token');
    const storedUser = localStorage.getItem('google_user');

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        this.googleAuthService.handleSuccessfulAuth(userData, storedToken);
        this.router.navigate(['/dashboard']);
      } catch (error) {
        console.error('Error with stored auth data:', error);
        this.handleAuthError('Invalid stored authentication data');
      }
    } else {
      this.handleAuthError('No authentication data received');
    }
  }


  private handleAuthError(message: string): void {
    this.error = message;
    this.isProcessing = false;
    
    // Clear any invalid stored data
    localStorage.removeItem('google_token');
    localStorage.removeItem('google_user');
  }

  retryAuth(): void {
    this.isProcessing = true;
    this.error = null;
    this.handleAuthCallback();
  }

  // private handleGoogleCallback(): void {
  //   // Check if there's credential data in the URL or form data
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const credential = urlParams.get('credential');
    
  //   if (credential) {
  //     this.processCredential(credential);
  //   } else {
  //     // If no credential in URL, check for POST data
  //     // Note: In a real application, you might need to handle this differently
  //     // depending on how your server/routing is set up
  //     this.error = 'No credential received from Google';
  //     console.log(this.error)
  //     this.isProcessing = false;
  //   }
  // }


  // private processCredential(credential: string): void {
  //   try {
  //     // Process the JWT token
  //     const payload = this.decodeJwtResponse(credential);
      
  //     const user = {
  //       id: payload.sub,
  //       email: payload.email,
  //       name: payload.name,
  //       picture: payload.picture,
  //       given_name: payload.given_name,
  //       family_name: payload.family_name
  //     };

  //     // Update the auth service
  //     this.googleAuthService.handleSuccessfulAuth(user, credential);
      
  //     // Redirect to dashboard
  //     this.router.navigate(['/home']);
      
  //   } catch (error) {
  //     console.error('Error processing credential:', error);
  //     this.error = 'Failed to process authentication';
  //     this.isProcessing = false;
  //   }
  // }

  goToLogin(): void {
    this.router.navigate(['/auth']);
  }

}
