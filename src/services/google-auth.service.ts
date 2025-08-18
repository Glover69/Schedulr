import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

declare const google: any;

export interface GoogleUser {
  uid: string;
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
  private hydrated = false;
  private apiUrl = environment.apiRoute

  constructor(private http: HttpClient) {}

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

  async initRedirectMode(clientId: string,) {
    if (!this.scriptLoaded) {
      await this.loadGisScript();
      this.scriptLoaded = true;
    }
    if (this.initialized) return;

    google.accounts.id.initialize({
      client_id: clientId,
      ux_mode: 'redirect',
      login_uri: `${window.location.origin}/api/schedulr/google-auth/auth-callback`,
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

  async hydrate(): Promise<void> {
    if (this.hydrated) return;
    try {
      const res = await firstValueFrom(
        this.http.get<{ user: GoogleUser }>(`${this.apiUrl}/schedulr/google-auth/me`, { withCredentials: true })
      );
      // console.log(res)
      this.userSubject.next(res?.user ?? null);
      // console.log(await firstValueFrom(this.user$))
    } catch {
      this.userSubject.next(null);
    } finally {
      this.hydrated = true;
    }
  }

  // Optional refresh triggers (e.g., on tab focus)
  async refresh(): Promise<void> {
    this.hydrated = false;
    await this.hydrate();
  }

  getCurrentUser(): GoogleUser | null {
    // console.log(this.userSubject.value)
    return this.userSubject.value;
  }

  // Optional: if you add a backend logout route, call it here and clear local state
  async logout(): Promise<void> {
    try {
      await fetch(`${this.apiUrl}/schedulr/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {}
    this.userSubject.next(null);
  }
}
