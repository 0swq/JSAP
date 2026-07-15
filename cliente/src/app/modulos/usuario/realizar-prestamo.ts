import {Component, inject, OnInit, ChangeDetectorRef} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {forkJoin} from 'rxjs';
import {HeaderComponent} from '../../_shared/componentes/navegacion/header.component';
import {FooterComponent} from '../../_shared/componentes/navegacion/footer.component';
import {TarjetaComponent} from '../../_shared/componentes/datos/tarjeta.component';
import {BotonComponent} from '../../_shared/componentes/botones/boton.component';
import {BotonContornoComponent} from '../../_shared/componentes/botones/boton-contorno.component';
import {TextoNormalComponent} from '../../_shared/componentes/texto/texto-normal.component';
import {TextoPequenoComponent} from '../../_shared/componentes/texto/texto-pequeno.component';
import {TextTituloComponent} from '../../_shared/componentes/texto/text-titulo.component';
import {AlertaComponent} from '../../_shared/componentes/retroalimentacion/alerta.component';
import {SelectorComponent} from '../../_shared/componentes/entradas/selector.component';
import {EstadoVacioComponent} from '../../_shared/componentes/retroalimentacion/estado-vacio.component';
import {NavigationService} from '../../_services/navigation-store';
import {LibroService} from '../../_services/libro.service';
import {PrestamoService} from '../../_services/prestamo.service';
import {ReservaService} from '../../_services/reserva.service';
import {StorageService} from '../../_services/storage.service';
import {Ejemplar} from '../../model';

