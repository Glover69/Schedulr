import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';
import { GoogleAuthService } from '../services/google-auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private googleAuthService: GoogleAuthService, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    try {
      // Hydrate and wait for the user observable to emit
      await this.googleAuthService.hydrate();
      
      // Wait for the user observable to emit a value (either user or null)
      const user = await firstValueFrom(this.googleAuthService.user$.pipe(take(1)));
      
      console.log('Auth Guard - User:', user);

      if (!user) {
        console.log('Auth Guard - No user found, redirecting to auth');
        this.router.navigate(['/auth'], { queryParams: { redirect: state.url } });
        return false;
      }
      
      console.log('Auth Guard - User authenticated, allowing access');
      return true;
    } catch (error) {
      console.error('Auth Guard - Error during authentication check:', error);
      this.router.navigate(['/auth'], { queryParams: { redirect: state.url } });
      return false;
    }
  }
}