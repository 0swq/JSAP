import {Component, inject, OnInit, ChangeDetectorRef} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SidebarComponent} from '../../_shared/componentes/navegacion/sidebar.component';
import {PilaVerticalComponent} from '../../_shared/componentes/diseno/pila-vertical.component';
import {PilaHorizontalComponent} from '../../_shared/componentes/diseno/pila-horizontal.component';
import {BotonIconoComponent} from '../../_shared/componentes/botones/boton-icono.component';
import {TextoPequenoComponent} from '../../_shared/componentes/texto/texto-pequeno.component';
import {TextTituloComponent} from '../../_shared/componentes/texto/text-titulo.component';
import {EntradaBusquedaComponent} from '../../_shared/componentes/entradas/entrada-busqueda.component';
import {SelectorComponent} from '../../_shared/componentes/entradas/selector.component';
import {InsigniaComponent} from '../../_shared/componentes/datos/insignia.component';
import {PaginacionComponent} from '../../_shared/componentes/navegacion/paginacion.component';
import {AlertaComponent} from '../../_shared/componentes/retroalimentacion/alerta.component';
import {NavigationService} from '../../_services/navigation-store';
import {MultaService} from '../../_services/multa.service';
import {Multa} from '../../model';

@Component({
  selector: 'app-admin-multas',
  standalone: true,
  imports: [
    SidebarComponent, PilaVerticalComponent, PilaHorizontalComponent,
    BotonIconoComponent,
    TextoPequenoComponent, TextTituloComponent, EntradaBusquedaComponent,
    SelectorComponent, InsigniaComponent, PaginacionComponent,
    AlertaComponent,
    FormsModule, RouterModule, DatePipe,
  ],
  template: `
    <div class="flex min-h-screen bg-stone-50">
      <app-sidebar></app-sidebar>

      <main class="flex-1 flex flex-col min-w-0">
        <div class="px-6 py-6 max-w-7xl w-full mx-auto">

          <app-pila-horizontal espacio="4" alinear="centro" justificar="entre" class="mb-6">
            <app-pila-vertical espacio="1">
              <texto-titulo tamanio="xl">Multas</texto-titulo>
              <texto-pequeno>Administra las multas generadas por préstamos vencidos.</texto-pequeno>
            </app-pila-vertical>
          </app-pila-horizontal>

          @if (error) {
            <app-alerta tipo="error" [mensaje]="error" class="mb-4 block"/>
          }

          <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div class="bg-white rounded-xl border border-stone-200 p-4">
              <texto-pequeno color="gris">Total multas</texto-pequeno>
              <p class="text-2xl font-bold text-stone-800 mt-1">{{ multas.length }}</p>
            </div>
            <div class="bg-white rounded-xl border border-stone-200 p-4">
              <texto-pequeno color="gris">Pendientes</texto-pequeno>
              <p class="text-2xl font-bold text-amber-600 mt-1">{{ pendientes }}</p>
            </div>
            <div class="bg-white rounded-xl border border-stone-200 p-4">
              <texto-pequeno color="gris">Pagadas</texto-pequeno>
              <p class="text-2xl font-bold text-green-600 mt-1">{{ pagadas }}</p>
            </div>
            <div class="bg-white rounded-xl border border-stone-200 p-4">
              <texto-pequeno color="gris">Monto total pendiente</texto-pequeno>
              <p class="text-2xl font-bold text-red-600 mt-1">S/ {{ montoPendiente.toFixed(2) }}</p>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-stone-200 p-4 mb-6">
            <app-pila-horizontal espacio="4" alinear="fin" envolver="si">
              <div class="relative flex-1 min-w-[200px]">
                <app-entrada-busqueda
                  class="block"
                  placeholder="Buscar por usuario o libro..."
                  [valor]="terminoBusqueda"
                  (valorCambio)="onBusquedaCambio($event)"/>
              </div>
              <app-selector
                etiqueta="Estado"
                id="filtro-estado"
                [opciones]="opcionesEstado"
                [valor]="filtroEstado"
                (valorCambio)="onFiltroEstadoCambio($event)"
                placeholder="Todos los estados"/>
            </app-pila-horizontal>
          </div>

          <div class="bg-white rounded-xl border border-stone-200 overflow-hidden">
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
                    class="text-right px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                    Monto
                  </th>
                  <th
                    class="text-center px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                    Días Mora
                  </th>
                  <th
                    class="text-center px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                    Estado
                  </th>
                  <th
                    class="text-left px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                    Creado
                  </th>
                  <th
                    class="text-center px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                    Acciones
                  </th>
                </tr>
                </thead>
                <tbody class="divide-y divide-stone-100">
                  @for (multa of multasPaginadas; track multa.id) {
                    <tr class="hover:bg-amber-50/30 transition-colors">
                      <td class="px-3 sm:px-5 py-3">
                        <span class="text-xs font-mono text-stone-400">{{ multa.id.slice(0, 8) }}</span>
                      </td>
                      <td class="px-3 sm:px-5 py-3">
                        <span class="text-sm font-medium text-stone-800">
                          {{ obtenerUsuario(multa)?.nombre }} {{ obtenerUsuario(multa)?.apellidos?.charAt(0) }}.
                        </span>
                      </td>
                      <td class="px-3 sm:px-5 py-3">
                        <span class="text-sm text-stone-700">{{ obtenerTituloLibro(multa) }}</span>
                      </td>
                      <td class="px-3 sm:px-5 py-3 text-right">
                        <span class="text-sm font-semibold text-stone-800">S/ {{ multa.monto.toFixed(2) }}</span>
                      </td>
                      <td class="px-3 sm:px-5 py-3 text-center">
                        <span class="text-xs text-stone-600">{{ multa.diasMora }} días</span>
                      </td>
                      <td class="px-3 sm:px-5 py-3 text-center">
                        @switch (multa.estado) {
                          @case ('pendiente') {
                            <app-insignia etiqueta="Pendiente" color="amber" variante="sutil"/>
                          }
                          @case ('pagada') {
                            <app-insignia etiqueta="Pagada" color="green" variante="sutil"/>
                          }
                          @case ('perdonada') {
                            <app-insignia etiqueta="Perdonada" color="blue" variante="sutil"/>
                          }
                        }
                      </td>
                      <td class="px-3 sm:px-5 py-3">
                        <texto-pequeno>{{ multa.creadoEn | date: 'dd/MM/yyyy' }}</texto-pequeno>
                      </td>
                      <td class="px-3 sm:px-5 py-3">
                        <app-pila-horizontal espacio="1" justificar="centro">
                          @if (multa.estado === 'pendiente') {
                            <app-boton-icono
                              icono="S/."
                              tamanio="sm"
                              tooltip="Registrar pago"
                              (presionado)="registrarPago(multa)"/>
                            <app-boton-icono
                              icono="✓"
                              tamanio="sm"
                              tooltip="Perdonar"
                              (presionado)="perdonarMulta(multa)"/>
                          }
                          <app-boton-icono
                            icono="👁"
                            tamanio="sm"
                            tooltip="Ver detalle"
                            (presionado)="verDetalle(multa)"/>
                        </app-pila-horizontal>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="8" class="px-5 py-12 text-center">
                        <texto-pequeno>No se encontraron multas con los filtros actuales.</texto-pequeno>
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
                [total]="multasFiltradas.length"
                [tamanioPagina]="tamanioPagina"
                (cambioPagina)="irAPagina($event)"/>
            </div>
          }
        </div>
      </main>
    </div>
  `,
})
export class AdminMultasComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly navigationService = inject(NavigationService);
  private readonly multaService = inject(MultaService);
  private readonly cdr = inject(ChangeDetectorRef);

  cargando: boolean = false;
  multas: Multa[] = [];
  mensajeExito: string = '';
  error: string = '';

  ngOnInit(): void {
    this.cargarMultas();
  }

  cargarMultas(): void {
    this.cargando = true;
    this.multaService.listar().subscribe({
      next: (res: any) => {
        const listado = Array.isArray(res) ? res : (res?.data ?? []);
        this.multas = listado.map((m: any) => ({
          ...m,
          monto: Number(m.monto),
        }));
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar multas:', err.message);
        this.cargando = false;
      },
    });
  }
  terminoBusqueda: string = '';
  filtroEstado: string = '';

  opcionesEstado: Array<{ etiqueta: string; valor: string }> = [
    {etiqueta: 'Pendiente', valor: 'pendiente'},
    {etiqueta: 'Pagada', valor: 'pagada'},
    {etiqueta: 'Perdonada', valor: 'perdonada'},
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
    return Math.max(1, Math.ceil(this.multasFiltradas.length / this.tamanioPagina));
  }

  get multasPaginadas(): Multa[] {
    const inicio = (this.paginaActual - 1) * this.tamanioPagina;
    return this.multasFiltradas.slice(inicio, inicio + this.tamanioPagina);
  }

  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  get multasFiltradas(): Multa[] {
    let resultado = this.multas;
    const termino = this.terminoBusqueda.trim().toLowerCase();
    if (termino) {
      resultado = resultado.filter((m: any) => {
        const nombre = (m.prestamo?.usuario?.nombre + ' ' + m.prestamo?.usuario?.apellidos).toLowerCase();
        const titulo = (m.prestamo?.ejemplar?.libro?.titulo ?? '').toLowerCase();
        return nombre.includes(termino) || titulo.includes(termino);
      });
    }
    if (this.filtroEstado) {
      resultado = resultado.filter(m => m.estado === this.filtroEstado);
    }
    return resultado;
  }
  get pendientes(): number {
    return this.multas.filter(m => m.estado === 'pendiente').length;
  }

  get pagadas(): number {
    return this.multas.filter(m => m.estado === 'pagada').length;
  }

  get montoPendiente(): number {
    return this.multas
      .filter(m => m.estado === 'pendiente')
      .reduce((sum, m) => sum + Number(m.monto), 0);
  }

  obtenerUsuario(multa: any): any {
    return multa.prestamo?.usuario ?? null;
  }

  obtenerTituloLibro(multa: any): string {
    return multa.prestamo?.ejemplar?.libro?.titulo ?? '—';
  }

  registrarPago(multa: Multa): void {
    this.router.navigate(['/admin/multas/pagar', multa.id]);
  }

  perdonarMulta(multa: Multa): void {
    if (multa.estado !== 'pendiente') return;
    if (!confirm('¿Estás seguro de que deseas perdonar esta multa?')) return;

    this.error = '';
    this.mensajeExito = '';

    this.multaService.actualizar(multa.id, {estado: 'perdonada'}).subscribe({
      next: () => {
        this.mensajeExito = 'Multa perdonada correctamente.';
        this.cdr.detectChanges();
        this.cargarMultas();
      },
      error: (err: any) => {
        this.error = err?.error?.mensaje ?? err?.message ?? 'Error al perdonar la multa.';
        this.cdr.detectChanges();
      },
    });
  }

  verDetalle(multa: Multa): void {
    this.router.navigate(['/admin/multas/detalle', multa.id]);
  }
}
