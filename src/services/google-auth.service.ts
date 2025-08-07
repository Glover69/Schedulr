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

  private clientId = environment.googleClientId; // Replace with your actual client ID
  private userSubject = new BehaviorSubject<GoogleUser | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor() {
    this.loadGoogleScript().then(() => {
      this.initializeGoogleAuth();
    });
  }

   private loadGoogleScript(): Promise<void> {
    return new Promise((resolve) => {
      if (typeof google !== 'undefined' && google.accounts) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }

   private initializeGoogleAuth(): void {
    if (typeof google === 'undefined' || !google.accounts) {
      console.error('Google Identity Services not loaded');
      return;
    }

    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: (response: any) => this.handleCredentialResponse(response),
      auto_select: false,
      cancel_on_tap_outside: true,
      use_fedcm_for_prompt: true // Enable FedCM
    });
  }

  private handleCredentialResponse(response: any): void {
    try {
      const payload = this.decodeJwtResponse(response.credential);
      
      const user: GoogleUser = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        given_name: payload.given_name,
        family_name: payload.family_name
      };

      this.userSubject.next(user);
      localStorage.setItem('google_user', JSON.stringify(user));
      localStorage.setItem('google_token', response.credential);
    } catch (error) {
      console.error('Error handling credential response:', error);
    }
  }


  private decodeJwtResponse(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  signIn(): void {
    if (typeof google === 'undefined' || !google.accounts) {
      console.error('Google Identity Services not available');
      return;
    }
    google.accounts.id.prompt();
  }

  signInWithPopup(): Promise<GoogleUser> {
    return new Promise((resolve, reject) => {
      if (typeof google === 'undefined' || !google.accounts) {
        reject('Google Identity Services not available');
        return;
      }

      google.accounts.id.initialize({
        client_id: this.clientId,
        callback: (response: any) => {
          try {
            const payload = this.decodeJwtResponse(response.credential);
            const user: GoogleUser = {
              id: payload.sub,
              email: payload.email,
              name: payload.name,
              picture: payload.picture,
              given_name: payload.given_name,
              family_name: payload.family_name
            };
            
            this.userSubject.next(user);
            localStorage.setItem('google_user', JSON.stringify(user));
            localStorage.setItem('google_token', response.credential);
            resolve(user);
          } catch (error) {
            reject(error);
          }
        }
      });
      
      // Use the newer method without deprecated callback
      google.accounts.id.prompt();
    });
  }

  signOut(): void {
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.disableAutoSelect();
    }
    this.userSubject.next(null);
    localStorage.removeItem('google_user');
    localStorage.removeItem('google_token');
  }

  getCurrentUser(): GoogleUser | null {
    return this.userSubject.value;
  }

  isSignedIn(): boolean {
    return this.userSubject.value !== null;
  }

  // Check if user is already signed in on app initialization
  checkExistingAuth(): void {
    const savedUser = localStorage.getItem('google_user');
    const savedToken = localStorage.getItem('google_token');
    
    if (savedUser && savedToken) {
      try {
        const user = JSON.parse(savedUser);
        // Verify token is still valid (you might want to add token validation)
        this.userSubject.next(user);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        this.signOut(); // Clear invalid data
      }
    }
  }

  handleSuccessfulAuth(user: GoogleUser, token: string): void {
    this.userSubject.next(user);
    localStorage.setItem('google_user', JSON.stringify(user));
    localStorage.setItem('google_token', token);
  }
}
