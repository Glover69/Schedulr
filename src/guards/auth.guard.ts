import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { GoogleAuthService } from '../services/google-auth.service';

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
    await this.googleAuthService.hydrate();
    const user = await firstValueFrom(this.googleAuthService.user$);
    if (!user) {
      this.router.navigate(['/auth']);
      return false;
    }
    return true;
  }
}