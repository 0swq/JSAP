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
import {InterruptorComponent} from '../../_shared/componentes/entradas/interruptor.component';
import {AlertaComponent} from '../../_shared/componentes/retroalimentacion/alerta.component';
import {CategoriaService} from '../../_services/categoria.service';
import {NavigationService} from '../../_services/navigation-store';

@Component({
  selector: 'app-editar-categoria',
  standalone: true,
  imports: [SidebarComponent, PilaVerticalComponent, PilaHorizontalComponent,
    BotonComponent, BotonContornoComponent, TextoNormalComponent, TextTituloComponent,
    TarjetaComponent, EntradaComponent, InterruptorComponent,
    AlertaComponent, FormsModule],
  template: `
    <div class="flex min-h-screen bg-stone-50">
      <app-sidebar></app-sidebar>
      <main class="flex-1 flex flex-col min-w-0"><div class="px-6 py-6 max-w-3xl w-full mx-auto">
        <button type="button" (click)="cancelar()" class="text-sm text-stone-500 hover:text-stone-700 mb-4 inline-flex items-center gap-1">← Volver a categorías</button>
        <app-pila-vertical espacio="6">
          <texto-titulo tamanio="xl">Editar Categoría</texto-titulo>
          @if (cargando) {
            <div class="flex justify-center py-12">
              <svg class="animate-spin w-8 h-8 text-amber-600" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
          }
          @if (!cargando && !id) { <texto-normal>No se encontró la categoría.</texto-normal> }
          @if (exito) { <app-alerta tipo="exito" mensaje="Categoría actualizada."/> }
          @if (error) { <app-alerta tipo="error" [mensaje]="error"/> }
          @if (!cargando && id && !exito) {
            <app-tarjeta titulo="Información">
              <app-pila-vertical espacio="5">
                <app-entrada etiqueta="Nombre" id="nombre" [valor]="nombre" (valorCambio)="nombre = $event" [requerido]="true" [error]="errNombre"/>
                <app-interruptor etiqueta="Activa" [activo]="activa" (activoCambio)="activa = $event"/>
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
export class EditarCategoriaComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly svc = inject(CategoriaService);
  private readonly nav = inject(NavigationService);
  private readonly cdr = inject(ChangeDetectorRef);
  id = ''; nombre = ''; activa = true; cargando = true; errNombre = ''; exito = false; error = '';

  ngOnInit(): void {
    const idSel = this.route.snapshot.paramMap.get('id')
      ?? this.nav.store.getState().categoriaSeleccionadaId;
    if (!idSel) { this.cargando = false; return; }
    this.id = idSel;
    this.svc.obtener(idSel).subscribe({
      next: (r: any) => {
        const c = r?.data ?? r;
        this.nombre = c.nombre || '';
        this.activa = c.activa !== false;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (e: any) => {
        this.error = e?.error?.mensaje ?? e?.message ?? 'Error al cargar la categoría.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }
  guardar(): void { this.errNombre = ''; if (!this.nombre.trim()) { this.errNombre = 'El nombre es obligatorio.'; return; }
    this.svc.actualizar(this.id, {nombre: this.nombre.trim(), activa: this.activa}).subscribe({
      next: () => { this.exito = true; this.cdr.detectChanges(); },
      error: (e: any) => { this.error = e?.error?.mensaje ?? e?.message ?? 'Error al actualizar.'; this.cdr.detectChanges(); },
    });
  }
  cancelar(): void { this.router.navigate(['/admin/categorias']); }
}
