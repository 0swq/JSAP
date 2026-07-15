import {Component, inject, OnInit, ChangeDetectorRef} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SidebarComponent} from '../../_shared/componentes/navegacion/sidebar.component';
import {PilaVerticalComponent} from '../../_shared/componentes/diseno/pila-vertical.component';
import {PilaHorizontalComponent} from '../../_shared/componentes/diseno/pila-horizontal.component';
import {TextoPequenoComponent} from '../../_shared/componentes/texto/texto-pequeno.component';
import {TextTituloComponent} from '../../_shared/componentes/texto/text-titulo.component';
import {EntradaBusquedaComponent} from '../../_shared/componentes/entradas/entrada-busqueda.component';
import {SelectorComponent} from '../../_shared/componentes/entradas/selector.component';
import {InsigniaComponent} from '../../_shared/componentes/datos/insignia.component';
import {PaginacionComponent} from '../../_shared/componentes/navegacion/paginacion.component';
import {HistorialService} from '../../_services/historial.service';

@Component({
  selector: 'app-admin-historial',
  standalone: true,
  imports: [
    SidebarComponent, PilaVerticalComponent, PilaHorizontalComponent,
    TextoPequenoComponent, TextTituloComponent,
    EntradaBusquedaComponent, SelectorComponent, InsigniaComponent,
    PaginacionComponent, FormsModule, DatePipe,
  ],
  template: `
    <div class="flex min-h-screen bg-stone-50">
      <app-sidebar></app-sidebar>

      <main class="flex-1 flex flex-col min-w-0">
        <div class="px-4 sm:px-6 py-6 max-w-7xl w-full mx-auto">

          <app-pila-horizontal espacio="4" alinear="centro" justificar="entre" class="mb-6 flex-wrap">
            <app-pila-vertical espacio="1">
              <texto-titulo tamanio="xl">Historial de Actividad</texto-titulo>
              <texto-pequeno>Registro de auditoría de todas las acciones realizadas en el sistema.</texto-pequeno>
            </app-pila-vertical>
          </app-pila-horizontal>

          <div class="bg-white rounded-xl border border-stone-200 p-3 sm:p-4 mb-6">
            <app-pila-horizontal espacio="4" alinear="fin" envolver="si">
              <div class="relative flex-1 min-w-[200px]">
                <app-entrada-busqueda
                  class="block"
                  placeholder="Buscar por usuario, acción o módulo..."
                  [valor]="terminoBusqueda"
                  (valorCambio)="onBusquedaCambio($event)"/>
              </div>
              <app-selector
                etiqueta="Acción"
                id="filtro-accion"
                [opciones]="opcionesAccion"
                [valor]="filtroAccion"
                (valorCambio)="onFiltroAccionCambio($event)"
                placeholder="Todas"/>
              <app-selector
                etiqueta="Módulo"
                id="filtro-modulo"
                [opciones]="opcionesModulo"
                [valor]="filtroModulo"
                (valorCambio)="onFiltroModuloCambio($event)"
                placeholder="Todos"/>
            </app-pila-horizontal>
          </div>

          <div class="bg-white rounded-xl border border-stone-200 overflow-hidden w-full">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                <tr class="border-b border-stone-200 bg-stone-50">
                  <th class="text-left px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                    Fecha
                  </th>
                  <th class="text-left px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                    Usuario
                  </th>
                  <th class="text-left px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                    Descripción
                  </th>
                  <th class="text-center px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                    Tipo
                  </th>
                  <th class="text-center px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                    Módulo
                  </th>
                </tr>
                </thead>
                <tbody class="divide-y divide-stone-100">
                  @for (registro of registrosPaginados; track registro.id) {
                    <tr class="hover:bg-amber-50/30 transition-colors">
                      <td class="px-3 sm:px-5 py-3">
                        <span class="text-xs text-stone-500 whitespace-nowrap">
                          {{ registro.creadoEn | date: 'dd/MM/yyyy HH:mm' }}
                        </span>
                      </td>
                      <td class="px-3 sm:px-5 py-3">
                        <div class="flex flex-col gap-0.5">
                          <span class="text-sm font-medium text-stone-800">
                            {{ obtenerNombreUsuario(registro) }}
                          </span>
                          <span class="text-xs text-stone-400">
                            {{ obtenerCorreoUsuario(registro) }}
                          </span>
                        </div>
                      </td>
                      <td class="px-3 sm:px-5 py-3">
                        <span class="text-sm text-stone-700">{{ registro.nombreAccion }}</span>
                      </td>
                      <td class="px-3 sm:px-5 py-3 text-center">
                        <app-insignia
                          [etiqueta]="registro.accion"
                          [color]="colorParaAccion(registro.accion)"
                          variante="sutil"/>
                      </td>
                      <td class="px-3 sm:px-5 py-3 text-center">
                        @if (registro.modulo) {
                          <app-insignia
                            [etiqueta]="registro.modulo"
                            color="stone"
                            variante="sutil"/>
                        } @else {
                          <span class="text-xs text-stone-400">—</span>
                        }
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="5" class="px-5 py-12 text-center">
                        @if (cargando) {
                          <texto-pequeno>Cargando historial...</texto-pequeno>
                        } @else {
                          <texto-pequeno>No se encontraron registros de historial con los filtros actuales.</texto-pequeno>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          @if (totalPaginas > 1) {
            <div class="mt-6 flex justify-center">
              <app-paginacion
                [pagina]="paginaActual"
                [total]="registrosFiltrados.length"
                [tamanioPagina]="tamanioPagina"
                (cambioPagina)="irAPagina($event)"/>
            </div>
          }
        </div>
      </main>
    </div>
  `,
})
export class AdminHistorialComponent implements OnInit {
  private readonly historialService = inject(HistorialService);
  private readonly cdr = inject(ChangeDetectorRef);

