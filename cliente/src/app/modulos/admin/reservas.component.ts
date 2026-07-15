import {Component, inject, OnInit, ChangeDetectorRef} from '@angular/core';
import {RouterModule} from '@angular/router';
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
import {NavigationService} from '../../_services/navigation-store';
import {ReservaService} from '../../_services/reserva.service';

@Component({
  selector: 'app-admin-reservas',
  standalone: true,
  imports: [
    SidebarComponent, PilaVerticalComponent, PilaHorizontalComponent,
    TextoPequenoComponent, TextTituloComponent, EntradaBusquedaComponent,
    SelectorComponent, InsigniaComponent, PaginacionComponent,
    FormsModule, RouterModule, DatePipe,
  ],
  template: `
    <div class="flex min-h-screen bg-stone-50">
      <app-sidebar></app-sidebar>

      <main class="flex-1 flex flex-col min-w-0">
        <div class="px-4 sm:px-6 py-6 max-w-7xl w-full mx-auto">

          <app-pila-horizontal espacio="4" alinear="centro" justificar="entre" class="mb-6 flex-wrap">
            <app-pila-vertical espacio="1">
              <texto-titulo tamanio="xl">Reservas</texto-titulo>
              <texto-pequeno>Consulta las reservas realizadas. Solo lectura — las reservas no se modifican desde este panel.</texto-pequeno>
            </app-pila-vertical>
          </app-pila-horizontal>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:p-4 mb-6">
            <div class="bg-white rounded-xl border border-stone-200 p-3 sm:p-4">
              <texto-pequeno color="gris">Total</texto-pequeno>
              <p class="text-xl sm:text-2xl font-bold text-stone-800 mt-1">{{ reservas.length }}</p>
            </div>
            <div class="bg-white rounded-xl border border-stone-200 p-3 sm:p-4">
              <texto-pequeno color="gris">Pendientes</texto-pequeno>
              <p class="text-xl sm:text-2xl font-bold text-amber-600 mt-1">{{ pendientes }}</p>
            </div>
            <div class="bg-white rounded-xl border border-stone-200 p-3 sm:p-4">
              <texto-pequeno color="gris">Activas</texto-pequeno>
              <p class="text-xl sm:text-2xl font-bold text-green-600 mt-1">{{ activas }}</p>
            </div>
            <div class="bg-white rounded-xl border border-stone-200 p-3 sm:p-4">
              <texto-pequeno color="gris">Completadas</texto-pequeno>
              <p class="text-xl sm:text-2xl font-bold text-blue-600 mt-1">{{ completadas }}</p>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-stone-200 p-3 sm:p-4 mb-6">
            <app-pila-horizontal espacio="4" alinear="fin" envolver="si">
              <div class="relative flex-1 min-w-[200px]">
                <app-entrada-busqueda
                  class="block"
                  placeholder="Buscar por usuario, libro o código de ejemplar..."
                  [valor]="terminoBusqueda"
                  (valorCambio)="onBusquedaCambio($event)"/>
              </div>
              <app-selector
                etiqueta="Estado"
                id="filtro-estado"
                [opciones]="opcionesEstado"
                [valor]="filtroEstado"
                (valorCambio)="onFiltroEstadoCambio($event)"
                placeholder="Todos"/>
            </app-pila-horizontal>
          </div>

          <div class="bg-white rounded-xl border border-stone-200 overflow-hidden w-full">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                <tr class="border-b border-stone-200 bg-stone-50">
                  <th
                    class="text-left px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                    ID
                  </th>
                  <th
                    class="text-left px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                    Usuario
                  </th>
                  <th
                    class="text-left px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                    Libro
                  </th>
                  <th
                    class="text-left px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                    Ejemplar
                  </th>
                  <th
                    class="text-left px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                    Expiración
                  </th>
                  <th
                    class="text-center px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                    Estado
                  </th>
                  <th
                    class="text-left px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                    Creada
                  </th>
                </tr>
                </thead>
                <tbody class="divide-y divide-stone-100">
                  @for (reserva of reservasPaginadas; track reserva.id) {
                    <tr class="hover:bg-amber-50/30 transition-colors">
                      <td class="px-3 sm:px-5 py-3">
                        <span class="text-xs font-mono text-stone-400">{{ reserva.id.slice(0, 8) }}</span>
                      </td>
                      <td class="px-3 sm:px-5 py-3">
                        <span class="text-sm font-medium text-stone-800">
                          {{ obtenerUsuario(reserva)?.nombre }} {{ obtenerUsuario(reserva)?.apellidos?.charAt(0) }}.
                        </span>
                      </td>
                      <td class="px-3 sm:px-5 py-3">
                        <span class="text-sm text-stone-700">{{ obtenerTituloLibro(reserva) }}</span>
                      </td>
                      <td class="px-3 sm:px-5 py-3">
                        <span class="text-xs font-mono text-stone-500">{{ obtenerCodigoEjemplar(reserva) }}</span>
                      </td>
                      <td class="px-3 sm:px-5 py-3">
                        <texto-pequeno>{{ reserva.fechaExpiracion | date: 'dd/MM/yyyy' }}</texto-pequeno>
                      </td>
                      <td class="px-3 sm:px-5 py-3 text-center">
                        @switch (reserva.estado) {
                          @case ('pendiente') {
                            <app-insignia etiqueta="Pendiente" color="amber" variante="sutil"/>
                          }
                          @case ('activa') {
                            <app-insignia etiqueta="Activa" color="green" variante="sutil"/>
                          }
                          @case ('cancelada') {
                            <app-insignia etiqueta="Cancelada" color="red" variante="sutil"/>
                          }
                          @case ('completada') {
                            <app-insignia etiqueta="Completada" color="blue" variante="sutil"/>
                          }
                        }
                      </td>
                      <td class="px-3 sm:px-5 py-3">
                        <texto-pequeno>{{ reserva.creadoEn | date: 'dd/MM/yyyy' }}</texto-pequeno>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="7" class="px-5 py-12 text-center">
                        <texto-pequeno>No se encontraron reservas con los filtros actuales.</texto-pequeno>
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
                [total]="reservasFiltradas.length"
                [tamanioPagina]="tamanioPagina"
                (cambioPagina)="irAPagina($event)"/>
            </div>
          }
        </div>
      </main>
    </div>
  `,
})
export class AdminReservasComponent implements OnInit {
  private readonly navigationService = inject(NavigationService);
  private readonly reservaService = inject(ReservaService);
  private readonly cdr = inject(ChangeDetectorRef);

