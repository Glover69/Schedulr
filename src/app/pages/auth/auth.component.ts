import { Component } from '@angular/core';
import {
  GoogleAuthService,
  GoogleUser,
} from '../../../services/google-auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { ButtonComponent } from '../../components/button/button.component';
import { InputRegularComponent } from '../../components/inputs/input-regular/input-regular.component';
import { LabelComponent } from '../../components/label/label.component';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, ButtonComponent, LabelComponent, InputRegularComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  clientId = environment.googleClientId
  user: GoogleUser | null = null;
  isLoading = false;

  constructor(
    private googleAuthService: GoogleAuthService,
    private router: Router
  ) {
    (window as any).handleCredentialResponse = this.handleCredentialResponse.bind(this);
  }

  ngOnInit(): void {
    // Subscribe to user changes
    this.googleAuthService.user$.subscribe({
      next: (user: any) => {
        this.user = user;
        if (user) {
          // Redirect to dashboard or main app after successful login
          this.router.navigate(['/home']);
        }
      },
    });

    // Check if user is already authenticated
    this.googleAuthService.checkExistingAuth();
  }

  handleCredentialResponse(response: any): void {
    // This will be called by Google's HTML button
    console.log('Credential response:', response);
    // The service will handle the response automatically
  }

  signInWithGoogle(): void {
    this.isLoading = true;
    this.googleAuthService
      .signInWithPopup()
      .then((user: GoogleUser) => {
        console.log('Sign-in successful:', user);
        this.isLoading = false;
      })
      .catch((error) => {
        console.error('Sign-in failed:', error);
        this.isLoading = false;
      });
  }

  signOut(): void {
    this.googleAuthService.signOut();
  }
}
