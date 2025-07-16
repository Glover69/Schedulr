import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { provideLottieOptions } from 'ngx-lottie';

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

  ]
};
