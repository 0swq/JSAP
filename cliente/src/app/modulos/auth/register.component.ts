import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TarjetaComponent } from '../../_shared/componentes/datos/tarjeta.component';
import { EntradaComponent } from '../../_shared/componentes/entradas/entrada.component';
import { EntradaPasswordComponent } from '../../_shared/componentes/entradas/entrada-password.component';
import { BotonComponent } from '../../_shared/componentes/botones/boton.component';
import { AlertaComponent } from '../../_shared/componentes/retroalimentacion/alerta.component';

@Component({
  selector: 'app-register',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormsModule, CommonModule, TarjetaComponent, EntradaComponent, EntradaPasswordComponent, BotonComponent, AlertaComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-50">
      <app-tarjeta titulo="Crear Cuenta" class="w-full max-w-md">
        <div class="flex justify-center mb-4">
          <div class="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-gray-400">&#128247;</div>
        </div>
        @if (isSuccessful) {
          <div class="flex flex-col items-center gap-4 py-4">
            <svg class="w-12 h-12 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <p class="text-lg font-semibold">¡Registro exitoso!</p>
            <p class="text-sm text-gray-500">Ya puedes iniciar sesión</p>
            <a routerLink="/login" class="no-underline"><app-boton etiqueta="Ir al Login" /></a>
          </div>
        }
        @if (!isSuccessful) {
          <form name="form" (ngSubmit)="f.form.valid && onSubmit()" #f="ngForm" novalidate class="flex flex-col gap-4">
            <app-entrada etiqueta="Nombre" id="nombre" placeholder="Tu nombre" [valor]="form.nombre" (valorCambio)="form.nombre = $event" [error]="f.submitted && nombre.errors?.['required'] ? 'El nombre es obligatorio' : f.submitted && nombre.errors?.['minlength'] ? 'Mínimo 2 caracteres' : ''" [requerido]="true" />
            <input type="hidden" name="nombre" [ngModel]="form.nombre" required minlength="2" maxlength="50" #nombre="ngModel" />
            <app-entrada etiqueta="Apellidos" id="apellidos" placeholder="Tus apellidos" [valor]="form.apellidos" (valorCambio)="form.apellidos = $event" [error]="f.submitted && apellidos.errors?.['required'] ? 'Los apellidos son obligatorios' : f.submitted && apellidos.errors?.['minlength'] ? 'Mínimo 2 caracteres' : ''" [requerido]="true" />
            <input type="hidden" name="apellidos" [ngModel]="form.apellidos" required minlength="2" maxlength="50" #apellidos="ngModel" />
            <app-entrada etiqueta="DNI" id="dni" placeholder="8 dígitos" [valor]="form.dni" (valorCambio)="form.dni = $event" [error]="f.submitted && dni.errors?.['required'] ? 'El DNI es obligatorio' : f.submitted && dni.errors?.['minlength'] ? 'Mínimo 8 dígitos' : ''" [requerido]="true" />
            <input type="hidden" name="dni" [ngModel]="form.dni" required minlength="8" maxlength="12" #dni="ngModel" />
            <app-entrada etiqueta="Correo electrónico" id="correo" tipo="email" placeholder="tu@correo.com" [valor]="form.correo" (valorCambio)="form.correo = $event" [error]="f.submitted && correo.errors?.['required'] ? 'El correo es obligatorio' : f.submitted && correo.errors?.['email'] ? 'Debe ser un correo válido' : ''" [requerido]="true" />
            <input type="hidden" name="correo" [ngModel]="form.correo" required email #correo="ngModel" />
            <app-entrada-password etiqueta="Contraseña" id="password" placeholder="Mínimo 8 caracteres" [valor]="form.password" (valorCambio)="form.password = $event" [error]="f.submitted && password.errors?.['required'] ? 'La contraseña es obligatoria' : f.submitted && password.errors?.['minlength'] ? 'Mínimo 8 caracteres' : ''" [requerido]="true" />
            <input type="hidden" name="password" [ngModel]="form.password" required minlength="8" #password="ngModel" />
            <app-boton etiqueta="Registrarse" [cargando]="submitting" [anchoCompleto]="true" icono='<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>' />
            @if (f.submitted && isSignUpFailed) { <app-alerta [mensaje]="errorMessage || 'Error al registrarse'" tipo="error" /> }
            <p class="text-center text-sm text-gray-500">¿Ya tienes cuenta? <a routerLink="/login" class="text-blue-600 font-semibold no-underline hover:underline">Inicia sesión</a></p>
          </form>
        }
      </app-tarjeta>
    </div>
  `,
  styles: `.no-underline { text-decoration: none; }`,
})
export class RegisterComponent {
  form: any = { nombre: null, apellidos: null, dni: null, correo: null, password: null };
  isSuccessful = false; isSignUpFailed = false; errorMessage = ''; submitting = false;
  constructor(private authService: AuthService) {}
  onSubmit(): void {
    if (this.submitting) return; this.submitting = true;
    const { nombre, apellidos, dni, correo, password } = this.form;
    this.authService.register(nombre, apellidos, dni, correo, password).subscribe({
      next: () => { this.isSuccessful = true; this.isSignUpFailed = false; this.submitting = false; },
      error: (err) => {
        const msg = err.error?.message ?? err.error?.mensaje ?? '';
        this.errorMessage = Array.isArray(msg) ? msg.join('. ') : msg;
        this.isSignUpFailed = true; this.submitting = false;
      },
    });
  }
}
