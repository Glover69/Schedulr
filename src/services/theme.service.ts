import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private currentTheme = new BehaviorSubject<Theme>('system');
  public theme$ = this.currentTheme.asObservable();

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    // Add preload class initially
    document.documentElement.classList.add('preload');

    const saved = localStorage.getItem('theme') as Theme;
    this.setTheme(saved || 'system');

    // Remove preload after a brief delay
    setTimeout(() => {
      document.documentElement.classList.remove('preload');
    }, 100);
  }

  setTheme(theme: Theme) {
    // Remove preload class to enable transitions
    document.documentElement.classList.remove('preload');

    // Apply theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // system
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    }

    this.currentTheme.next(theme);
    localStorage.setItem('theme', theme);
  }

  getCurrentTheme(): Theme {
    return this.currentTheme.value;
  }
}
