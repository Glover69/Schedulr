import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';
import { GoogleAuthService } from '../services/google-auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private googleAuthService: GoogleAuthService, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    // Hydrate once; it sets the BehaviorSubject to user or null
    await this.googleAuthService.hydrate();

    // Read the current value (no filtering). BehaviorSubject will emit immediately.
    const user = this.googleAuthService.getCurrentUser();
    console.log(user)

    if (!user) {
      this.router.navigate(['/auth'], { queryParams: { redirect: state.url } });
      return false;
    }
    return true;
  }
}