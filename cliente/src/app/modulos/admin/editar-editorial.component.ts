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
import {EditorialService} from '../../_services/editorial.service';
import {NavigationService} from '../../_services/navigation-store';

@Component({
  selector: 'app-editar-editorial',
  standalone: true,
  imports: [SidebarComponent, PilaVerticalComponent, PilaHorizontalComponent,
    BotonComponent, BotonContornoComponent, TextoNormalComponent, TextTituloComponent,
    TarjetaComponent, EntradaComponent, AlertaComponent, FormsModule],
  template: `
    <div class="flex min-h-screen bg-stone-50">
      <app-sidebar></app-sidebar>
      <main class="flex-1 flex flex-col min-w-0"><div class="px-6 py-6 max-w-3xl w-full mx-auto">
        <button type="button" (click)="cancelar()" class="text-sm text-stone-500 hover:text-stone-700 mb-4 inline-flex items-center gap-1">← Volver a editoriales</button>
        <app-pila-vertical espacio="6">
          <texto-titulo tamanio="xl">Editar Editorial</texto-titulo>
          @if (cargando) {
            <div class="flex justify-center py-12">
              <svg class="animate-spin w-8 h-8 text-amber-600" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
          }
          @if (!cargando && !id) { <texto-normal>No se encontró la editorial a editar.</texto-normal> }
          @if (exito) { <app-alerta tipo="exito" mensaje="Editorial actualizada."/> }
          @if (error) { <app-alerta tipo="error" [mensaje]="error"/> }
          @if (!cargando && id && !exito) {
            <app-tarjeta titulo="Información">
              <app-pila-vertical espacio="5">
                <app-entrada etiqueta="Nombre" id="nombre" placeholder="Nombre" [valor]="nombre" (valorCambio)="nombre = $event" [requerido]="true" [error]="errNombre"/>
                <app-entrada etiqueta="País" id="pais" placeholder="País" [valor]="pais" (valorCambio)="pais = $event"/>
                <app-pila-horizontal espacio="4">
                  <app-boton etiqueta="Guardar Cambios" tamanio="md" [deshabilitado]="!nombre.trim()" (presionado)="guardar()"/>
                  <app-boton-contorno etiqueta="Cancelar" tamanio="md" (presionado)="cancelar()"/>
                </app-pila-horizontal>
              </app-pila-vertical>
            </app-tarjeta>
          }
        </app-pila-vertical>
      </div></main>
    </div>`,
})
export class EditarEditorialComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly svc = inject(EditorialService);
  private readonly nav = inject(NavigationService);
  private readonly cdr = inject(ChangeDetectorRef);
  id = ''; nombre = ''; pais = ''; cargando = true; errNombre = ''; exito = false; error = '';

  ngOnInit(): void {
    const idSel = this.route.snapshot.paramMap.get('id')
      ?? this.nav.store.getState().editorialSeleccionadaId;
    if (!idSel) { this.cargando = false; return; }
    this.id = idSel;
    this.svc.obtener(idSel).subscribe({
      next: (r: any) => {
        const e = r?.data ?? r;
        this.nombre = e.nombre || '';
        this.pais = e.pais || '';
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = err?.error?.mensaje ?? err?.message ?? 'Error al cargar la editorial.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }
  guardar(): void { this.errNombre = ''; if (!this.nombre.trim()) { this.errNombre = 'El nombre es obligatorio.'; return; }
    this.svc.actualizar(this.id, {nombre: this.nombre.trim(), pais: this.pais.trim() || undefined}).subscribe({
      next: () => { this.exito = true; this.cdr.detectChanges(); },
      error: (err: any) => { this.error = err?.error?.mensaje ?? err?.message ?? 'Error al actualizar.'; this.cdr.detectChanges(); },
    });
  }
  cancelar(): void { this.router.navigate(['/admin/editoriales']); }
}
