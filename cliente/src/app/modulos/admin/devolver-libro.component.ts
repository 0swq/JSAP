import {Component, inject, OnInit, ChangeDetectorRef} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SidebarComponent} from '../../_shared/componentes/navegacion/sidebar.component';
import {PilaVerticalComponent} from '../../_shared/componentes/diseno/pila-vertical.component';
import {PilaHorizontalComponent} from '../../_shared/componentes/diseno/pila-horizontal.component';
import {TarjetaComponent} from '../../_shared/componentes/datos/tarjeta.component';
import {BotonComponent} from '../../_shared/componentes/botones/boton.component';
import {BotonContornoComponent} from '../../_shared/componentes/botones/boton-contorno.component';
import {TextoNormalComponent} from '../../_shared/componentes/texto/texto-normal.component';
import {TextoPequenoComponent} from '../../_shared/componentes/texto/texto-pequeno.component';
import {TextTituloComponent} from '../../_shared/componentes/texto/text-titulo.component';
import {InsigniaComponent} from '../../_shared/componentes/datos/insignia.component';
import {AvatarComponent} from '../../_shared/componentes/datos/avatar.component';
import {AlertaComponent} from '../../_shared/componentes/retroalimentacion/alerta.component';
import {PrestamoService} from '../../_services/prestamo.service';
import {ConfiguracionMultaService} from '../../_services/configuracion-multa.service';

