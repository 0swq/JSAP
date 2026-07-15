import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { StorageService } from '../../_services/storage.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TarjetaComponent } from '../../_shared/componentes/datos/tarjeta.component';
import { EntradaComponent } from '../../_shared/componentes/entradas/entrada.component';
import { EntradaPasswordComponent } from '../../_shared/componentes/entradas/entrada-password.component';
import { BotonComponent } from '../../_shared/componentes/botones/boton.component';
import { AlertaComponent } from '../../_shared/componentes/retroalimentacion/alerta.component';
import {RouterLink} from "@angular/router";
import {HeaderComponent} from "../../_shared/componentes/navegacion/header.component";
import {FooterComponent} from "../../_shared/componentes/navegacion/footer.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, TarjetaComponent, EntradaComponent, EntradaPasswordComponent, BotonComponent, AlertaComponent, RouterLink, HeaderComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-amber-50/30">
      <app-header></app-header>
      <main class="flex-1 w-full px-4 py-10 flex items-center justify-center">
        <app-tarjeta titulo="Iniciar Sesión" class="w-full max-w-md">
          <div class="flex justify-center mb-4">
            <div class="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
              <svg class="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="7" r="4"/>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              </svg>
            </div>
          </div>
          @if (isLoggedIn) {
            <div class="flex flex-col items-center gap-4 py-4">
              <svg class="w-12 h-12 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <p class="text-lg font-semibold">Sesión iniciada</p>
              <p class="text-sm text-gray-500">{{ storageService.getNombre() }}</p>
              <a routerLink="/catalogo" class="no-underline w-full mt-2">
                <app-boton etiqueta="Ir al catálogo" [anchoCompleto]="true"/>
              </a>
            </div>
          }
          @if (!isLoggedIn) {
            <form name="form" (ngSubmit)="f.form.valid && onSubmit()" #f="ngForm" novalidate
                  class="flex flex-col gap-4">
              <app-entrada etiqueta="Correo electrónico" id="correo" tipo="email" placeholder="tu@correo.com"
                           [valor]="form.correo" (valorCambio)="form.correo = $event"
                           [error]="f.submitted && correo.errors ? (correo.errors['required'] ? 'El correo es obligatorio' : correo.errors['email'] ? 'Debe ser un correo válido' : '') : ''"
                           [requerido]="true"/>
              <input type="hidden" name="correo" [ngModel]="form.correo" required email #correo="ngModel"/>
              <app-entrada-password etiqueta="Contraseña" id="password" placeholder="Tu contraseña"
                                    [valor]="form.password" (valorCambio)="form.password = $event"
                                    [error]="f.submitted && password.errors?.['required'] ? 'La contraseña es obligatoria' : ''"
                                    [requerido]="true"/>
              <input type="hidden" name="password" [ngModel]="form.password" required #password="ngModel"/>
              <app-boton etiqueta="Iniciar Sesión" tipo="submit" [cargando]="loading" [anchoCompleto]="true"/>
              @if (f.submitted && isLoginFailed) {
                <app-alerta [mensaje]="errorMessage || 'Error al iniciar sesión'" tipo="error"/>
              }
            </form>
          }
        </app-tarjeta>
      </main>

      <app-footer/>
    </div>
  `,
  styles: `.no-underline { text-decoration: none; }`,
})
export class LoginComponent implements OnInit {
  form: any = { correo: null, password: null };
  isLoggedIn = false; isLoginFailed = false; errorMessage = ''; loading = false;
  constructor(private authService: AuthService, public storageService: StorageService) {}
  ngOnInit(): void { if (this.storageService.isLoggedIn()) this.isLoggedIn = true; }
  onSubmit(): void {
    if (this.loading) return; this.loading = true; this.isLoginFailed = false; this.errorMessage = '';
    const { correo, password } = this.form;
    this.authService.login(correo, password).subscribe({
      next: (data) => { this.storageService.saveUser(data.data ?? data); this.isLoggedIn = true; this.reloadPage(); },
      error: (err) => {
        const msg = err.error?.message ?? err.error?.mensaje ?? '';
        this.errorMessage = Array.isArray(msg) ? msg.join('. ') : msg;
        this.isLoginFailed = true; this.loading = false;
      },
    });
  }
  reloadPage(): void { window.location.reload(); }
}
