import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';

declare const google: any;

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  private userSubject = new BehaviorSubject<GoogleUser | null>(null);
  public user$ = this.userSubject.asObservable();
  private initialized = false;
  private scriptLoaded = false;
  private clientId?: string;
  private loginUri?: string;

  private loadGisScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof google !== 'undefined' && google.accounts?.id) return resolve();
      const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]') as HTMLScriptElement | null;
      if (existing) { existing.addEventListener('load', () => resolve()); existing.addEventListener('error', () => reject()); return; }
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client'; s.async = true; s.defer = true;
      s.onload = () => resolve(); s.onerror = () => reject();
      document.head.appendChild(s);
    });
  }

  async initRedirectMode(clientId: string, loginUri: string) {
    if (!this.scriptLoaded) {
      await this.loadGisScript();
      this.scriptLoaded = true;
    }
    if (this.initialized) return;

    google.accounts.id.initialize({
      client_id: clientId,
      ux_mode: 'redirect',
      login_uri: loginUri,
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    this.initialized = true;
  }

  renderRedirectButton(container: HTMLElement) {
    if (!google?.accounts?.id) return;
    google.accounts.id.renderButton(container, {
      theme: 'outline',
      size: 'large',
      type: 'standard',
      shape: 'pill',
      width: container.clientWidth || 320,
      logo_alignment: 'left',
      text: 'continue_with',
    });
  }

  // Optional: pass a moment callback to inspect why it didn’t proceed
//   promptSignIn() {
//   const showWhy = (notification: any) => {
//     console.log('[GIS moment]', {
//       isDisplayed: notification.isDisplayed(),
//       isNotDisplayed: notification.isNotDisplayed() && notification.getNotDisplayedReason?.(),
//       isSkipped: notification.isSkippedMoment() && notification.getSkippedReason?.(),
//       momentType: notification.getMomentType?.(),
//     });
//   };

//   if (!this.initialized && this.clientId && this.loginUri) {
//     this.initRedirectMode(this.clientId, this.loginUri).then(() => {
//       google?.accounts?.id?.prompt(showWhy);
//     });
//     return;
//   }
//   google?.accounts?.id?.prompt(showWhy); // On success, browser navigates (POST) to login_uri
// }

  // Hydrate session-backed user on app start / after redirect
  async checkExistingAuth(): Promise<void> {
    try {
      const res = await fetch('http://localhost:2005/api/schedulr/google-auth/me', {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) { this.userSubject.next(null); return; }
      const data = await res.json();
      this.userSubject.next(data?.user ?? null);
    } catch {
      this.userSubject.next(null);
    }
  }

  

  //  private loadGoogleScript(): Promise<void> {
  //   return new Promise((resolve) => {
  //     if (typeof google !== 'undefined' && google.accounts) {
  //       resolve();
  //       return;
  //     }

  //     const script = document.createElement('script');
  //     script.src = 'https://accounts.google.com/gsi/client';
  //     script.onload = () => resolve();
  //     document.head.appendChild(script);
  //   });
  // }

  //  private initializeGoogleAuth(): void {
  //   if (typeof google === 'undefined' || !google.accounts) {
  //     console.error('Google Identity Services not loaded');
  //     return;
  //   }

  //   google.accounts.id.initialize({
  //     client_id: this.clientId,
  //     // callback: (response: any) => this.handleCredentialResponse(response),
  //     auto_select: false,
  //     cancel_on_tap_outside: true,
  //     use_fedcm_for_prompt: true // Enable FedCM
  //   });
  // }

  // private handleCredentialResponse(response: any): void {
  //   console.log('Credential response:', response);
    
  //   // try {
  //   //   const payload = this.decodeJwtResponse(response.credential);
      
  //   //   const user: GoogleUser = {
  //   //     id: payload.sub,
  //   //     email: payload.email,
  //   //     name: payload.name,
  //   //     picture: payload.picture,
  //   //     given_name: payload.given_name,
  //   //     family_name: payload.family_name
  //   //   };

  //   //   this.userSubject.next(user);
  //   //   localStorage.setItem('google_user', JSON.stringify(user));
  //   //   localStorage.setItem('google_token', response.credential);
  //   // } catch (error) {
  //   //   console.error('Error handling credential response:', error);
  //   // }
  // }



  // signInWithPopup(): Promise<GoogleUser> {
  //   return new Promise((resolve, reject) => {
  //     if (typeof google === 'undefined' || !google.accounts) {
  //       reject('Google Identity Services not available');
  //       return;
  //     }

  //     google.accounts.id.initialize({
  //       client_id: this.clientId,
  //       callback: (response: any) => {
  //         try {
  //           const payload = this.decodeJwtResponse(response.credential);
  //           const user: GoogleUser = {
  //             id: payload.sub,
  //             email: payload.email,
  //             name: payload.name,
  //             picture: payload.picture,
  //             given_name: payload.given_name,
  //             family_name: payload.family_name
  //           };
            
  //           this.userSubject.next(user);
  //           localStorage.setItem('google_user', JSON.stringify(user));
  //           localStorage.setItem('google_token', response.credential);
  //           resolve(user);
  //         } catch (error) {
  //           reject(error);
  //         }
  //       }
  //     });
      
  //     // Use the newer method without deprecated callback
  //     google.accounts.id.prompt();
  //   });
  // }

  // Optional: if you add a backend logout route, call it here and clear local state
  async logout(): Promise<void> {
    try {
      await fetch(`${environment.apiBase}/api/schedulr/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {}
    this.userSubject.next(null);
  }

  // getCurrentUser(): GoogleUser | null {
  //   return this.userSubject.value;
  // }

  // isSignedIn(): boolean {
  //   return this.userSubject.value !== null;
  // }

  // Check if user is already signed in on app initialization
  // checkExistingAuth(): void {
  //   const savedUser = localStorage.getItem('google_user');
  //   const savedToken = localStorage.getItem('google_token');
    
  //   if (savedUser && savedToken) {
  //     try {
  //       const user = JSON.parse(savedUser);
  //       // Verify token is still valid (you might want to add token validation)
  //       this.userSubject.next(user);
  //     } catch (error) {
  //       console.error('Error parsing saved user data:', error);
  //       this.signOut(); // Clear invalid data
  //     }
  //   }
  // }

  // handleSuccessfulAuth(user: GoogleUser, token: string): void {
  //   this.userSubject.next(user);
  //   localStorage.setItem('google_user', JSON.stringify(user));
  //   localStorage.setItem('google_token', token);
  // }

  // getToken(): string | null {
  //   return localStorage.getItem('google_token');
  // }
}
