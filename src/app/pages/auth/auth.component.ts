import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  GoogleAuthService,
  GoogleUser,
} from '../../../services/google-auth.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { ButtonComponent } from '../../components/button/button.component';
import { LabelComponent } from '../../components/label/label.component';


@Component({
  selector: 'app-auth',
  imports: [CommonModule, ButtonComponent, LabelComponent],
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
    private googleAuthService: GoogleAuthService
  ) {
  }

  async ngAfterViewInit() {
    await this.googleAuthService.initRedirectMode(this.clientId, this.loginUri);
    if (this.googleBtnOverlay?.nativeElement) {
      this.googleAuthService.renderRedirectButton(this.googleBtnOverlay.nativeElement);
    }
  }
}
