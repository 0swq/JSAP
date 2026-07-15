import {Component, inject, OnInit, ChangeDetectorRef} from '@angular/core';
import {Router, RouterModule, ActivatedRoute} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {LibroService} from '../../_services/libro.service';
import {EditorialService} from '../../_services/editorial.service';
import {EjemplarService} from '../../_services/ejemplar.service';
import {HeaderComponent} from '../../_shared/componentes/navegacion/header.component';
import {FooterComponent} from '../../_shared/componentes/navegacion/footer.component';
import {PilaVerticalComponent} from '../../_shared/componentes/diseno/pila-vertical.component';
import {PilaHorizontalComponent} from '../../_shared/componentes/diseno/pila-horizontal.component';
import {BotonComponent} from '../../_shared/componentes/botones/boton.component';
import {BotonContornoComponent} from '../../_shared/componentes/botones/boton-contorno.component';
import {TextoNormalComponent} from '../../_shared/componentes/texto/texto-normal.component';
import {TextoPequenoComponent} from '../../_shared/componentes/texto/texto-pequeno.component';
import {TextTituloComponent} from '../../_shared/componentes/texto/text-titulo.component';
import {TarjetaComponent} from '../../_shared/componentes/datos/tarjeta.component';
import {EntradaComponent} from '../../_shared/componentes/entradas/entrada.component';
import {SelectorComponent} from '../../_shared/componentes/entradas/selector.component';
import {InsigniaComponent} from '../../_shared/componentes/datos/insignia.component';
import {AlertaComponent} from '../../_shared/componentes/retroalimentacion/alerta.component';
import {NavigationService} from '../../_services/navigation-store';
import {SidebarComponent} from '../../_shared/componentes/navegacion/sidebar.component';

