import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../_shared/componentes/navegacion/header.component';
import { FooterComponent } from '../../_shared/componentes/navegacion/footer.component';
import { TarjetaComponent } from '../../_shared/componentes/datos/tarjeta.component';
import { BotonComponent } from '../../_shared/componentes/botones/boton.component';
import { TextoNormalComponent } from '../../_shared/componentes/texto/texto-normal.component';
import { TextoPequenoComponent } from '../../_shared/componentes/texto/texto-pequeno.component';
import { NavigationService } from "../../_services/navigation-store";
import { MapaService } from "../../_services/mapa-store";
import { LibroService } from "../../_services/libro.service";
import { FavoritoService } from "../../_services/favorito.service";
import { FavoritoStoreService } from "../../_services/favorito-store";


@Component({
  selector: 'app-catalogo-listado',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, TarjetaComponent, BotonComponent,
    TextoNormalComponent, TextoPequenoComponent, FormsModule],
  template: `
    <div class="min-h-screen flex flex-col bg-amber-50/30">
      <app-header></app-header>

      <main class="flex-1 max-w-6xl mx-auto w-full px-4 py-10">

        <div class="flex flex-col gap-4 mb-8">

          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <texto-normal>Explora los libros disponibles en la biblioteca.</texto-normal>

            <div class="flex items-start gap-2 w-full sm:w-auto">
              <textarea
                rows="1"
                placeholder="Describe lo que necesitas... "
                [(ngModel)]="terminoBusqueda"
                (keydown)="onTerminoKeydown($event)"
                class="w-full sm:w-72 resize-y min-h-[42px] max-h-40 px-3 py-2 text-sm border border-stone-300 rounded-lg bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition-colors"></textarea>

              <button type="button"
                      (click)="ejecutarBusqueda()"
                      [disabled]="cargando"
                      title="Buscar"
                      class="flex items-center justify-center w-10 h-10 shrink-0 rounded-lg bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>

              <button type="button"
                      (click)="irAlMapa()"
                      [disabled]="cargandoGrafo"
                      title="Mapa"
                      class="flex items-center justify-center w-10 h-10 shrink-0 rounded-lg bg-stone-200 text-stone-600 hover:bg-stone-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12,3 22,21 2,21"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Fila de filtros -->
          <div class="flex flex-wrap items-center gap-3">

            <select
              [(ngModel)]="filtroFavoritos"
              (change)="irAPagina(1)"
              class="px-3 py-2 text-sm border border-stone-300 rounded-lg bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition-colors">
              <option value="todos">Todos</option>
              <option value="favoritos">Favoritos</option>
              <option value="no-favoritos">No favoritos</option>
            </select>

            <select
              [(ngModel)]="filtroCategoria"
              (change)="irAPagina(1)"
              class="px-3 py-2 text-sm border border-stone-300 rounded-lg bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition-colors">
              <option value="todas">Todas las categorías</option>
              @for (categoria of categoriasDisponibles; track categoria) {
                <option [value]="categoria">{{ categoria }}</option>
              }
            </select>

            <label class="flex items-center gap-2 text-sm text-stone-700 px-3 py-2 border border-stone-300 rounded-lg bg-white cursor-pointer select-none">
              <input type="checkbox"
                     [(ngModel)]="soloDisponibles"
                     (change)="irAPagina(1)"
                     class="accent-amber-600" />
              Solo con ejemplares disponibles
            </label>

            <!-- Toggle de vista -->
            <div class="ml-auto flex items-center gap-1 border border-stone-300 rounded-lg p-1 bg-white">
              <button type="button"
                      (click)="vista = 'cuadricula'"
                      title="Vista de cuadrícula"
                      class="flex items-center justify-center w-8 h-8 rounded-md transition-colors"
                      [class.bg-amber-600]="vista === 'cuadricula'"
                      [class.text-white]="vista === 'cuadricula'"
                      [class.text-stone-500]="vista !== 'cuadricula'">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/>
                  <rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
              </button>
              <button type="button"
                      (click)="vista = 'tabla'"
                      title="Vista de listado"
                      class="flex items-center justify-center w-8 h-8 rounded-md transition-colors"
                      [class.bg-amber-600]="vista === 'tabla'"
                      [class.text-white]="vista === 'tabla'"
                      [class.text-stone-500]="vista !== 'tabla'">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Vista de cuadrícula -->
        @if (vista === 'cuadricula') {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (libro of librosPaginados; track libro.id) {
              <app-tarjeta>
                <div class="flex flex-col gap-3 h-full">

                  <div
                    class="aspect-[9/16] w-full max-w-[140px] mx-auto rounded-lg bg-gray-200 overflow-hidden flex items-center justify-center text-gray-400 shrink-0">
                    @if (libro.foto && !erroresImagen.has(libro.id)) {
                      <img
                        [alt]="libro.titulo"
                        [src]="libro.foto"
                        (error)="onImagenError(libro.id)"
                        class="w-full h-full object-cover"/>
                    } @else {
                      <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                      </svg>
                    }
                  </div>

                  <div class="min-h-0">
                    <p class="font-semibold text-stone-800 leading-snug line-clamp-2">{{ libro.titulo }}</p>
                    <texto-pequeno class="line-clamp-1">{{ libro.autores.join(', ') }}</texto-pequeno>
                  </div>

                  <texto-pequeno class="line-clamp-1">{{ $any(libro.editorial)?.nombre || libro.editorial }} · {{ libro.anioPublicacion }} · {{ libro.idioma }}</texto-pequeno>

                  <div class="flex flex-wrap gap-1.5 min-h-[1.75rem]">
                    @for (categoria of libro.categorias; track categoria) {
                      <span class="px-2 py-0.5 text-xs rounded-full bg-amber-50 text-amber-700 border border-amber-100 line-clamp-1">
              {{ categoria }}
            </span>
                    }
                  </div>

                  @if (libro.archivosDigitales.length > 0) {
                    <div class="flex flex-col gap-1 min-h-[2.5rem]">
                      <span class="text-[11px] font-medium text-stone-500">Recursos digitales</span>
                      <div class="flex flex-wrap gap-1.5">
                        @for (archivo of libro.archivosDigitales; track archivo) {
                          <span
                            class="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-stone-100 text-stone-600 border border-stone-200 uppercase line-clamp-1">
                            <svg class="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                            </svg>
                            {{ archivo }}
                          </span>
                        }
                      </div>
                    </div>
                  } @else {
                    <div class="min-h-[2.5rem]"></div>
                  }

                  <div class="min-h-[1.25rem]">
                    @if (libro.ejemplaresDisponibles > 0) {
                      <span class="text-xs font-medium text-green-700">
                        {{ libro.ejemplaresDisponibles }} de {{ libro.ejemplaresTotal }} disponibles
                      </span>
                    } @else {
                      <span class="text-xs font-medium text-red-600">Sin ejemplares disponibles</span>
                    }
                  </div>

                  <div class="mt-auto pt-1">
                    <app-boton etiqueta="Ver detalle" tamanio="sm" [anchoCompleto]="true"
                               (presionado)="onVerDetalle(libro)"/>
                  </div>
                </div>
              </app-tarjeta>
            }
          </div>
        }

        <!-- Vista de listado tipo tabla/Excel -->
        @if (vista === 'tabla') {
          <div class="overflow-x-auto border border-stone-200 rounded-lg bg-white">
            <table class="w-full text-sm text-left border-collapse">
              <thead class="bg-stone-100 text-stone-600 uppercase text-xs">
              <tr>
                <th class="px-3 py-2 border-b border-stone-200">Título</th>
                <th class="px-3 py-2 border-b border-stone-200">Autores</th>
                <th class="px-3 py-2 border-b border-stone-200">Editorial</th>
                <th class="px-3 py-2 border-b border-stone-200">Año</th>
                <th class="px-3 py-2 border-b border-stone-200">Idioma</th>
                <th class="px-3 py-2 border-b border-stone-200">Categorías</th>
                <th class="px-3 py-2 border-b border-stone-200">Recursos digitales</th>
                <th class="px-3 py-2 border-b border-stone-200">Disponibilidad</th>
                <th class="px-3 py-2 border-b border-stone-200"></th>
              </tr>
              </thead>
              <tbody>
                @for (libro of librosPaginados; track libro.id) {
                  <tr class="hover:bg-amber-50/50 transition-colors">
                    <td class="px-3 py-2 border-b border-stone-100 font-medium text-stone-800 max-w-[220px] truncate">{{ libro.titulo }}</td>
                    <td class="px-3 py-2 border-b border-stone-100 text-stone-600 max-w-[180px] truncate">{{ libro.autores.join(', ') }}</td>
                    <td class="px-3 py-2 border-b border-stone-100 text-stone-600">{{ $any(libro.editorial)?.nombre || libro.editorial }}</td>
                    <td class="px-3 py-2 border-b border-stone-100 text-stone-600">{{ libro.anioPublicacion }}</td>
                    <td class="px-3 py-2 border-b border-stone-100 text-stone-600">{{ libro.idioma }}</td>
                    <td class="px-3 py-2 border-b border-stone-100 text-stone-600 max-w-[200px] truncate">{{ libro.categorias.join(', ') }}</td>
                    <td class="px-3 py-2 border-b border-stone-100">
                      @if (libro.archivosDigitales.length > 0) {
                        <div class="flex flex-wrap gap-1">
                          @for (archivo of libro.archivosDigitales; track archivo) {
                            <span class="px-1.5 py-0.5 text-[10px] rounded-full bg-stone-100 text-stone-600 border border-stone-200 uppercase">
                              {{ archivo }}
                            </span>
                          }
                        </div>
                      } @else {
                        <span class="text-xs text-stone-400">—</span>
                      }
                    </td>
                    <td class="px-3 py-2 border-b border-stone-100">
                      @if (libro.ejemplaresDisponibles > 0) {
                        <span class="text-xs font-medium text-green-700">{{ libro.ejemplaresDisponibles }} / {{ libro.ejemplaresTotal }}</span>
                      } @else {
                        <span class="text-xs font-medium text-red-600">Sin stock</span>
                      }
                    </td>
                    <td class="px-3 py-2 border-b border-stone-100 text-right">
                      <button type="button"
                              (click)="onVerDetalle(libro)"
                              class="px-3 py-1 text-xs rounded-md bg-amber-600 text-white hover:bg-amber-700 transition-colors">
                        Ver
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

        @if (librosFiltrados.length === 0) {
          <div class="text-center py-12">
            <texto-pequeno>No se encontraron libros que coincidan con tu búsqueda.</texto-pequeno>
          </div>
        }

        @if (totalPaginas > 1) {
          <div class="flex items-center justify-center gap-2 mt-10">
            <button
              type="button"
              [disabled]="paginaActual === 1"
              (click)="irAPagina(paginaActual - 1)"
              class="px-3 py-1.5 text-sm rounded-md border border-stone-300 text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-100 transition-colors">
              Anterior
            </button>

            @for (pagina of paginasVisibles; track pagina) {
              <button
                type="button"
                (click)="irAPagina(pagina)"
                class="w-8 h-8 text-sm rounded-md transition-colors"
                [class.bg-amber-600]="pagina === paginaActual"
                [class.text-white]="pagina === paginaActual"
                [class.text-stone-600]="pagina !== paginaActual"
                [class.hover:bg-stone-100]="pagina !== paginaActual">
                {{ pagina }}
              </button>
            }

            <button
              type="button"
              [disabled]="paginaActual === totalPaginas"
              (click)="irAPagina(paginaActual + 1)"
              class="px-3 py-1.5 text-sm rounded-md border border-stone-300 text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-100 transition-colors">
              Siguiente
            </button>
          </div>
        }
      </main>

      <app-footer/>
    </div>
  `,
})
export class CatalogoListadoComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly navigationService = inject(NavigationService);
  private readonly libroService = inject(LibroService);
  private readonly mapaService = inject(MapaService);
  private readonly favoritoService = inject(FavoritoService);
  private readonly favoritoStoreService = inject(FavoritoStoreService);
  private readonly cdr = inject(ChangeDetectorRef);

  cargando: boolean = false;
  cargandoGrafo: boolean = false;
  erroresImagen = new Set<string>();
  filtroFavoritos: 'todos' | 'favoritos' | 'no-favoritos' = 'todos';
  filtroCategoria: string = 'todas';
  soloDisponibles: boolean = false;
  vista: 'cuadricula' | 'tabla' = 'cuadricula';
  terminoBusqueda: string = '';
  paginaActual: number = 1;
  tamanioPagina: number = 6;
  libros: any[] = [];

  ngOnInit(): void {
    this.cargarLibros();
    this.cargarFavoritos();
  }

  cargarFavoritos(): void {
    this.favoritoService.misFavoritos().subscribe({
      next: (data: any) => {
        const favoritos = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        this.favoritoStoreService.store.getState().setFavoritosIds(favoritos.map((f: any) => f.libroId));
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar favoritos:', err.message);
      },
    });
  }

  cargarLibros(): void {
    this.cargando = true;
    this.libroService.listar().subscribe({
      next: (data: any) => {
        const listado = Array.isArray(data) ? data : (data?.data ?? data?.libros ?? []);
        this.libros = listado.map((l: any) => this.mapearLibro(l));
        this.cdr.detectChanges();
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error al cargar libros:', err.message);
        this.cargando = false;
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
      ejemplaresDisponibles: ejemplares.filter(e => e.estado === 'disponible').length,
      autores: Array.isArray(l.autores)
        ? l.autores.map((a: any) => a.autor ? `${a.autor.nombre ?? ''} ${a.autor.apellidos ?? ''}`.trim() : String(a))
        : [],
      categorias: Array.isArray(l.categorias)
        ? l.categorias.map((c: any) => c.categoria?.nombre ?? String(c))
        : [],
      editorial: l.editorial?.nombre ?? l.editorial ?? '',
      archivosDigitales: recursos.map(r => r.formato ?? r.tipo ?? 'pdf').filter(Boolean),
    };
  }

  onVerDetalle(libro: any): void {
    this.navigationService.store.getState().seleccionarLibro(libro.id);
    this.router.navigate(['/catalogo', libro.id]);
  }

  onImagenError(id: string) {
    this.erroresImagen.add(id);
  }

  onTerminoKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.ejecutarBusqueda();
    }
  }

  ejecutarBusqueda(): void {
    const termino = this.terminoBusqueda.trim();
    if (!termino) {
      this.cargarLibros();
      return;
    }
    this.cargando = true;
    this.libroService.buscar(termino).subscribe({
      next: (data: any) => {
        const listado = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        this.libros = listado.map((l: any) => this.mapearLibro(l));
        this.paginaActual = 1;
        this.cdr.detectChanges();
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error al buscar libros:', err.message);
        this.cargando = false;
      },
    });
  }

  irAlMapa(): void {
    const termino = this.terminoBusqueda.trim() || '';
    this.cargandoGrafo = true;
    this.libroService.solicitarGrafo(termino).subscribe({
      next: (res: any) => {
        const { nodes, edges, ordenLectura } = res;
        this.mapaService.store.getState().setTermino(termino);
        this.mapaService.store.getState().setNodos(nodes ?? []);
        this.mapaService.store.getState().setEdges(edges ?? []);
        this.mapaService.store.getState().setOrdenLectura(ordenLectura ?? []);
        this.cargandoGrafo = false;
        this.router.navigate(['/mapa']);
      },
      error: (err: any) => {
        console.error('Error al solicitar grafo:', err.message);
        this.cargandoGrafo = false;
      },
    });
  }

  get categoriasDisponibles(): string[] {
    const set = new Set<string>();
    this.libros.forEach(l => (l.categorias ?? []).forEach((c: string) => set.add(c)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }

  get librosFiltrados() {
    const favoritosIds = this.favoritoStoreService.store.getState().favoritosIds;
    return this.libros.filter(l => {
      if (this.filtroFavoritos === 'favoritos' && !favoritosIds.includes(l.id)) return false;
      if (this.filtroFavoritos === 'no-favoritos' && favoritosIds.includes(l.id)) return false;
      if (this.filtroCategoria !== 'todas' && !(l.categorias ?? []).includes(this.filtroCategoria)) return false;
      if (this.soloDisponibles && l.ejemplaresDisponibles <= 0) return false;
      return true;
    });
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.librosFiltrados.length / this.tamanioPagina));
  }

  get librosPaginados() {
    const inicio = (this.paginaActual - 1) * this.tamanioPagina;
    return this.librosFiltrados.slice(inicio, inicio + this.tamanioPagina);
  }

  get paginasVisibles(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  irAPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) {
      return;
    }
    this.paginaActual = pagina;
  }
}
