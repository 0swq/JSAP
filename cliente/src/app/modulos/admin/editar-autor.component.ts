import {Component, inject, OnInit, ChangeDetectorRef} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
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
  selector: 'app-editar-autor',
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
          <texto-titulo tamanio="xl">Editar Autor</texto-titulo>
          @if (cargando) {
            <div class="flex justify-center py-12">
              <svg class="animate-spin w-8 h-8 text-amber-600" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
          }
          @if (!cargando && !id) { <texto-normal>No se encontró el autor.</texto-normal> }
          @if (exito) { <app-alerta tipo="exito" mensaje="Autor actualizado."/> }
          @if (error) { <app-alerta tipo="error" [mensaje]="error"/> }
          @if (!cargando && id && !exito) {
            <app-tarjeta titulo="Información">
              <app-pila-vertical espacio="5">
                <app-entrada etiqueta="Nombre" id="nombre" [valor]="nombre" (valorCambio)="nombre = $event"/>
                <app-entrada etiqueta="Apellidos" id="apellidos" [valor]="apellidos" (valorCambio)="apellidos = $event" [requerido]="true" [error]="errApe"/>
                <app-entrada etiqueta="Nacionalidad" id="nacionalidad" [valor]="nacionalidad" (valorCambio)="nacionalidad = $event"/>
                <app-entrada etiqueta="Biografía" id="biografia" [valor]="biografia" (valorCambio)="biografia = $event"/>
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
                  <app-boton etiqueta="Guardar Cambios" tamanio="md" [deshabilitado]="!apellidos.trim()" (presionado)="guardar()"/>
                  <app-boton-contorno etiqueta="Cancelar" tamanio="md" (presionado)="cancelar()"/>
                </app-pila-horizontal>
              </app-pila-vertical>
            </app-tarjeta>
          }
        </app-pila-vertical>
      </div></main>
    </div>`,
})
export class EditarAutorComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly svc = inject(AutorService);
  private readonly nav = inject(NavigationService);
  private readonly cdr = inject(ChangeDetectorRef);
  id = ''; nombre = ''; apellidos = ''; nacionalidad = ''; biografia = ''; fechaNac = '';
  cargando = true; errApe = ''; exito = false; error = '';

  ngOnInit(): void {
    const idSel = this.route.snapshot.paramMap.get('id')
      ?? this.nav.store.getState().autorSeleccionadoId;
    if (!idSel) { this.cargando = false; return; }
    this.id = idSel;
    this.svc.obtener(idSel).subscribe({
      next: (r: any) => {
        const a = r?.data ?? r;
        this.nombre = a.nombre || '';
        this.apellidos = a.apellidos || '';
        this.nacionalidad = a.nacionalidad || '';
        this.biografia = a.biografia || '';
        this.fechaNac = a.fechaNacimiento ? a.fechaNacimiento.split('T')[0] : '';
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (e: any) => {
        this.error = e?.error?.mensaje ?? e?.message ?? 'Error al cargar el autor.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }
  guardar(): void { this.errApe = ''; if (!this.apellidos.trim()) { this.errApe = 'Los apellidos son obligatorios.'; return; }
    this.svc.actualizar(this.id, {nombre: this.nombre.trim(), apellidos: this.apellidos.trim(), nacionalidad: this.nacionalidad.trim() || undefined, biografia: this.biografia.trim() || undefined, fechaNacimiento: this.fechaNac ? new Date(this.fechaNac + 'T00:00:00').toISOString() : undefined}).subscribe({
      next: () => { this.exito = true; this.cdr.detectChanges(); },
      error: (e: any) => { this.error = e?.error?.mensaje ?? e?.message ?? 'Error al actualizar.'; this.cdr.detectChanges(); },
    });
  }
  cancelar(): void { this.router.navigate(['/admin/autores']); }
}
