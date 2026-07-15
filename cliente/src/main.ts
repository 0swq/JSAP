import { provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import routes from './app/routes';
import { httpInterceptorProviders } from './app/_helpers/http.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    ...httpInterceptorProviders,
  ],
}).catch((err) => console.error(err));