  cargando: boolean = false;
  registros: any[] = [];

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.cargando = true;
    this.historialService.listar().subscribe({
      next: (res: any) => {
        const listado = Array.isArray(res) ? res : (res?.data ?? []);
        this.registros = listado;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar historial:', err.message);
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  terminoBusqueda: string = '';
  filtroAccion: string = '';
  filtroModulo: string = '';

  onBusquedaCambio(valor: string): void {
    this.terminoBusqueda = valor;
    this.paginaActual = 1;
  }

  onFiltroAccionCambio(valor: string): void {
    this.filtroAccion = valor;
    this.paginaActual = 1;
  }

  onFiltroModuloCambio(valor: string): void {
    this.filtroModulo = valor;
    this.paginaActual = 1;
  }

  get opcionesAccion(): Array<{ etiqueta: string; valor: string }> {
    const acciones = new Set<string>();
    this.registros.forEach(r => acciones.add(r.accion));
    return Array.from(acciones).sort().map(a => ({ etiqueta: this.formatearAccion(a), valor: a }));
  }

  get opcionesModulo(): Array<{ etiqueta: string; valor: string }> {
    const modulos = new Set<string>();
    this.registros.forEach(r => { if (r.modulo) modulos.add(r.modulo); });
    return Array.from(modulos).sort().map(m => ({ etiqueta: this.formatearModulo(m), valor: m }));
  }

  paginaActual: number = 1;
  tamanioPagina: number = 15;

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.registrosFiltrados.length / this.tamanioPagina));
  }

  get registrosPaginados(): any[] {
    const ini = (this.paginaActual - 1) * this.tamanioPagina;
    return this.registrosFiltrados.slice(ini, ini + this.tamanioPagina);
  }

  irAPagina(p: number): void {
    if (p >= 1 && p <= this.totalPaginas) this.paginaActual = p;
  }

  get registrosFiltrados(): any[] {
    let r = this.registros;
    const t = this.terminoBusqueda.trim().toLowerCase();
    if (t) {
      r = r.filter((reg: any) => {
        const nombre = this.obtenerNombreUsuario(reg).toLowerCase();
        const correo = this.obtenerCorreoUsuario(reg).toLowerCase();
        const descripcion = (reg.nombreAccion ?? '').toLowerCase();
        const tipo = (reg.accion ?? '').toLowerCase();
        const modulo = (reg.modulo ?? '').toLowerCase();
        return nombre.includes(t) || correo.includes(t) || descripcion.includes(t) || tipo.includes(t) || modulo.includes(t);
      });
    }
    if (this.filtroAccion) {
      r = r.filter((reg: any) => reg.accion === this.filtroAccion);
    }
    if (this.filtroModulo) {
      r = r.filter((reg: any) => reg.modulo === this.filtroModulo);
    }
    return r;
  }

  obtenerNombreUsuario(registro: any): string {
    if (!registro.hechoPor) return 'Usuario #' + (registro.hechoPorId?.slice(0, 8) ?? '?');
    const nombre = registro.hechoPor.nombre ?? '';
    const apellidos = registro.hechoPor.apellidos ?? '';
    return [nombre, apellidos].filter(Boolean).join(' ') || 'Usuario #' + (registro.hechoPorId?.slice(0, 8) ?? '?');
  }

  obtenerCorreoUsuario(registro: any): string {
    return registro.hechoPor?.correo ?? '';
  }

  formatearAccion(accion: string): string {
    return accion.charAt(0).toUpperCase() + accion.slice(1);
  }

  formatearModulo(modulo: string): string {
    return modulo.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  colorParaAccion(accion: string): string {
    switch (accion) {
      case 'crear':
      case 'agregar':
      case 'registro': return 'green';
      case 'actualizar':
      case 'login': return 'blue';
      case 'eliminar':
      case 'cancelar': return 'red';
      default: return 'stone';
    }
  }
}
