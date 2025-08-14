import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  GoogleAuthService,
  GoogleUser,
} from '../../../services/google-auth.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { ButtonComponent } from '../../components/new/button/button.component';


@Component({
  selector: 'app-auth',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements AfterViewInit {
  @ViewChild('googleBtnOverlay', { static: false }) googleBtnOverlay?: ElementRef<HTMLDivElement>;
  clientId = environment.googleClientId
  user: GoogleUser | null = null;
  isLoading = false;
  // loginUri = `${environment.apiBase}/api/schedulr/google-auth/auth-callback`;
  // loginUri = '/api/schedulr/google-auth/auth-callback';
  // loginUri = `${window.location.origin}/api/schedulr/google-auth/callback`;
  

  constructor(
    private googleAuthService: GoogleAuthService
  ) {
  }

  async ngAfterViewInit() {
    await this.googleAuthService.initRedirectMode(this.clientId);
    if (this.googleBtnOverlay?.nativeElement) {
      this.googleAuthService.renderRedirectButton(this.googleBtnOverlay.nativeElement);
    }
  }
}