@Component({
  selector: 'app-devolver-libro',
  standalone: true,
  imports: [
    SidebarComponent, PilaVerticalComponent, PilaHorizontalComponent,
    TarjetaComponent, BotonComponent, BotonContornoComponent,
    TextoNormalComponent, TextoPequenoComponent, TextTituloComponent,
    InsigniaComponent, AvatarComponent, AlertaComponent,
    FormsModule, DatePipe,
  ],
  template: `
    <div class="flex min-h-screen bg-stone-50">
      <app-sidebar></app-sidebar>

      <main class="flex-1 flex flex-col min-w-0">
        <div class="px-4 sm:px-6 py-6 max-w-3xl w-full mx-auto">

          <button
            type="button"
            (click)="volver()"
            class="text-sm text-stone-500 hover:text-stone-700 mb-4 inline-flex items-center gap-1">
            ← Volver a préstamos
          </button>

          <app-pila-horizontal espacio="4" alinear="centro" justificar="entre" class="mb-6 flex-wrap">
            <app-pila-vertical espacio="1" class="w-full">
              <texto-titulo tamanio="xl">Devolver Libro</texto-titulo>
              <texto-pequeno>Registra la devolución del ejemplar prestado.</texto-pequeno>
            </app-pila-vertical>
          </app-pila-horizontal>

          @if (!prestamo) {
            <div class="text-center py-16">
              <texto-normal>No se encontró el préstamo seleccionado.</texto-normal>
              <app-boton
                class="mt-4"
                etiqueta="Ir a préstamos"
                tamanio="sm"
                (presionado)="volver()"/>
            </div>
          } @else {
            <app-pila-vertical espacio="6" class="w-full">

              @if (exito) {
                <app-alerta tipo="exito" [mensaje]="mensajeExito"/>
              }

              @if (error) {
                <app-alerta tipo="error" [mensaje]="error"/>
              }

              @if (!exito) {
                <app-tarjeta titulo="Libro a devolver" class="w-full">
                  <div class="flex flex-col sm:flex-row items-start gap-4">
                    @if (libro) {
                      <div class="aspect-[9/16] w-16 flex-shrink-0 rounded-lg bg-gray-200 overflow-hidden flex items-center justify-center text-gray-400">
                        @if (libro.foto) {
                          <img [alt]="libro.titulo" [src]="libro.foto" class="w-full h-full object-cover"/>
                        } @else {
                          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                          </svg>
                        }
                      </div>
                    }
                    <div class="flex flex-col gap-1 flex-1 w-full">
                      @if (libro) {
                        <p class="font-semibold text-stone-800">{{ libro.titulo }}</p>
                        <texto-pequeno>{{ libro.autores?.join(', ') }}</texto-pequeno>
                      }
                      @if (ejemplar) {
                        <div class="mt-2 flex flex-wrap gap-3">
                          <span class="text-xs bg-stone-100 px-2 py-0.5 rounded font-mono text-stone-600">
                            {{ ejemplar.codigoBarras }}
                          </span>
                          <span class="text-xs bg-stone-100 px-2 py-0.5 rounded text-stone-600">
                            {{ ejemplar.ubicacion }}
                          </span>
                        </div>
                      }
                    </div>
                  </div>
                </app-tarjeta>

                @if (usuario) {
                  <app-tarjeta titulo="Usuario" class="w-full">
                    <div class="flex items-center gap-4">
                      <div>
                        <p class="font-semibold text-stone-800">{{ usuario.nombre }} {{ usuario.apellidos }}</p>
                        <texto-pequeno>{{ usuario.dni }} · {{ usuario.correo }}</texto-pequeno>
                      </div>
                    </div>
                  </app-tarjeta>
                }

                <app-tarjeta titulo="Datos del préstamo" class="w-full">
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <texto-pequeno color="gris">Fecha préstamo</texto-pequeno>
                      <p class="font-semibold text-stone-800">{{ prestamo.creadoEn | date: 'dd/MM/yyyy' }}</p>
                    </div>
                    <div>
                      <texto-pequeno color="gris">Máx. devolución</texto-pequeno>
                      <p class="font-semibold text-stone-800">{{ prestamo.fechaMaxDevolucion | date: 'dd/MM/yyyy' }}</p>
                    </div>
                    <div>
                      <texto-pequeno color="gris">Estado</texto-pequeno>
                      <app-insignia
                        [etiqueta]="prestamo.estado"
                        [color]="prestamo.estado === 'activo' ? 'green' : 'red'"
                        variante="sutil"/>
                    </div>
                  </div>
                </app-tarjeta>

                <app-tarjeta titulo="Registrar devolución" class="w-full">
                  <app-pila-vertical espacio="5" class="w-full">
                    <div class="flex flex-col gap-1 w-full">
                      <label for="fecha-devolucion" class="text-sm font-medium text-gray-700">
                        Fecha de devolución
                      </label>
                      <input
                        id="fecha-devolucion"
                        type="date"
                        [ngModel]="fechaDevolucion"
                        (ngModelChange)="onFechaDevolucionCambio($event)"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                               focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500
                               transition-colors duration-150"/>
                    </div>

                    @if (tarifaDiaria === null) {
                      <div class="bg-stone-100 border border-stone-200 rounded-lg p-4 w-full">
                        <span class="inline-block w-48 h-5 bg-stone-200 rounded animate-pulse"></span>
                      </div>
                    } @else if (diasRetraso > 0) {
                      <div class="bg-red-50 border border-red-200 rounded-lg p-4 w-full">
                        <div class="flex flex-col gap-2">
                          <span class="text-sm font-medium text-red-700">
                            ⚠ Devolución con retraso ({{ diasRetraso }} días)
                          </span>
                          <div class="flex justify-between text-sm text-red-600">
                            <span>{{ diasRetraso }} días × S/ {{ tarifaDiaria.toFixed(2) }}/día</span>
                            <span class="font-bold">Multa: S/ {{ multaGenerada.toFixed(2) }}</span>
                          </div>
                          <span class="text-xs text-red-500">Se generará una multa automáticamente.</span>
                        </div>
                      </div>
                    } @else {
                      <div class="bg-green-50 border border-green-200 rounded-lg p-4 w-full">
                        <span class="text-sm font-medium text-green-700">
                          El préstamo esta en el tiempo hábil para no generar una multa
                        </span>
                      </div>
                    }

                    <app-pila-horizontal espacio="4" class="w-full">
                      <app-boton
                        etiqueta="Confirmar Devolución"
                        tamanio="md"
                        (presionado)="confirmarDevolucion()"/>
                      <app-boton-contorno
                        etiqueta="Cancelar"
                        tamanio="md"
                        (presionado)="volver()"/>
                    </app-pila-horizontal>
                  </app-pila-vertical>
                </app-tarjeta>
              }
            </app-pila-vertical>
          }
        </div>
      </main>
    </div>
  `,
})
export class DevolverLibroComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly prestamoService = inject(PrestamoService);
  private readonly configuracionMultaService = inject(ConfiguracionMultaService);
  private readonly cdr = inject(ChangeDetectorRef);

  prestamo: any = null;
  ejemplar: any = null;
  usuario: any = null;
  libro: any = null;

  fechaDevolucion: string = '';
  tarifaDiaria: number | null = null;
  exito: boolean = false;
  error: string = '';
  cargando: boolean = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarDatos(id);
    }
  }

  private cargarDatos(idPrestamo: string): void {
    this.cargando = true;
    this.prestamoService.obtener(idPrestamo).subscribe({
      next: (res: any) => {
        const p = res?.data ?? res;

        this.prestamo = p;
        this.usuario = p.usuario ?? null;
        this.ejemplar = p.ejemplar ?? null;

        const lib = p.ejemplar?.libro;
        this.libro = lib ? {
          titulo: lib.titulo,
          foto: lib.fotoUrl ?? null,
          autores: Array.isArray(lib.autores)
            ? lib.autores.map((a: any) => `${a.autor?.nombre ?? ''} ${a.autor?.apellidos ?? ''}`.trim())
            : [],
        } : null;

        this.fechaDevolucion = new Date().toISOString().split('T')[0];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar préstamo:', err.message);
        this.error = 'No se pudo cargar el préstamo.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });

    this.configuracionMultaService.listar().subscribe({
      next: (res: any) => {
        const config: any = res?.data ?? res;
        if (config && config.tarifaDiaria != null) {
          this.tarifaDiaria = Number(config.tarifaDiaria);
        }
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar configuración de multa:', err.message);
      },
    });
  }

  get diasRetraso(): number {
    if (!this.prestamo || !this.fechaDevolucion) return 0;
    const max = new Date(this.prestamo.fechaMaxDevolucion);
    const dev = new Date(this.fechaDevolucion);
    const diff = Math.ceil((dev.getTime() - max.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  }

  get multaGenerada(): number {
    return this.diasRetraso * (this.tarifaDiaria ?? 0);
  }

  get mensajeExito(): string {
    if (this.diasRetraso > 0 && this.tarifaDiaria !== null) {
      return `Devolución registrada. Se generó una multa de S/ ${this.multaGenerada.toFixed(2)}.`;
    }
    return 'Devolución registrada correctamente. Sin multa.';
  }

  onFechaDevolucionCambio(valor: string): void {
    this.fechaDevolucion = valor;
  }

  confirmarDevolucion(): void {
    if (!this.prestamo) return;

    const data: any = {
      estado: 'devuelto',
      fechaDevolucion: new Date(this.fechaDevolucion).toISOString(),
    };

    this.prestamoService.actualizar(this.prestamo.id, data).subscribe({
      next: (res: any) => {
        const actualizado = res?.data ?? res;
        this.prestamo = { ...this.prestamo, ...actualizado };
        this.exito = true;
        this.error = '';
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al registrar devolución:', err.message);
        this.error = err?.error?.mensaje ?? 'Error al registrar la devolución.';
        this.cdr.detectChanges();
      },
    });
  }

  volver(): void {
    this.router.navigate(['/admin/prestamos']);
  }
}
