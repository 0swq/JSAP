import {Component, inject, OnInit, ChangeDetectorRef} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SidebarComponent} from '../../_shared/componentes/navegacion/sidebar.component';
import {PilaVerticalComponent} from '../../_shared/componentes/diseno/pila-vertical.component';
import {PilaHorizontalComponent} from '../../_shared/componentes/diseno/pila-horizontal.component';
import {BotonComponent} from '../../_shared/componentes/botones/boton.component';
import {BotonIconoComponent} from '../../_shared/componentes/botones/boton-icono.component';
import {TextoPequenoComponent} from '../../_shared/componentes/texto/texto-pequeno.component';
import {TextTituloComponent} from '../../_shared/componentes/texto/text-titulo.component';
import {EntradaBusquedaComponent} from '../../_shared/componentes/entradas/entrada-busqueda.component';
import {SelectorComponent} from '../../_shared/componentes/entradas/selector.component';
import {InsigniaComponent} from '../../_shared/componentes/datos/insignia.component';
import {PaginacionComponent} from '../../_shared/componentes/navegacion/paginacion.component';
import {NavigationService} from '../../_services/navigation-store';
import {PrestamoService} from '../../_services/prestamo.service';

@Component({
  selector: 'app-admin-prestamos',
  standalone: true,
  imports: [
    SidebarComponent, PilaVerticalComponent, PilaHorizontalComponent,
    BotonComponent, BotonIconoComponent, TextoPequenoComponent, TextTituloComponent, EntradaBusquedaComponent,
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
              <texto-titulo tamanio="xl">Préstamos</texto-titulo>
              <texto-pequeno>Administra los préstamos activos, vencidos y devueltos.</texto-pequeno>
            </app-pila-vertical>
          </app-pila-horizontal>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div class="bg-white rounded-xl border border-stone-200 p-3 sm:p-4">
              <texto-pequeno color="gris">Total</texto-pequeno>
              <p class="text-xl sm:text-2xl font-bold text-stone-800 mt-1">{{ prestamos.length }}</p>
            </div>
            <div class="bg-white rounded-xl border border-stone-200 p-3 sm:p-4">
              <texto-pequeno color="gris">Activos</texto-pequeno>
              <p class="text-xl sm:text-2xl font-bold text-green-600 mt-1">{{ activos }}</p>
            </div>
            <div class="bg-white rounded-xl border border-stone-200 p-3 sm:p-4">
              <texto-pequeno color="gris">Vencidos</texto-pequeno>
              <p class="text-xl sm:text-2xl font-bold text-red-600 mt-1">{{ vencidos }}</p>
            </div>
            <div class="bg-white rounded-xl border border-stone-200 p-3 sm:p-4">
              <texto-pequeno color="gris">Devueltos</texto-pequeno>
              <p class="text-xl sm:text-2xl font-bold text-blue-600 mt-1">{{ devueltos }}</p>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-stone-200 p-3 sm:p-4 mb-6">
            <app-pila-horizontal espacio="4" alinear="fin" envolver="si">
              <div class="relative flex-1 min-w-[200px]">
                <app-entrada-busqueda
                  class="block"
                  placeholder="Buscar por usuario, libro o código de barras..."
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
                    Préstamo
                  </th>
                  <th
                    class="text-left px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                    Máx. Devolución
                  </th>
                  <th
                    class="text-center px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                    Estado
                  </th>
                  <th
                    class="text-center px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                    Acciones
                  </th>
                </tr>
                </thead>
                <tbody class="divide-y divide-stone-100">
                  @for (prestamo of prestamosPaginados; track prestamo.id) {
                    <tr class="hover:bg-amber-50/30 transition-colors">
                      <td class="px-3 sm:px-5 py-3">
                        <span class="text-xs font-mono text-stone-400">{{ prestamo.id.slice(0, 8) }}</span>
                      </td>
                      <td class="px-3 sm:px-5 py-3">
                        <span class="text-sm font-medium text-stone-800">
                          {{ obtenerUsuario(prestamo)?.nombre }} {{ obtenerUsuario(prestamo)?.apellidos?.charAt(0) }}.
                        </span>
                      </td>
                      <td class="px-3 sm:px-5 py-3">
                        <span class="text-sm text-stone-700">{{ obtenerTituloLibro(prestamo) }}</span>
                      </td>
                      <td class="px-3 sm:px-5 py-3">
                        <texto-pequeno>{{ prestamo.creadoEn | date: 'dd/MM/yyyy' }}</texto-pequeno>
                      </td>
                      <td class="px-3 sm:px-5 py-3">
                        <texto-pequeno>{{ prestamo.fechaMaxDevolucion | date: 'dd/MM/yyyy' }}</texto-pequeno>
                      </td>
                      <td class="px-3 sm:px-5 py-3 text-center">
                        @switch (prestamo.estado) {
                          @case ('activo') {
                            <app-insignia etiqueta="Activo" color="green" variante="sutil"/>
                          }
                          @case ('vencido') {
                            <app-insignia etiqueta="Vencido" color="red" variante="sutil"/>
                          }
                          @case ('devuelto') {
                            <app-insignia etiqueta="Devuelto" color="blue" variante="sutil"/>
                          }
                        }
                      </td>
                      <td class="px-3 sm:px-5 py-3">
                        <app-pila-horizontal espacio="1" justificar="centro">
                          @if (prestamo.estado !== 'devuelto') {
                            <app-boton-icono
                              icono="<"
                              tamanio="sm"
                              tooltip="Devolver libro"
                              (presionado)="devolverLibro(prestamo)"/>
                          }

                        </app-pila-horizontal>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="7" class="px-5 py-12 text-center">
                        <texto-pequeno>No se encontraron préstamos con los filtros actuales.</texto-pequeno>
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
                [total]="prestamosFiltrados.length"
                [tamanioPagina]="tamanioPagina"
                (cambioPagina)="irAPagina($event)"/>
            </div>
          }
        </div>
      </main>
    </div>
  `,
})
export class AdminPrestamosComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly navigationService = inject(NavigationService);
  private readonly prestamoService = inject(PrestamoService);
  private readonly cdr = inject(ChangeDetectorRef);

  cargando: boolean = false;
  prestamos: any[] = [];

  ngOnInit(): void {
    this.cargarPrestamos();
  }

  cargarPrestamos(): void {
    this.cargando = true;
    this.prestamoService.listar().subscribe({
      next: (res: any) => {
        const listado = Array.isArray(res) ? res : (res?.data ?? []);
        this.prestamos = listado;
        this.cdr.detectChanges();
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error al cargar préstamos:', err.message);
        this.cargando = false;
      },
    });
  }

  terminoBusqueda: string = '';
  filtroEstado: string = '';

  opcionesEstado: Array<{ etiqueta: string; valor: string }> = [
    {etiqueta: 'Activo', valor: 'activo'},
    {etiqueta: 'Vencido', valor: 'vencido'},
    {etiqueta: 'Devuelto', valor: 'devuelto'},
  ];

  onBusquedaCambio(valor: string): void {
    this.terminoBusqueda = valor;
    this.paginaActual = 1;
  }

  onFiltroEstadoCambio(valor: string): void {
    this.filtroEstado = valor;
    this.paginaActual = 1;
  }

  paginaActual: number = 1;
  tamanioPagina: number = 10;

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.prestamosFiltrados.length / this.tamanioPagina));
  }

  get prestamosPaginados(): any[] {
    const ini = (this.paginaActual - 1) * this.tamanioPagina;
    return this.prestamosFiltrados.slice(ini, ini + this.tamanioPagina);
  }

  irAPagina(p: number): void {
    if (p >= 1 && p <= this.totalPaginas) this.paginaActual = p;
  }

  get prestamosFiltrados(): any[] {
    let r = this.prestamos;
    const t = this.terminoBusqueda.trim().toLowerCase();
    if (t) {
      r = r.filter((p: any) => {
        const nombre = (p.usuario?.nombre + ' ' + p.usuario?.apellidos).toLowerCase();
        const titulo = (p.ejemplar?.libro?.titulo ?? '').toLowerCase();
        const codigoBarras = (p.ejemplar?.codigoBarras ?? '').toLowerCase();
        return nombre.includes(t) || titulo.includes(t) || codigoBarras.includes(t);
      });
    }
    if (this.filtroEstado) {
      r = r.filter((p: any) => p.estado === this.filtroEstado);
    }
    return r;
  }

  get activos(): number {
    return this.prestamos.filter((p: any) => p.estado === 'activo').length;
  }

  get vencidos(): number {
    return this.prestamos.filter((p: any) => p.estado === 'vencido').length;
  }

  get devueltos(): number {
    return this.prestamos.filter((p: any) => p.estado === 'devuelto').length;
  }

  irADevolver(): void {
    this.router.navigate(['/admin/prestamos/devolver']);
  }

  devolverLibro(prestamo: any): void {
    this.router.navigate(['/admin/prestamos/devolver', prestamo.id]);
  }

  obtenerUsuario(prestamo: any): any {
    return prestamo.usuario ?? null;
  }

  obtenerTituloLibro(prestamo: any): string {
    return prestamo.ejemplar?.libro?.titulo ?? '—';
  }
}