@Component({
  selector: 'app-agregar-ejemplar',
  standalone: true,
  imports: [
    BotonComponent, BotonContornoComponent,
    TextoNormalComponent, TextoPequenoComponent, TextTituloComponent,
    TarjetaComponent, InsigniaComponent,
    EntradaComponent,
    AlertaComponent, FormsModule, CommonModule, RouterModule, SidebarComponent,
  ],
  template: `
    <div class="flex min-h-screen bg-stone-50">
      <app-sidebar></app-sidebar>

      <main class="flex-1 flex flex-col min-w-0">
        <div class="px-6 py-6 max-w-7xl w-full mx-auto">
          <button
            type="button"
            (click)="cancelar()"
            class="text-sm text-stone-500 hover:text-stone-700 mb-6 inline-flex items-center gap-1">
            ← Volver a libros
          </button>

          <div class="flex flex-col gap-6">

            <texto-titulo>Agregar Ejemplar</texto-titulo>
            <texto-normal>Registra una nueva copia física del libro en el inventario.</texto-normal>

            @if (exito) {
              <app-alerta tipo="exito" [mensaje]="'Ejemplar «' + ultimoCodigoBarras + '» creado correctamente.'"/>
            }

            @if (error) {
              <app-alerta tipo="error" [mensaje]="error"/>
            }

            @if (cargando) {
              <div class="flex justify-center py-12">
                <svg class="animate-spin w-8 h-8 text-amber-600" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              </div>
            }

            @if (!cargando && !libro) {
              <div class="text-center py-12">
                <texto-normal>No se encontró el libro especificado.</texto-normal>
                <app-boton
                  class="mt-4"
                  etiqueta="Ir a libros"
                  tamanio="sm"
                  (presionado)="cancelar()"/>
              </div>
            }

            @if (!cargando && libro) {
              <!-- Contexto del libro -->
              <app-tarjeta titulo="Libro">
                <div class="flex flex-col gap-3">
                  <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                    @if (libro.fotoUrl) {
                      <div class="w-16 h-24 flex-shrink-0 rounded overflow-hidden bg-gray-200">
                        <img [src]="libro.fotoUrl" alt="Portada" class="w-full h-full object-cover"/>
                      </div>
                    }
                    <div class="flex flex-col gap-1">
                      <span class="text-lg font-semibold text-stone-800">{{ libro.titulo }}</span>
                      <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-500">
                        @if (libro.isbn) {
                          <span class="font-mono text-xs">{{ libro.isbn }}</span>
                        }
                        @if (editorialNombre) {
                          <span>{{ editorialNombre }}</span>
                        }
                        @if (libro.anioPublicacion) {
                          <span>{{ libro.anioPublicacion }}</span>
                        }
                        @if (libro.idioma) {
                          <span>{{ libro.idioma }}</span>
                        }
                      </div>
                      @if (nombresAutores) {
                        <texto-pequeno class="text-stone-600">{{ nombresAutores }}</texto-pequeno>
                      }
                    </div>
                  </div>

                  <!-- Contadores de ejemplares -->
                  <div class="flex flex-wrap gap-3 mt-1">
                    <app-insignia [etiqueta]="'Total: ' + ejemplares.length" color="stone" variante="sutil"/>
                    <app-insignia
                      [etiqueta]="'Disponibles: ' + ejemplaresDisponibles"
                      [color]="ejemplaresDisponibles > 0 ? 'green' : 'red'"
                      variante="sutil"/>
                    <app-insignia
                      [etiqueta]="'Prestados: ' + ejemplaresPrestados"
                      color="amber"
                      variante="sutil"/>
                  </div>
                </div>
              </app-tarjeta>

              <!-- Formulario de nuevo ejemplar -->
              <app-tarjeta titulo="Nuevo ejemplar">
                <div class="flex flex-col gap-6">

                  <app-entrada
                    etiqueta="Código de barras"
                    id="codigoBarras"
                    placeholder="Escribe el código de barras..."
                    [valor]="codigoBarras"
                    (valorCambio)="codigoBarras = $event"
                    [requerido]="true"
                    [error]="errores.codigoBarras"/>

                  <app-entrada
                    etiqueta="Ubicación"
                    id="ubicacion"
                    placeholder="Ej: Estante A-12, Sección Literatura..."
                    [valor]="ubicacion"
                    (valorCambio)="ubicacion = $event"/>

                  <div class="bg-stone-50 rounded-lg border border-stone-200 p-4">
                    <div class="flex flex-col gap-1">
                      <span class="text-sm font-medium text-stone-700">Resumen</span>
                      <div class="flex justify-between text-sm text-stone-600">
                        <span>Libro</span>
                        <span
                          class="font-medium text-stone-800 text-right max-w-[60%] truncate">{{ libro.titulo }}</span>
                      </div>
                      @if (codigoBarras) {
                        <div class="flex justify-between text-sm text-stone-600">
                          <span>Código de barras</span>
                          <span class="font-mono text-stone-800">{{ codigoBarras }}</span>
                        </div>
                      }
                      @if (estado) {
                        <div class="flex justify-between text-sm text-stone-600">
                          <span>Estado</span>
                          <span>{{ etiquetaEstado(estado) }}</span>
                        </div>
                      }
                      @if (ubicacion) {
                        <div class="flex justify-between text-sm text-stone-600">
                          <span>Ubicación</span>
                          <span>{{ ubicacion }}</span>
                        </div>
                      }
                    </div>
                  </div>

                  <div class="flex flex-col sm:flex-row gap-4">
                    <app-boton
                      etiqueta="Crear Ejemplar"
                      tamanio="md"
                      [anchoCompleto]="false"
                      [deshabilitado]="!formularioValido"
                      (presionado)="crearEjemplar()"/>
                    <app-boton-contorno
                      etiqueta="Cancelar"
                      tamanio="md"
                      [anchoCompleto]="false"
                      (presionado)="cancelar()"/>
                  </div>

                </div>
              </app-tarjeta>

              <!-- Lista de ejemplares existentes -->
              @if (ejemplares.length > 0) {
                <app-tarjeta [titulo]="'Ejemplares registrados (' + ejemplares.length + ')'">
                  <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                      <thead>
                      <tr class="border-b border-stone-200 bg-stone-50">
                        <th class="text-left px-4 py-2.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                          Código
                        </th>
                        <th class="text-left px-4 py-2.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th class="text-left px-4 py-2.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                          Ubicación
                        </th>
                        <th class="text-left px-4 py-2.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                          Adquisición
                        </th>
                      </tr>
                      </thead>
                      <tbody class="divide-y divide-stone-100">
                        @for (ej of ejemplares; track ej.id) {
                          <tr class="hover:bg-amber-50/30 transition-colors">
                            <td class="px-4 py-2.5">
                              <span class="font-mono text-xs text-stone-700">{{ ej.codigoBarras }}</span>
                            </td>
                            <td class="px-4 py-2.5">
                              <app-insignia
                                [etiqueta]="etiquetaEstado(ej.estado)"
                                [color]="colorEstado(ej.estado)"
                                variante="sutil"/>
                            </td>
                            <td class="px-4 py-2.5">
                              <texto-pequeno>{{ ej.ubicacion || '—' }}</texto-pequeno>
                            </td>
                            <td class="px-4 py-2.5">
                              <span
                                class="text-xs text-stone-400">{{ ej.fechaAdquisicion ? (ej.fechaAdquisicion | date:'shortDate') : '—' }}</span>
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </app-tarjeta>
              }
            }

          </div>
        </div>
      </main>

    </div>
  `,
})
export class AgregarEjemplarComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly navigationService = inject(NavigationService);
  private readonly libroService = inject(LibroService);
  private readonly editorialService = inject(EditorialService);
  private readonly ejemplarService = inject(EjemplarService);
  private readonly cdr = inject(ChangeDetectorRef);

  libroId: string = '';
  libro: any = null;
  editorialNombre: string = '';
  nombresAutores: string = '';

  codigoBarras: string = '';
  estado: string = 'disponible';
  ubicacion: string = '';

  ejemplares: any[] = [];

  cargando: boolean = true;
  exito: boolean = false;
  ultimoCodigoBarras: string = '';
  error: string = '';
  errores: { codigoBarras: string } = {codigoBarras: ''};

  get formularioValido(): boolean {
    return this.codigoBarras.trim().length > 0;
  }

  get ejemplaresDisponibles(): number {
    return this.ejemplares.filter(e => e.estado === 'disponible').length;
  }

  get ejemplaresPrestados(): number {
    return this.ejemplares.filter(e => e.estado === 'prestado').length;
  }

  etiquetaEstado(estado: string): string {
    const map: Record<string, string> = {
      disponible: 'Disponible',
      prestado: 'Prestado',
      perdido: 'Perdido',
      mantenimiento: 'Mantenimiento',
    };
    return map[estado] ?? estado;
  }

  colorEstado(estado: string): string {
    const map: Record<string, string> = {
      disponible: 'green',
      prestado: 'amber',
      perdido: 'red',
      mantenimiento: 'stone',
    };
    return map[estado] ?? 'stone';
  }

  ngOnInit(): void {
    this.libroId = this.route.snapshot.paramMap.get('id')
      ?? this.navigationService.store.getState().libroSeleccionadoId
      ?? '';

    if (!this.libroId) {
      this.cargando = false;
      this.cdr.detectChanges();
      return;
    }

    this.cargarLibro();
    this.cargarEjemplares();
  }

  cargarLibro(): void {
    this.libroService.obtener(this.libroId).subscribe({
      next: (res: any) => {
        const data = res?.data ?? res;
        this.libro = data;

        if (Array.isArray(data.autores)) {
          this.nombresAutores = data.autores
            .map((a: any) => a.autor
              ? `${a.autor.nombre ?? ''} ${a.autor.apellidos ?? ''}`.trim()
              : String(a))
            .join(', ');
        }

        const editorialId = data.editorialId ?? data.editorial?.id ?? '';
        if (editorialId) {
          this.cargarEditorial(editorialId);
        }

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.mensaje ?? err?.message ?? 'Error al cargar el libro.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  cargarEditorial(editorialId: string): void {
    this.editorialService.obtener(editorialId).subscribe({
      next: (res: any) => {
        const data = res?.data ?? res;
        this.editorialNombre = data.nombre ?? data.razonSocial ?? '';
        this.cdr.detectChanges();
      },
      error: () => {
        if (this.libro?.editorial?.nombre) {
          this.editorialNombre = this.libro.editorial.nombre;
        }
      },
    });
  }

  cargarEjemplares(): void {
    this.ejemplarService.porLibro(this.libroId).subscribe({
      next: (res: any) => {
        const data = Array.isArray(res) ? res : (res?.data ?? res?.ejemplares ?? []);
        this.ejemplares = data;
        this.cdr.detectChanges();
      },
      error: () => {
      },
    });
  }

  crearEjemplar(): void {
    this.errores.codigoBarras = '';
    this.error = '';

    if (!this.codigoBarras.trim()) {
      this.errores.codigoBarras = 'El código de barras es obligatorio.';
    }
    if (this.errores.codigoBarras) {
      return;
    }

    const data: {
      libroId: string;
      codigoBarras: string;
      estado?: 'disponible' | 'prestado' | 'perdido' | 'mantenimiento';
      ubicacion?: string;
    } = {
      libroId: this.libroId,
      codigoBarras: this.codigoBarras.trim(),
      estado: 'disponible',
    };
    if (this.ubicacion.trim()) {
      data.ubicacion = this.ubicacion.trim();
    }

    this.ejemplarService.crear(data).subscribe({
      next: () => {
        this.ultimoCodigoBarras = this.codigoBarras.trim();
        this.exito = true;
        this.error = '';
        this.codigoBarras = '';
        this.ubicacion = '';
        this.estado = 'disponible';
        this.cargarEjemplares();
        this.cdr.detectChanges();
        setTimeout(() => {
          this.exito = false;
          this.cdr.detectChanges();
        }, 4000);
      },
      error: (err) => {
        this.error = err?.error?.mensaje ?? err?.message ?? 'Error al crear el ejemplar.';
        this.cdr.detectChanges();
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/admin/libros']);
  }
}
