import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { httpInterceptorProviders } from './_helpers/http.interceptor';
import routes from './routes';

@NgModule({
  imports: [
    BrowserModule,
    AppComponent,
    RouterModule.forRoot(routes),
  ],
  providers: [
    httpInterceptorProviders,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
