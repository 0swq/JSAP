import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../../_services/reserva.service';
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
import { BotonComponent } from '../../_shared/componentes/botones/boton.component';

type EstadoFiltro = '' | 'pendiente' | 'activa' | 'cancelada' | 'completada';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [
    CommonModule, FormsModule, DatePipe,
    HeaderComponent, FooterComponent,
    PilaVerticalComponent, PilaHorizontalComponent,
    TextTituloComponent, TextoPequenoComponent,
    EntradaBusquedaComponent, SelectorComponent,
    InsigniaComponent, PaginacionComponent,
    BotonComponent,
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-stone-50">
      <app-header />

      <main class="flex-1 px-4 sm:px-6 py-8 max-w-5xl mx-auto w-full">

        <!-- Encabezado -->
        <app-pila-horizontal espacio="4" alinear="centro" justificar="entre" class="mb-6 flex-wrap">
          <app-pila-vertical espacio="1">
            <texto-titulo tamanio="xl">Mis Reservas</texto-titulo>
            <texto-pequeno>Estado y seguimiento de todas tus reservas activas y anteriores.</texto-pequeno>
          </app-pila-vertical>
        </app-pila-horizontal>

        <!-- Tarjetas de métricas -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div class="bg-white rounded-xl border border-stone-200 p-3 sm:p-4">
            <texto-pequeno color="gris">Total</texto-pequeno>
            <p class="text-xl sm:text-2xl font-bold text-stone-800 mt-1">{{ reservas().length }}</p>
          </div>
          <div class="bg-white rounded-xl border border-stone-200 p-3 sm:p-4">
            <texto-pequeno color="gris">Pendientes</texto-pequeno>
            <p class="text-xl sm:text-2xl font-bold text-amber-600 mt-1">{{ totalPendientes() }}</p>
          </div>
          <div class="bg-white rounded-xl border border-stone-200 p-3 sm:p-4">
            <texto-pequeno color="gris">Activas</texto-pequeno>
            <p class="text-xl sm:text-2xl font-bold text-green-600 mt-1">{{ totalActivas() }}</p>
          </div>
          <div class="bg-white rounded-xl border border-stone-200 p-3 sm:p-4">
            <texto-pequeno color="gris">Completadas</texto-pequeno>
            <p class="text-xl sm:text-2xl font-bold text-blue-600 mt-1">{{ totalCompletadas() }}</p>
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

        <!-- Tabla de reservas -->
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
                      Reservado
                    </th>
                    <th class="text-left px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                      Expira
                    </th>
                    <th class="text-center px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                      Estado
                    </th>
                    <th class="text-center px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-stone-100">
                  @for (r of reservasPaginadas(); track r.id) {
                    <tr class="hover:bg-amber-50/30 transition-colors">

                      <!-- Título del libro -->
                      <td class="px-3 sm:px-5 py-3">
                        <span class="text-sm font-medium text-stone-800">
                          {{ r.libro?.titulo ?? 'Libro no disponible' }}
                        </span>
                      </td>

                      <!-- Código de barras -->
                      <td class="px-3 sm:px-5 py-3">
                        <span class="text-xs font-mono text-stone-400">
                          {{ r.ejemplar?.codigoBarras ?? r.ejemplarId ?? '—' }}
                        </span>
                      </td>

                      <!-- Fecha de creación -->
                      <td class="px-3 sm:px-5 py-3">
                        <texto-pequeno>{{ r.creadoEn | date: 'dd/MM/yyyy' }}</texto-pequeno>
                      </td>

                      <!-- Fecha de expiración -->
                      <td class="px-3 sm:px-5 py-3">
                        <texto-pequeno>{{ r.fechaExpiracion | date: 'dd/MM/yyyy' }}</texto-pequeno>
                      </td>

                      <!-- Estado -->
                      <td class="px-3 sm:px-5 py-3 text-center">
                        @switch (r.estado) {
                          @case ('pendiente') {
                            <app-insignia etiqueta="Pendiente" color="amber" variante="sutil"/>
                          }
                          @case ('activa') {
                            <app-insignia etiqueta="Activa" color="green" variante="sutil"/>
                          }
                          @case ('completada') {
                            <app-insignia etiqueta="Completada" color="blue" variante="sutil"/>
                          }
                          @case ('cancelada') {
                            <app-insignia etiqueta="Cancelada" color="red" variante="sutil"/>
                          }
                        }
                      </td>

                      <!-- Acciones -->
                      <td class="px-3 sm:px-5 py-3 text-center">
                        @if (r.estado === 'pendiente' || r.estado === 'activa') {
                          <app-boton
                            etiqueta="Cancelar"
                            tamanio="sm"
                            variante="peligro"
                            [cargando]="cancelando() === r.id"
                            [deshabilitado]="cancelando() !== null"
                            (presionado)="cancelarReserva(r)"/>
                        } @else {
                          <span class="text-xs text-stone-300">—</span>
                        }
                      </td>

                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="6" class="px-5 py-12 text-center">
                        <texto-pequeno>No se encontraron reservas con los filtros actuales.</texto-pequeno>
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
                [total]="reservasFiltradas().length"
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
export class MisReservasComponent implements OnInit {
  reservas = signal<any[]>([]);
  cargando = signal(true);
  error = signal('');
  busqueda = signal('');
  filtroEstado = signal<EstadoFiltro>('');
  cancelando = signal<string | null>(null);

  paginaActual = signal(1);
  tamanioPagina = 10;

  opcionesEstado: Array<{ etiqueta: string; valor: string }> = [
    { etiqueta: 'Pendiente',  valor: 'pendiente' },
    { etiqueta: 'Activa',     valor: 'activa' },
    { etiqueta: 'Completada', valor: 'completada' },
    { etiqueta: 'Cancelada',  valor: 'cancelada' },
  ];

  reservasFiltradas = computed(() => {
    const estado = this.filtroEstado();
    const texto = this.busqueda().toLowerCase().trim();
    return this.reservas().filter(r => {
      const coincideEstado = !estado || r.estado === estado;
      const titulo = (r.libro?.titulo ?? '').toLowerCase();
      const codigo = (r.ejemplar?.codigoBarras ?? '').toLowerCase();
      const coincideTexto = !texto || titulo.includes(texto) || codigo.includes(texto);
      return coincideEstado && coincideTexto;
    });
  });

  totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.reservasFiltradas().length / this.tamanioPagina))
  );

  reservasPaginadas = computed(() => {
    const ini = (this.paginaActual() - 1) * this.tamanioPagina;
    return this.reservasFiltradas().slice(ini, ini + this.tamanioPagina);
  });

  totalPendientes  = computed(() => this.reservas().filter(r => r.estado === 'pendiente').length);
  totalActivas     = computed(() => this.reservas().filter(r => r.estado === 'activa').length);
  totalCompletadas = computed(() => this.reservas().filter(r => r.estado === 'completada').length);

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

  constructor(private reservaService: ReservaService) {}

  ngOnInit(): void {
    this.reservaService.misReservas().subscribe({
      next: (res: any) => {
        this.reservas.set(res?.data ?? res ?? []);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar tus reservas. Intenta de nuevo.');
        this.cargando.set(false);
      },
    });
  }

  cancelarReserva(reserva: any): void {
    this.cancelando.set(reserva.id);
    this.reservaService.cancelar(reserva.id).subscribe({
      next: () => {
        this.reservas.update(lista =>
          lista.map(r => r.id === reserva.id ? { ...r, estado: 'cancelada' } : r)
        );
        this.cancelando.set(null);
      },
      error: () => {
        this.cancelando.set(null);
      },
    });
  }
}
