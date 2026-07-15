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
import {InterruptorComponent} from '../../_shared/componentes/entradas/interruptor.component';
import {AlertaComponent} from '../../_shared/componentes/retroalimentacion/alerta.component';
import {CategoriaService} from '../../_services/categoria.service';
import {NavigationService} from '../../_services/navigation-store';

@Component({
  selector: 'app-crear-categoria',
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
          <texto-titulo tamanio="xl">Crear Categoría</texto-titulo>
          @if (exito) { <app-alerta tipo="exito" mensaje="Categoría creada."/> }
          @if (error) { <app-alerta tipo="error" [mensaje]="error"/> }
          @if (!exito) {
            <app-tarjeta titulo="Información">
              <app-pila-vertical espacio="5">
                <app-entrada etiqueta="Nombre" id="nombre" placeholder="Nombre de la categoría" [valor]="nombre" (valorCambio)="nombre = $event" [requerido]="true" [error]="errNombre"/>
                <app-interruptor etiqueta="Activa" [activo]="activa" (activoCambio)="activa = $event"/>
                <app-pila-horizontal espacio="4">
                  <app-boton etiqueta="Crear Categoría" tamanio="md" [deshabilitado]="!nombre.trim()" (presionado)="crear()"/>
                  <app-boton-contorno etiqueta="Cancelar" tamanio="md" (presionado)="cancelar()"/>
                </app-pila-horizontal>
              </app-pila-vertical>
            </app-tarjeta>
          }
        </app-pila-vertical>
      </div></main>
    </div>`,
})
export class CrearCategoriaComponent {
  private readonly router = inject(Router);
  private readonly svc = inject(CategoriaService);
  private readonly nav = inject(NavigationService);
  nombre = ''; activa = true; errNombre = ''; exito = false; error = '';

  crear(): void { this.errNombre = ''; if (!this.nombre.trim()) { this.errNombre = 'El nombre es obligatorio.'; return; }
    this.svc.crear({nombre: this.nombre.trim(), activa: this.activa}).subscribe({
      next: (r: any) => { this.nav.store.getState().seleccionarCategoria(r?.data?._id ?? r?.data?.id ?? null); this.exito = true; },
      error: (e: any) => { this.error = e?.error?.mensaje ?? e?.message ?? 'Error al crear.'; },
    });
  }
  cancelar(): void { this.router.navigate(['/admin/categorias']); }
}
