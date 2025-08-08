import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ToastComponent } from './components/toast/toast.component';
import { ToastService } from '../services/toast.service';
import { Toast } from '../models/data.models';
import { GoogleAuthService } from '../services/google-auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  toastMessage: string = '';
  toastHeader: string = '';
  title = 'schedulr';

  private auth = inject(GoogleAuthService);

  async ngOnInit() {
    await this.auth.checkExistingAuth();

    this.toastService.toast$.subscribe((toast: Toast) => {
      this.toastMessage = `${toast.message}`;
      this.toastHeader = `${toast.header}`;
      // Automatically hide the snackbar after 5 seconds
      setTimeout(() => {
        // this.animateOut();
        (this.toastHeader = ''), (this.toastMessage = '');
      }, 3500);
    });
  }

  get isAuthRoute(): boolean {
    return this.router.url.includes('/auth') || this.router.url === '/auth-callback';
  }

  constructor(private router: Router, private toastService: ToastService){}

  // ngOnInit() {
    
  //   // this.toastService.toast$.subscribe((toast: Toast) => {
  //   //   this.toastMessage = `${toast.message}`;
  //   //   this.toastHeader = `${toast.header}`;
  //   //   // Automatically hide the snackbar after 5 seconds
  //   //   setTimeout(() => {
  //   //     // this.animateOut();
  //   //     (this.toastHeader = ''), (this.toastMessage = '');
  //   //   }, 3500);
  //   // });
  // }
}
