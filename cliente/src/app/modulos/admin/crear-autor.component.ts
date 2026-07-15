import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {SidebarComponent} from '../../_shared/componentes/navegacion/sidebar.component';
import {PilaVerticalComponent} from '../../_shared/componentes/diseno/pila-vertical.component';
import {PilaHorizontalComponent} from '../../_shared/componentes/diseno/pila-horizontal.component';
import {BotonComponent} from '../../_shared/componentes/botones/boton.component';
import {BotonContornoComponent} from '../../_shared/componentes/botones/boton-contorno.component';
import {TextoNormalComponent} from '../../_shared/componentes/texto/texto-normal.component';
import {TextTituloComponent} from '../../_shared/componentes/texto/text-titulo.component';
import {TarjetaComponent} from '../../_shared/componentes/datos/tarjeta.component';
import {EntradaComponent} from '../../_shared/componentes/entradas/entrada.component';
import {AlertaComponent} from '../../_shared/componentes/retroalimentacion/alerta.component';
import {AutorService} from '../../_services/autor.service';
import {NavigationService} from '../../_services/navigation-store';

@Component({
  selector: 'app-crear-autor',
  standalone: true,
  imports: [SidebarComponent, PilaVerticalComponent, PilaHorizontalComponent,
    BotonComponent, BotonContornoComponent, TextoNormalComponent, TextTituloComponent,
    TarjetaComponent, EntradaComponent, AlertaComponent, FormsModule],
  template: `
    <div class="flex min-h-screen bg-stone-50">
      <app-sidebar></app-sidebar>
      <main class="flex-1 flex flex-col min-w-0"><div class="px-6 py-6 max-w-3xl w-full mx-auto">
        <button type="button" (click)="cancelar()" class="text-sm text-stone-500 hover:text-stone-700 mb-4 inline-flex items-center gap-1">← Volver a autores</button>
        <app-pila-vertical espacio="6">
          <texto-titulo tamanio="xl">Crear Autor</texto-titulo>
          @if (exito) { <app-alerta tipo="exito" mensaje="Autor creado."/> }
          @if (error) { <app-alerta tipo="error" [mensaje]="error"/> }
          @if (!exito) {
            <app-tarjeta titulo="Información">
              <app-pila-vertical espacio="5">
                <app-entrada etiqueta="Nombre" id="nombre" placeholder="Nombres" [valor]="nombre" (valorCambio)="nombre = $event"/>
                <app-entrada etiqueta="Apellidos" id="apellidos" placeholder="Apellidos" [valor]="apellidos" (valorCambio)="apellidos = $event" [requerido]="true" [error]="errApe"/>
                <app-entrada etiqueta="Nacionalidad" id="nacionalidad" placeholder="Nacionalidad" [valor]="nacionalidad" (valorCambio)="nacionalidad = $event"/>
                <app-entrada etiqueta="Biografía" id="biografia" placeholder="Biografía breve" [valor]="biografia" (valorCambio)="biografia = $event"/>
                <div class="flex flex-col gap-1">
                  <label for="fechaNac" class="text-sm font-medium text-gray-700">Fecha nacimiento</label>
                  <input
                    id="fechaNac"
                    type="date"
                    [ngModel]="fechaNac"
                    (ngModelChange)="fechaNac = $event"
                    class="w-full px-3 py-2 border rounded-lg text-sm transition-colors duration-150
                           focus:outline-none focus:ring-2 focus:ring-offset-0
                           focus:border-amber-500 focus:ring-amber-200 border-gray-300"
                  />
                </div>
                <app-pila-horizontal espacio="4">
                  <app-boton etiqueta="Crear Autor" tamanio="md" [deshabilitado]="!apellidos.trim()" (presionado)="crear()"/>
                  <app-boton-contorno etiqueta="Cancelar" tamanio="md" (presionado)="cancelar()"/>
                </app-pila-horizontal>
              </app-pila-vertical>
            </app-tarjeta>
          }
        </app-pila-vertical>
      </div></main>
    </div>`,
})
export class CrearAutorComponent {
  private readonly router = inject(Router);
  private readonly svc = inject(AutorService);
  private readonly nav = inject(NavigationService);
  nombre = ''; apellidos = ''; nacionalidad = ''; biografia = ''; fechaNac = '';
  errApe = ''; exito = false; error = '';
  crear(): void { this.errApe = ''; if (!this.apellidos.trim()) { this.errApe = 'Los apellidos son obligatorios.'; return; }
    this.svc.crear({nombre: this.nombre.trim(), apellidos: this.apellidos.trim(), nacionalidad: this.nacionalidad.trim() || undefined, biografia: this.biografia.trim() || undefined, fechaNacimiento: this.fechaNac ? new Date(this.fechaNac + 'T00:00:00').toISOString() : undefined}).subscribe({
      next: (r: any) => { this.nav.store.getState().seleccionarAutor(r?.data?._id ?? r?.data?.id ?? null); this.exito = true; },
      error: (e: any) => { this.error = e?.error?.mensaje ?? e?.message ?? 'Error al crear.'; },
    });
  }
  cancelar(): void { this.router.navigate(['/admin/autores']); }
}
