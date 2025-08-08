import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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
declare const google: any;


@Component({
  selector: 'app-auth',
  imports: [CommonModule, ButtonComponent, LabelComponent, InputRegularComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements AfterViewInit {
  @ViewChild('googleBtnOverlay', { static: false }) googleBtnOverlay?: ElementRef<HTMLDivElement>;
  clientId = environment.googleClientId
  user: GoogleUser | null = null;
  isLoading = false;
  loginUri = 'http://localhost:2005/api/schedulr/google-auth/auth-callback';

  constructor(
    private googleAuthService: GoogleAuthService,
    private router: Router
  ) {
    // (window as any).handleCredentialResponse = this.handleCredentialResponse.bind(this);
  }

  // ngOnInit(): void {
  //   // Subscribe to user changes
  //   this.googleAuthService.user$.subscribe({
  //     next: (user: any) => {
  //       this.user = user;
  //       if (user) {
  //         // Redirect to dashboard or main app after successful login
  //         this.router.navigate(['/home']);
  //       }
  //     },
  //   });

  //   // Check if user is already authenticated
  //   this.googleAuthService.checkExistingAuth();

  //   // Initialize GIS in redirect mode once
  //   this.googleAuthService.initRedirectMode(this.clientId, this.loginUri);
  // }

  async ngAfterViewInit() {
    await this.googleAuthService.initRedirectMode(this.clientId, this.loginUri);
    if (this.googleBtnOverlay?.nativeElement) {
      this.googleAuthService.renderRedirectButton(this.googleBtnOverlay.nativeElement);
    }
    // Optional: hydrate if already logged in
    this.googleAuthService.checkExistingAuth();
  }

  // handleGoogleLogin() {
  //   // Trigger Google Sign-In programmatically
  //   if (typeof google !== 'undefined' && google.accounts) {
  //     google.accounts.id.prompt((notification: any) => {
  //       if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
  //         // Fallback: redirect to Google OAuth directly
  //         window.location.href = `https://accounts.google.com/oauth/authorize?client_id=${this.clientId}&redirect_uri=${encodeURIComponent('http://localhost:2005/api/schedulr/google-auth/auth-callback')}&response_type=code&scope=openid%20email%20profile`;
  //       }
  //     });
  //   } else {
  //     // Direct redirect fallback
  //     window.location.href = `https://accounts.google.com/oauth/authorize?client_id=${this.clientId}&redirect_uri=${encodeURIComponent('http://localhost:2005/api/schedulr/google-auth/auth-callback')}&response_type=code&scope=openid%20email%20profile`;
  //   }
  // }

  // handleGoogleLogin() {
  //   this.googleAuthService.promptSignIn(); // Shows account chooser, then redirects to backend
  // }

  // handleCredentialResponse(response: any): void {
  //   // This will be called by Google's HTML button
  //   console.log('Credential response:', response);
  //   // The service will handle the response automatically
  // }

  // signInWithGoogle(): void {
  //   this.isLoading = true;
  //   this.googleAuthService
  //     .signInWithPopup()
  //     .then((user: GoogleUser) => {
  //       console.log('Sign-in successful:', user);
  //       this.isLoading = false;
  //     })
  //     .catch((error) => {
  //       console.error('Sign-in failed:', error);
  //       this.isLoading = false;
  //     });
  // }

  // signOut(): void {
  //   this.googleAuthService.signOut();
  // }
}