  cargando: boolean = false;
  reservas: any[] = [];

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.cargando = true;
    this.reservaService.listar().subscribe({
      next: (res: any) => {
        const listado = Array.isArray(res) ? res : (res?.data ?? []);
        this.reservas = listado;
        this.cdr.detectChanges();
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error al cargar reservas:', err.message);
        this.cargando = false;
      },
    });
  }

  /* ── Filtros ────────────────────────────────────────── */

  terminoBusqueda: string = '';
  filtroEstado: string = '';

  opcionesEstado: Array<{ etiqueta: string; valor: string }> = [
    { etiqueta: 'Pendiente', valor: 'pendiente' },
    { etiqueta: 'Activa', valor: 'activa' },
    { etiqueta: 'Cancelada', valor: 'cancelada' },
    { etiqueta: 'Completada', valor: 'completada' },
  ];

  onBusquedaCambio(valor: string): void {
    this.terminoBusqueda = valor;
    this.paginaActual = 1;
  }

  onFiltroEstadoCambio(valor: string): void {
    this.filtroEstado = valor;
    this.paginaActual = 1;
  }

  /* ── Paginación ─────────────────────────────────────── */

  paginaActual: number = 1;
  tamanioPagina: number = 10;

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.reservasFiltradas.length / this.tamanioPagina));
  }

  get reservasPaginadas(): any[] {
    const ini = (this.paginaActual - 1) * this.tamanioPagina;
    return this.reservasFiltradas.slice(ini, ini + this.tamanioPagina);
  }

  irAPagina(p: number): void {
    if (p >= 1 && p <= this.totalPaginas) this.paginaActual = p;
  }

  get reservasFiltradas(): any[] {
    let r = this.reservas;
    const t = this.terminoBusqueda.trim().toLowerCase();
    if (t) {
      r = r.filter((rva: any) => {
        const nombre = (rva.usuario?.nombre + ' ' + rva.usuario?.apellidos).toLowerCase();
        const titulo = (rva.libro?.titulo ?? rva.ejemplar?.libro?.titulo ?? '').toLowerCase();
        const codigoBarras = (rva.ejemplar?.codigoBarras ?? '').toLowerCase();
        return nombre.includes(t) || titulo.includes(t) || codigoBarras.includes(t);
      });
    }
    if (this.filtroEstado) {
      r = r.filter((rva: any) => rva.estado === this.filtroEstado);
    }
    return r;
  }

  /* ── Conteos rápidos ────────────────────────────────── */

  get pendientes(): number {
    return this.reservas.filter((r: any) => r.estado === 'pendiente').length;
  }

  get activas(): number {
    return this.reservas.filter((r: any) => r.estado === 'activa').length;
  }

  get completadas(): number {
    return this.reservas.filter((r: any) => r.estado === 'completada').length;
  }

  /* ── Helpers de datos relacionados ──────────────────── */

  obtenerUsuario(reserva: any): any {
    return reserva.usuario ?? null;
  }

  obtenerTituloLibro(reserva: any): string {
    return reserva.libro?.titulo ?? reserva.ejemplar?.libro?.titulo ?? '—';
  }

  obtenerCodigoEjemplar(reserva: any): string {
    return reserva.ejemplar?.codigoBarras ?? '—';
  }
}
