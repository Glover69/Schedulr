import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { GoogleAuthService } from '../services/google-auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private googleAuthService: GoogleAuthService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    // Ensure user is loaded
    await this.googleAuthService.checkExistingAuth();
    const user = await firstValueFrom(this.googleAuthService.user$);
    if (!user) {
      this.router.navigate(['/auth']);
      return false;
    }
    return true;
  }
}