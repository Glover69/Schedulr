import { ApplicationConfig, provideZoneChangeDetection, isDevMode, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { provideLottieOptions } from 'ngx-lottie';
import { GoogleAuthService } from '../services/google-auth.service';
import { provideHttpClient, withFetch } from '@angular/common/http';

if (!isDevMode()) {
    // Disable all console logging in production
    console.log = () => {};
    console.info = () => {};
    console.warn = () => {};
    console.error = () => {};
}

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }),
    provideLottieOptions({
      player: () => import('lottie-web'),
    }),
    provideHttpClient(withFetch()),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (auth: GoogleAuthService) => () => auth.hydrate(),
      deps: [GoogleAuthService],
    },
  ]
};
