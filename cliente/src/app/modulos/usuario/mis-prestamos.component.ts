import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrestamoService } from '../../_services/prestamo.service';
import { HeaderComponent } from '../../_shared/componentes/navegacion/header.component';
import { FooterComponent } from '../../_shared/componentes/navegacion/footer.component';
import { PilaVerticalComponent } from '../../_shared/componentes/diseno/pila-vertical.component';
import { PilaHorizontalComponent } from '../../_shared/componentes/diseno/pila-horizontal.component';
import { TextTituloComponent } from '../../_shared/componentes/texto/text-titulo.component';
import { TextoPequenoComponent } from '../../_shared/componentes/texto/texto-pequeno.component';
import { EntradaBusquedaComponent } from '../../_shared/componentes/entradas/entrada-busqueda.component';
import { SelectorComponent } from '../../_shared/componentes/entradas/selector.component';
import { InsigniaComponent } from '../../_shared/componentes/datos/insignia.component';
import { PaginacionComponent } from '../../_shared/componentes/navegacion/paginacion.component';

type EstadoFiltro = '' | 'activo' | 'devuelto' | 'vencido';

@Component({
  selector: 'app-mis-prestamos',
  standalone: true,
  imports: [
    CommonModule, FormsModule, DatePipe,
    HeaderComponent, FooterComponent,
    PilaVerticalComponent, PilaHorizontalComponent,
    TextTituloComponent, TextoPequenoComponent,
    EntradaBusquedaComponent, SelectorComponent,
    InsigniaComponent, PaginacionComponent,
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-stone-50">
      <app-header />

      <main class="flex-1 px-4 sm:px-6 py-8 max-w-5xl mx-auto w-full">

        <!-- Encabezado -->
        <app-pila-horizontal espacio="4" alinear="centro" justificar="entre" class="mb-6 flex-wrap">
          <app-pila-vertical espacio="1">
            <texto-titulo tamanio="xl">Mis Préstamos</texto-titulo>
            <texto-pequeno>Historial y estado de todos tus préstamos activos y anteriores.</texto-pequeno>
            <p></p>
            <p></p>
            <p></p>
          </app-pila-vertical>
        </app-pila-horizontal>

        <!-- Tarjetas de métricas -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div class="bg-white rounded-xl border border-stone-200 p-3 sm:p-4">
            <texto-pequeno color="gris">Total</texto-pequeno>
            <p class="text-xl sm:text-2xl font-bold text-stone-800 mt-1">{{ prestamos().length }}</p>
          </div>
          <div class="bg-white rounded-xl border border-stone-200 p-3 sm:p-4">
            <texto-pequeno color="gris">Activos</texto-pequeno>
            <p class="text-xl sm:text-2xl font-bold text-green-600 mt-1">{{ totalActivos() }}</p>
          </div>
          <div class="bg-white rounded-xl border border-stone-200 p-3 sm:p-4">
            <texto-pequeno color="gris">Vencidos</texto-pequeno>
            <p class="text-xl sm:text-2xl font-bold text-red-600 mt-1">{{ totalVencidos() }}</p>
          </div>
          <div class="bg-white rounded-xl border border-stone-200 p-3 sm:p-4">
            <texto-pequeno color="gris">Devueltos</texto-pequeno>
            <p class="text-xl sm:text-2xl font-bold text-blue-600 mt-1">{{ totalDevueltos() }}</p>
          </div>
        </div>

        <!-- Barra de filtros -->
        <div class="bg-white rounded-xl border border-stone-200 p-3 sm:p-4 mb-6">
          <app-pila-horizontal espacio="4" alinear="fin" envolver="si">
            <div class="flex-1 min-w-[200px]">
              <app-entrada-busqueda
                placeholder="Buscar por título del libro…"
                [valor]="busqueda()"
                (valorCambio)="onBusquedaCambio($event)"/>
            </div>
            <app-selector
              etiqueta="Estado"
              id="filtro-estado"
              [opciones]="opcionesEstado"
              [valor]="filtroEstado()"
              (valorCambio)="onFiltroEstadoCambio($event)"
              placeholder="Todos"/>
          </app-pila-horizontal>
        </div>

        <!-- Estado de carga -->
        @if (cargando()) {
          <div class="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div class="flex flex-col divide-y divide-stone-100">
              @for (i of [1,2,3]; track i) {
                <div class="h-16 px-5 py-3 animate-pulse bg-stone-50"></div>
              }
            </div>
          </div>
        }

        <!-- Error -->
        @if (error()) {
          <div class="bg-red-50 rounded-xl border border-red-100 px-5 py-4">
            <texto-pequeno color="rojo">{{ error() }}</texto-pequeno>
          </div>
        }

        <!-- Tabla de préstamos -->
        @if (!cargando() && !error()) {
          <div class="bg-white rounded-xl border border-stone-200 overflow-hidden w-full">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-stone-200 bg-stone-50">
                    <th class="text-left px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                      Libro
                    </th>
                    <th class="text-left px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                      Ejemplar
                    </th>
                    <th class="text-left px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                      Prestado
                    </th>
                    <th class="text-left px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                      Máx. Devolución
                    </th>
                    <th class="text-center px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                      Estado
                    </th>
                    <th class="text-center px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                      Días rest.
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-stone-100">
                  @for (p of prestamosPaginados(); track p.id) {
                    <tr class="hover:bg-amber-50/30 transition-colors">

                      <!-- Título + multa -->
                      <td class="px-3 sm:px-5 py-3">
                        <div class="flex flex-col gap-0.5">
                          <span class="text-sm font-medium text-stone-800">
                            {{ p.ejemplar?.libro?.titulo ?? 'Libro no disponible' }}
                          </span>
                          @if (p.multa) {
                            <app-insignia
                              [etiqueta]="'Multa · S/ ' + p.multa.monto"
                              color="red"
                              variante="sutil"/>
                          }
                        </div>
                      </td>

                      <!-- Código de barras -->
                      <td class="px-3 sm:px-5 py-3">
                        <span class="text-xs font-mono text-stone-400">
                          {{ p.ejemplar?.codigoBarras ?? p.ejemplarId }}
                        </span>
                      </td>

                      <!-- Fecha préstamo -->
                      <td class="px-3 sm:px-5 py-3">
                        <texto-pequeno>{{ p.creadoEn | date: 'dd/MM/yyyy' }}</texto-pequeno>
                      </td>

                      <!-- Fecha máx. devolución -->
                      <td class="px-3 sm:px-5 py-3">
                        <texto-pequeno>
                          @if (p.fechaDevolucion) {
                            {{ p.fechaDevolucion | date: 'dd/MM/yyyy' }}
                          } @else {
                            {{ p.fechaMaxDevolucion | date: 'dd/MM/yyyy' }}
                          }
                        </texto-pequeno>
                      </td>

                      <!-- Estado -->
                      <td class="px-3 sm:px-5 py-3 text-center">
                        @switch (p.estado) {
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

                      <!-- Días restantes -->
                      <td class="px-3 sm:px-5 py-3 text-center">
                        @if (p.estado === 'activo') {
                          <span class="text-sm font-bold"
                            [class]="diasRestantes(p) < 0 ? 'text-red-500' : diasRestantes(p) <= 3 ? 'text-amber-500' : 'text-green-600'">
                            {{ diasRestantes(p) < 0 ? 0 : diasRestantes(p) }}
                          </span>
                        } @else {
                          <span class="text-xs text-stone-300">—</span>
                        }
                      </td>

                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="6" class="px-5 py-12 text-center">
                        <texto-pequeno>No se encontraron préstamos con los filtros actuales.</texto-pequeno>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          <!-- Paginación -->
          @if (totalPaginas() > 1) {
            <div class="mt-6 flex justify-center">
              <app-paginacion
                [pagina]="paginaActual()"
                [total]="prestamosFiltrados().length"
                [tamanioPagina]="tamanioPagina"
                (cambioPagina)="irAPagina($event)"/>
            </div>
          }
        }

      </main>

      <app-footer />
    </div>
  `,
  styles: ``,
})
export class MisPrestamosComponent implements OnInit {
  prestamos = signal<any[]>([]);
  cargando = signal(true);
  error = signal('');
  busqueda = signal('');
  filtroEstado = signal<EstadoFiltro>('');

  paginaActual = signal(1);
  tamanioPagina = 10;

  opcionesEstado: Array<{ etiqueta: string; valor: string }> = [
    { etiqueta: 'Activo',   valor: 'activo' },
    { etiqueta: 'Vencido',  valor: 'vencido' },
    { etiqueta: 'Devuelto', valor: 'devuelto' },
  ];

  prestamosFiltrados = computed(() => {
    const estado = this.filtroEstado();
    const texto = this.busqueda().toLowerCase().trim();
    return this.prestamos().filter(p => {
      const coincideEstado = !estado || p.estado === estado;
      const titulo = (p.ejemplar?.libro?.titulo ?? '').toLowerCase();
      const codigo = (p.ejemplar?.codigoBarras ?? '').toLowerCase();
      const coincideTexto = !texto || titulo.includes(texto) || codigo.includes(texto);
      return coincideEstado && coincideTexto;
    });
  });

  totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.prestamosFiltrados().length / this.tamanioPagina))
  );

  prestamosPaginados = computed(() => {
    const ini = (this.paginaActual() - 1) * this.tamanioPagina;
    return this.prestamosFiltrados().slice(ini, ini + this.tamanioPagina);
  });

  totalActivos = computed(() => this.prestamos().filter(p => p.estado === 'activo').length);
  totalVencidos = computed(() => this.prestamos().filter(p => p.estado === 'vencido').length);
  totalDevueltos = computed(() => this.prestamos().filter(p => p.estado === 'devuelto').length);

  onBusquedaCambio(valor: string): void {
    this.busqueda.set(valor);
    this.paginaActual.set(1);
  }

  onFiltroEstadoCambio(valor: string): void {
    this.filtroEstado.set(valor as EstadoFiltro);
    this.paginaActual.set(1);
  }

  irAPagina(p: number): void {
    if (p >= 1 && p <= this.totalPaginas()) this.paginaActual.set(p);
  }

  constructor(private prestamoService: PrestamoService) {}

  ngOnInit() {
    this.prestamoService.misPrestamos().subscribe({
      next: (res: any) => {
        this.prestamos.set(res?.data ?? res ?? []);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar tus préstamos. Intenta de nuevo.');
        this.cargando.set(false);
      },
    });
  }

  diasRestantes(p: any): number {
    const hoy = new Date();
    const limite = new Date(p.fechaMaxDevolucion);
    return Math.floor((limite.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
  }

  estaVencido(p: any): boolean {
    return p.estado === 'activo' && this.diasRestantes(p) < 0;
  }
}
