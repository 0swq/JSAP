import {
  Component,
  inject,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { SidebarComponent } from '../../_shared/componentes/navegacion/sidebar.component';
import { TarjetaComponent } from '../../_shared/componentes/datos/tarjeta.component';
import { TextTituloComponent } from '../../_shared/componentes/texto/text-titulo.component';
import { TextoNormalComponent } from '../../_shared/componentes/texto/texto-normal.component';
import { LibroService } from '../../_services/libro.service';
import { PrestamoService } from '../../_services/prestamo.service';
import { EjemplarService } from '../../_services/ejemplar.service';
import { ReservaService } from '../../_services/reserva.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterModule,
    SidebarComponent,
    TarjetaComponent,
    TextTituloComponent,
    TextoNormalComponent,
  ],
  template: `
    <div class="flex min-h-screen bg-stone-50">
      <app-sidebar></app-sidebar>

      <main class="flex-1 flex flex-col min-w-0">
        <div class="px-6 py-6 max-w-7xl w-full mx-auto">

          <texto-titulo>Dashboard</texto-titulo>
          <texto-normal>Resumen general de la biblioteca.</texto-normal>

          <!-- ── Tarjetas de resumen ── -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            @for (stat of stats; track stat.etiqueta) {
              <app-tarjeta [titulo]="stat.etiqueta">
                <div class="flex items-baseline gap-2">
                  <span class="text-3xl font-bold text-stone-800">{{ stat.valor }}</span>
                  @if (stat.subtitulo) {
                    <span class="text-sm text-stone-400">{{ stat.subtitulo }}</span>
                  }
                </div>
                <div class="mt-1 flex items-center gap-2">
                  <span
                    class="inline-block w-2.5 h-2.5 rounded-full"
                    [style.background-color]="stat.color">
                  </span>
                  <span class="text-xs text-stone-500">{{ stat.etiquetaEstado }}</span>
                </div>
              </app-tarjeta>
            }
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

            <app-tarjeta titulo="Préstamos por estado" subtitulo="Distribución actual de préstamos">
              @if (!listo) {
                <div class="flex items-center justify-center h-56">
                  <div class="flex flex-col items-center gap-3">
                    <div class="w-8 h-8 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin"></div>
                    <span class="text-sm text-stone-400">Cargando...</span>
                  </div>
                </div>
              } @else if (sinPrestamos) {
                <div class="flex items-center justify-center h-56 text-sm text-stone-400">Sin datos de préstamos.</div>
              } @else {
                <div class="flex justify-center">
                  <canvas #canvasPrestamos height="240" class="max-h-60"></canvas>
                </div>
              }
            </app-tarjeta>

            <app-tarjeta titulo="Ejemplares por estado" subtitulo="Distribución del inventario físico">
              @if (!listo) {
                <div class="flex items-center justify-center h-56">
                  <div class="flex flex-col items-center gap-3">
                    <div class="w-8 h-8 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin"></div>
                    <span class="text-sm text-stone-400">Cargando...</span>
                  </div>
                </div>
              } @else if (sinEjemplares) {
                <div class="flex items-center justify-center h-56 text-sm text-stone-400">Sin ejemplares registrados.</div>
              } @else {
                <div class="flex justify-center">
                  <canvas #canvasEjemplares height="240" class="max-h-60"></canvas>
                </div>
              }
            </app-tarjeta>

          </div>

        </div>
      </main>
    </div>
  `,
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly libroService = inject(LibroService);
  private readonly prestamoService = inject(PrestamoService);
  private readonly ejemplarService = inject(EjemplarService);
  private readonly reservaService = inject(ReservaService);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild('canvasPrestamos') canvasPrestamosRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasEjemplares') canvasEjemplaresRef!: ElementRef<HTMLCanvasElement>;

  private chartPrestamos: Chart<'doughnut'> | null = null;
  private chartEjemplares: Chart<'bar'> | null = null;

  stats: Array<{
    etiqueta: string;
    valor: number;
    subtitulo: string;
    etiquetaEstado: string;
    color: string;
  }> = [];

  listo = false;

  sinPrestamos = true;
  sinEjemplares = true;

  private datosPrestamos: { etiquetas: string[]; datos: number[]; colores: string[] } = {
    etiquetas: [],
    datos: [],
    colores: [],
  };

  private datosEjemplares: { etiquetas: string[]; datos: number[]; colores: string[] } = {
    etiquetas: [],
    datos: [],
    colores: [],
  };

  private contadorCargas = 0;
  private readonly totalCargas = 4;

  private normalizarLista(data: any): any[] {
    if (Array.isArray(data)) return data;
    return data?.data ?? data?.resultados ?? data?.items ?? [];
  }
  ngOnInit(): void {
    this.cargarLibros();
    this.cargarPrestamos();
    this.cargarEjemplares();
    this.cargarReservas();
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.chartPrestamos?.destroy();
    this.chartEjemplares?.destroy();
  }

  private cargarLibros(): void {
    this.libroService.listar().subscribe({
      next: (data: any) => {
        const items = this.normalizarLista(data);
        this.actualizarStat('Libros', items.length, 'catálogo', '#78716c');
        this.marcarCarga();
      },
      error: () => {
        this.actualizarStat('Libros', 0, 'catálogo', '#78716c');
        this.marcarCarga();
      },
    });
  }

  private cargarPrestamos(): void {
    this.prestamoService.listar().subscribe({
      next: (data: any) => {
        const items = this.normalizarLista(data);
        const porEstado: Record<string, number> = { activo: 0, devuelto: 0, vencido: 0 };

        for (const p of items) {
          const estado = p.estado ?? 'desconocido';
          porEstado[estado] = (porEstado[estado] ?? 0) + 1;
        }

        const colorMap: Record<string, string> = {
          activo: '#3b82f6',
          devuelto: '#22c55e',
          vencido: '#ef4444',
        };

        const entradas = Object.entries(porEstado).filter(([_, v]) => v > 0);

        this.datosPrestamos = {
          etiquetas: entradas.map(([e]) => e),
          datos: entradas.map(([_, v]) => v),
          colores: entradas.map(([e]) => colorMap[e] ?? '#d4d4d8'),
        };

        this.sinPrestamos = entradas.length === 0;
        this.actualizarStat('Préstamos activos', porEstado['activo'] ?? 0, 'en curso', '#3b82f6');
        this.marcarCarga();
      },
      error: () => {
        this.sinPrestamos = true;
        this.actualizarStat('Préstamos activos', 0, 'en curso', '#3b82f6');
        this.marcarCarga();
      },
    });
  }

  private cargarEjemplares(): void {
    this.ejemplarService.listar().subscribe({
      next: (data: any) => {
        const items = this.normalizarLista(data);
        const porEstado: Record<string, number> = {
          disponible: 0,
          prestado: 0,
          perdido: 0,
          mantenimiento: 0,
        };

        for (const e of items) {
          const estado = e.estado ?? 'desconocido';
          porEstado[estado] = (porEstado[estado] ?? 0) + 1;
        }

        const colorMap: Record<string, string> = {
          disponible: '#22c55e',
          prestado: '#3b82f6',
          perdido: '#ef4444',
          mantenimiento: '#f59e0b',
        };

        const entradas = Object.entries(porEstado).filter(([_, v]) => v > 0);

        this.datosEjemplares = {
          etiquetas: entradas.map(([e]) => e),
          datos: entradas.map(([_, v]) => v),
          colores: entradas.map(([e]) => colorMap[e] ?? '#d4d4d8'),
        };

        this.sinEjemplares = entradas.length === 0;
        this.actualizarStat('Ejemplares', items.length, 'inventario', '#78716c');
        this.marcarCarga();
      },
      error: () => {
        this.sinEjemplares = true;
        this.actualizarStat('Ejemplares', 0, 'inventario', '#78716c');
        this.marcarCarga();
      },
    });
  }

  private cargarReservas(): void {
    this.reservaService.listar().subscribe({
      next: (data: any) => {
        const items = this.normalizarLista(data);
        const activas = items.filter(
          (r: any) => r.estado === 'pendiente' || r.estado === 'activa',
        ).length;
        this.actualizarStat('Reservas activas', activas, 'pendientes/activas', '#f59e0b');
        this.marcarCarga();
      },
      error: () => {
        this.actualizarStat('Reservas activas', 0, 'pendientes/activas', '#f59e0b');
        this.marcarCarga();
      },
    });
  }


  private marcarCarga(): void {
    this.contadorCargas++;
    if (this.contadorCargas >= this.totalCargas) {
      this.listo = true;
      this.cdr.detectChanges();
      setTimeout(() => this.crearGraficos(), 0);
    }
  }

  private crearGraficos(): void {
    this.crearDoughnutPrestamos();
    this.crearBarrasEjemplares();
  }
  private crearDoughnutPrestamos(): void {
    if (!this.canvasPrestamosRef || this.sinPrestamos) return;
    this.chartPrestamos?.destroy();

    const ctx = this.canvasPrestamosRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chartPrestamos = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.datosPrestamos.etiquetas.map(
          e => e.charAt(0).toUpperCase() + e.slice(1),
        ),
        datasets: [
          {
            data: this.datosPrestamos.datos,
            backgroundColor: this.datosPrestamos.colores,
            borderColor: '#ffffff',
            borderWidth: 2,
            hoverBorderColor: '#ffffff',
            hoverBorderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 16,
              usePointStyle: true,
              pointStyleWidth: 10,
              font: { size: 12, family: "'Inter', system-ui, sans-serif" },
              color: '#57534e',
            },
          },
          tooltip: {
            backgroundColor: '#1c1917',
            titleFont: { size: 13 },
            bodyFont: { size: 12 },
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => {
                const total = (ctx.dataset.data as number[]).reduce((a, b) => a + b, 0);
                const pct = total > 0 ? Math.round(((ctx.parsed as number) / total) * 100) : 0;
                return ` ${ctx.label}: ${ctx.parsed} (${pct}%)`;
              },
            },
          },
        },
      },
    });
  }
  private crearBarrasEjemplares(): void {
    if (!this.canvasEjemplaresRef || this.sinEjemplares) return;

    this.chartEjemplares?.destroy();

    const ctx = this.canvasEjemplaresRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chartEjemplares = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.datosEjemplares.etiquetas.map(
          e => e.charAt(0).toUpperCase() + e.slice(1),
        ),
        datasets: [
          {
            data: this.datosEjemplares.datos,
            backgroundColor: this.datosEjemplares.colores,
            borderRadius: 6,
            borderSkipped: false,
            barPercentage: 0.6,
            categoryPercentage: 0.7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1c1917',
            titleFont: { size: 13 },
            bodyFont: { size: 12 },
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => ` ${ctx.raw} ejemplares`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              font: { size: 11, family: "'Inter', system-ui, sans-serif" },
              color: '#78716c',
            },
            grid: {
              color: '#e7e5e4',
            },
            border: {
              display: false,
            },
          },
          x: {
            ticks: {
              font: { size: 11, family: "'Inter', system-ui, sans-serif" },
              color: '#78716c',
            },
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
          },
        },
      },
    });
  }


  private actualizarStat(
    etiqueta: string,
    valor: number,
    subtitulo: string,
    color: string,
  ): void {
    const existente = this.stats.find(s => s.etiqueta === etiqueta);
    const entrada = { etiqueta, valor, subtitulo, etiquetaEstado: subtitulo, color };

    if (existente) {
      Object.assign(existente, entrada);
    } else {
      this.stats.push(entrada);
    }

    const orden = ['Libros', 'Préstamos activos', 'Ejemplares', 'Reservas activas'];
    this.stats.sort((a, b) => orden.indexOf(a.etiqueta) - orden.indexOf(b.etiqueta));
    this.cdr.detectChanges();
  }
}
