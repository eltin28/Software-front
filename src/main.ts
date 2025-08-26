import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideServiceWorker } from '@angular/service-worker';
import { isDevMode } from '@angular/core';
import { App } from './app/app';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withFetch()),
    // provideClientHydration(),
    provideAnimations(),
    // Solo habilitar SW fuera de dev: ng build --configuration=production
    provideServiceWorker('ngsw-worker.js', { enabled: !isDevMode() })
  ]
}).catch(err => console.error(err));