@Component({
  selector: 'app-realizar-prestamo',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, TarjetaComponent, BotonComponent,
    BotonContornoComponent, TextoNormalComponent, TextoPequenoComponent, TextTituloComponent,
    AlertaComponent, SelectorComponent,
    EstadoVacioComponent, FormsModule, DatePipe],
  template: `
    <div class="min-h-screen flex flex-col bg-amber-50/30">
      <app-header></app-header>

      <main class="flex-1 max-w-2xl mx-auto w-full px-4 py-10">
        <button
          type="button"
          (click)="volver()"
          class="text-sm text-stone-500 hover:text-stone-700 mb-6 inline-flex items-center gap-1">
          ← Volver al libro
        </button>

        @if (error) {
          <app-alerta tipo="error" [mensaje]="error"/>
        }

        @if (cargando) {
          <div class="text-center py-16">
            <texto-normal>Cargando libro...</texto-normal>
          </div>
        } @else if (libro) {
          <div class="flex flex-col gap-6">

            <texto-titulo>Realizar Préstamo</texto-titulo>
            <texto-normal>Selecciona un ejemplar disponible para realizar el préstamo.</texto-normal>

            <app-tarjeta titulo="Libro seleccionado">
              <div class="flex flex-col sm:flex-row gap-6">

                <div
                  class="aspect-[9/16] w-full sm:w-48 flex-shrink-0 rounded-lg bg-gray-200 overflow-hidden flex items-center justify-center text-gray-400">
                  @if (libro.foto && !errorImagen) {
                    <img
                      [alt]="libro.titulo"
                      [src]="libro.foto"
                      (error)="errorImagen = true"
                      class="w-full h-full object-cover"/>
                  } @else {
                    <svg class="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                    </svg>
                  }
                </div>

                <div class="flex flex-col gap-3 flex-1">
                  <div>
                    <p class="font-semibold text-stone-800 text-lg">{{ libro.titulo }}</p>
                    <texto-pequeno>{{ libro.autores.join(', ') }}</texto-pequeno>
                  </div>

                  <texto-pequeno>{{ libro.editorial }} · {{ libro.anioPublicacion }}</texto-pequeno>

                  @if (ejemplaresDisponibles.length > 0) {
                    <span class="text-sm font-medium text-green-700">
                      {{ ejemplaresDisponibles.length }} ejemplar(es) disponible(s)
                    </span>
                  } @else {
                    <span class="text-sm font-medium text-red-600">Sin ejemplares disponibles</span>
                  }
                </div>
              </div>
            </app-tarjeta>

            @if (exito) {
              <app-alerta tipo="exito" mensaje="Préstamo registrado correctamente. Puedes verlo en Mis Préstamos."/>
            }

            @if (!exito) {
              <app-tarjeta titulo="Datos del préstamo">
                <div class="flex flex-col gap-6">

                  @if (ejemplaresDisponibles.length > 0) {
                    <app-selector
                      etiqueta="Ejemplar"
                      id="ejemplar"
                      [opciones]="opcionesEjemplares"
                      [valor]="ejemplarSeleccionadoId"
                      (valorCambio)="onEjemplarCambio($event)"
                      placeholder="Selecciona un ejemplar..."
                    />

                    <!-- Aviso de límite según rol -->
                    <div class="flex items-start gap-2 p-3 rounded-lg bg-amber-100 border border-amber-300 text-sm text-amber-800">
                      <svg class="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="16" x2="12" y2="12"/>
                        <line x1="12" y1="8" x2="12.01" y2="8"/>
                      </svg>
                      <span>
                        Como <strong>{{ rolUsuario || 'usuario' }}</strong>, puedes solicitar préstamos de hasta <strong>{{ diasPrestamo }} días</strong>.
                      </span>
                    </div>

                    <div class="flex flex-col gap-1">
                      <label for="fecha-devolucion" class="text-sm font-medium text-gray-700">
                        Fecha de devolución <span class="text-red-500">*</span>
                      </label>
                      <input
                        id="fecha-devolucion"
                        type="date"
                        [ngModel]="fechaDevolucion"
                        (ngModelChange)="onFechaCambio($event)"
                        [min]="fechaMinima"
                        [max]="fechaMaxima"
                        class="w-full px-3 py-2 border rounded-lg text-sm transition-colors duration-150
                               focus:outline-none focus:ring-2 focus:ring-offset-0
                               focus:border-amber-500 focus:ring-amber-200 border-gray-300"
                      />
                      <span class="text-xs text-gray-400 ml-1">
                        El préstamo debe devolverse en esta fecha. {{ textoLimiteDias }}.
                      </span>
                    </div>

                    @if (ejemplarSeleccionado) {
                      <div class="bg-stone-50 rounded-lg border border-stone-200 p-4">
                        <div class="flex flex-col gap-1">
                          <span class="text-sm font-medium text-stone-700">Resumen</span>
                          <div class="flex justify-between text-sm text-stone-600">
                            <span>Código de barras</span>
                            <span class="font-mono">{{ ejemplarSeleccionado.codigoBarras }}</span>
                          </div>
                          <div class="flex justify-between text-sm text-stone-600">
                            <span>Ubicación</span>
                            <span>{{ ejemplarSeleccionado.ubicacion ?? '—' }}</span>
                          </div>
                          @if (fechaDevolucion) {
                            <div class="flex justify-between text-sm text-stone-600">
                              <span>Préstamo hasta</span>
                              <span>{{ fechaDevolucion | date: 'dd/MM/yyyy' }}</span>
                            </div>
                          }
                        </div>
                      </div>
                    }

                    <div class="flex flex-col sm:flex-row gap-4">
                      <app-boton
                        etiqueta="Confirmar Préstamo"
                        tamanio="md"
                        [anchoCompleto]="false"
                        [deshabilitado]="!formularioValido"
                        [cargando]="confirmando"
                        (presionado)="confirmarPrestamo()"/>
                      <app-boton-contorno
                        etiqueta="Cancelar"
                        tamanio="md"
                        [anchoCompleto]="false"
                        (presionado)="volver()"/>
                    </div>
                  } @else {
                    <app-estado-vacio
                      titulo="Sin ejemplares disponibles"
                      descripcion="Todos los ejemplares de este libro están prestados o en mantenimiento."/>
                    <app-boton
                      etiqueta="Volver al catálogo"
                      tamanio="sm"
                      (presionado)="volver()"/>
                  }
                </div>
              </app-tarjeta>
            }

          </div>
        } @else {
          <div class="text-center py-16">
            <texto-normal>No se encontró el libro para realizar el préstamo.</texto-normal>
            <app-boton
              class="mt-4"
              etiqueta="Ir al catálogo"
              tamanio="sm"
              (presionado)="volver()"/>
          </div>
        }
      </main>

      <app-footer/>
    </div>
  `,
})
export class RealizarPrestamoComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly navigationService = inject(NavigationService);
  private readonly libroService = inject(LibroService);
  private readonly prestamoService = inject(PrestamoService);
  private readonly reservaService = inject(ReservaService);
  private readonly storageService = inject(StorageService);
  private readonly cdr = inject(ChangeDetectorRef);

  errorImagen = false;
  exito = false;
  error: string = '';
  fechaDevolucion: string = '';
  ejemplarSeleccionadoId: string = '';
  cargando: boolean = false;
  confirmando: boolean = false;
  libro: any = null;
  rolUsuario: string = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
      ?? this.navigationService.store.getState().libroSeleccionadoId;

    console.log('[RealizarPrestamo] ID obtenido:', id);

    this.rolUsuario = this.storageService.getRol()?.toLowerCase() ?? '';

    if (id) {
      this.navigationService.store.getState().seleccionarLibro(id);
      this.cargarLibro(id);
    }
  }

  cargarLibro(id: string): void {
    console.log('[RealizarPrestamo] Cargando libro:', id);
    this.cargando = true;
    this.libroService.obtener(id).subscribe({
      next: (data: any) => {
        console.log('[RealizarPrestamo] Libro recibido:', data);
        const libro = data?.data ?? data;
        this.libro = this.mapearLibro(libro);
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('[RealizarPrestamo] Error al cargar libro:', err);
        this.error = 'No se pudo cargar la información del libro.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  private mapearLibro(l: any): any {
    const ejemplares: any[] = Array.isArray(l.ejemplares) ? l.ejemplares : [];
    const recursos: any[] = Array.isArray(l.recursosDigitales) ? l.recursosDigitales : [];
    return {
      ...l,
      foto: l.fotoUrl ?? l.foto ?? null,
      ejemplaresTotal: ejemplares.length,
      ejemplaresDisponibles: ejemplares.filter((e: any) => e.estado === 'disponible').length,
      autores: Array.isArray(l.autores)
        ? l.autores.map((a: any) => a.autor ? `${a.autor.nombre ?? ''} ${a.autor.apellidos ?? ''}`.trim() : String(a))
        : [],
      categorias: Array.isArray(l.categorias)
        ? l.categorias.map((c: any) => c.categoria?.nombre ?? String(c))
        : [],
      editorial: l.editorial?.nombre ?? l.editorial ?? '',
      archivosDigitales: recursos.map((r: any) => r.formato ?? r.tipo ?? 'pdf').filter(Boolean),
      _ejemplares: ejemplares,
    };
  }

  get ejemplaresDisponibles(): Ejemplar[] {
    if (!this.libro?._ejemplares) return [];
    return this.libro._ejemplares.filter((e: any) => e.estado === 'disponible');
  }

  get diasPrestamo(): number {
    return this.rolUsuario === 'estudiante' ? 7 : 14;
  }

  get fechaMaxDevolucion(): Date {
    const fecha = new Date(this.fechaDevolucion);
    if (!this.fechaDevolucion) {
      fecha.setDate(fecha.getDate() + this.diasPrestamo);
    }
    return fecha;
  }

  get fechaMinima(): string {
    const maniana = new Date();
    maniana.setDate(maniana.getDate() + 1);
    return maniana.toISOString().split('T')[0];
  }
  get fechaMaxima(): string {
    const hoy = new Date();
    const diasMaximos = this.rolUsuario === 'estudiante' ? 7 : 14;
    hoy.setDate(hoy.getDate() + diasMaximos);
    return hoy.toISOString().split('T')[0];
  }

  get textoLimiteDias(): string {
    const dias = this.rolUsuario === 'estudiante' ? 7 : 14;
    return `máximo ${dias} días (${this.rolUsuario || 'usuario'})`;
  }

  get formularioValido(): boolean {
    return !!this.fechaDevolucion && !!this.ejemplarSeleccionadoId && !this.exito && !this.confirmando;
  }

  get opcionesEjemplares(): Array<{ etiqueta: string; valor: string }> {
    return this.ejemplaresDisponibles.map(e => ({
      etiqueta: `${e.codigoBarras} — ${e.ubicacion ?? 'Sin ubicación'}`,
      valor: e.id,
    }));
  }

  get ejemplarSeleccionado(): Ejemplar | undefined {
    return this.ejemplaresDisponibles.find(e => e.id === this.ejemplarSeleccionadoId);
  }

  onEjemplarCambio(valor: string): void {
    this.ejemplarSeleccionadoId = valor;
  }

  onFechaCambio(valor: string): void {
    this.fechaDevolucion = valor;
    if (valor) {
      const fechaSel = new Date(valor);
      const fechaMax = new Date(this.fechaMaxima);
      if (fechaSel > fechaMax) {
        const dias = this.rolUsuario === 'estudiante' ? 7 : 14;
        this.error = `Como ${this.rolUsuario}, solo puedes solicitar préstamos hasta ${dias} días. Selecciona una fecha anterior.`;
      } else {
        this.error = '';
      }
    }
  }

  confirmarPrestamo(): void {
    if (!this.libro || !this.ejemplarSeleccionado) {
      this.error = 'Debes seleccionar un ejemplar disponible.';
      return;
    }

    if (!this.fechaDevolucion) {
      this.error = 'La fecha de devolución es obligatoria.';
      return;
    }

    const fechaSel = new Date(this.fechaDevolucion);
    const fechaMax = new Date(this.fechaMaxima);
    if (fechaSel > fechaMax) {
      const dias = this.rolUsuario === 'estudiante' ? 7 : 14;
      this.error = `Como ${this.rolUsuario}, solo puedes solicitar préstamos hasta ${dias} días.`;
      return;
    }

    const ejemplarId = this.ejemplarSeleccionado.id;

    this.confirmando = true;
    this.error = '';

    const limite = this.rolUsuario === 'estudiante' ? 3 : 7;
    forkJoin({
      prestamosActivos: this.prestamoService.contarActivos(),
      reservasActivas: this.reservaService.contarActivas(),
    }).subscribe({
      next: ({ prestamosActivos, reservasActivas }) => {
        const total = prestamosActivos + reservasActivas;
        if (total >= limite) {
          this.error = `Has alcanzado el límite de ${limite} préstamos y reservas activas (tienes ${total}). No puedes solicitar más préstamos.`;
          this.confirmando = false;
          this.cdr.detectChanges();
          return;
        }

        this.prestamoService.crear({
          usuarioId: this.storageService.getId(),
          ejemplarId: ejemplarId,
          fechaMaxDevolucion: new Date(this.fechaDevolucion).toISOString(),
        }).subscribe({
          next: (res: any) => {
            const creado = res?.data ?? res;
            this.navigationService.store.getState().seleccionarPrestamo(creado.id);
            this.libro._ejemplares = this.libro._ejemplares.map((e: any) =>
              e.id === ejemplarId ? { ...e, estado: 'prestado' } : e
            );
            this.libro.ejemplaresDisponibles = this.libro._ejemplares.filter((e: any) => e.estado === 'disponible').length;
            console.log('[RealizarPrestamo] Ejemplares disponibles actualizados:', this.libro.ejemplaresDisponibles);

            this.exito = true;
            this.confirmando = false;
            this.cdr.detectChanges();
          },
          error: (err: any) => {
            console.error('Error al crear préstamo:', err.message);
            this.error = err?.error?.mensaje ?? 'Error al registrar el préstamo. Intenta de nuevo.';
            this.confirmando = false;
            this.cdr.detectChanges();
          },
        });
      },
      error: (err: any) => {
        console.error('Error al verificar límites:', err);
        this.error = 'No se pudo verificar el límite de préstamos. Intenta de nuevo.';
        this.confirmando = false;
        this.cdr.detectChanges();
      },
    });
  }

  volver(): void {
    const id = this.navigationService.store.getState().libroSeleccionadoId;
    this.router.navigate(['/catalogo', id]);
  }
}
