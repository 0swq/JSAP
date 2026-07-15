import {Component, inject, OnInit, ChangeDetectorRef} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {SidebarComponent} from '../../_shared/componentes/navegacion/sidebar.component';
import {PilaVerticalComponent} from '../../_shared/componentes/diseno/pila-vertical.component';
import {PilaHorizontalComponent} from '../../_shared/componentes/diseno/pila-horizontal.component';
import {BotonComponent} from '../../_shared/componentes/botones/boton.component';
import {BotonContornoComponent} from '../../_shared/componentes/botones/boton-contorno.component';
import {BotonIconoComponent} from '../../_shared/componentes/botones/boton-icono.component';
import {TextoNormalComponent} from '../../_shared/componentes/texto/texto-normal.component';
import {TextoPequenoComponent} from '../../_shared/componentes/texto/texto-pequeno.component';
import {TextTituloComponent} from '../../_shared/componentes/texto/text-titulo.component';
import {EntradaBusquedaComponent} from '../../_shared/componentes/entradas/entrada-busqueda.component';
import {SelectorComponent} from '../../_shared/componentes/entradas/selector.component';
import {InsigniaComponent} from '../../_shared/componentes/datos/insignia.component';
import {PaginacionComponent} from '../../_shared/componentes/navegacion/paginacion.component';
import {NavigationService} from '../../_services/navigation-store';
import {LibroService} from '../../_services/libro.service';

@Component({
  selector: 'app-admin-libros',
  standalone: true,
  imports: [
    SidebarComponent, PilaVerticalComponent, PilaHorizontalComponent,
    BotonComponent,  BotonIconoComponent,
TextoPequenoComponent, TextTituloComponent,
    EntradaBusquedaComponent, SelectorComponent, InsigniaComponent,
    PaginacionComponent, FormsModule, RouterModule,
  ],
  template: `
    <div class="flex min-h-screen bg-stone-50">
      <app-sidebar></app-sidebar>

      <main class="flex-1 flex flex-col min-w-0">
        <div class="px-6 py-6 max-w-7xl w-full mx-auto">

          <app-pila-horizontal espacio="4" alinear="centro" justificar="entre" class="mb-6">
            <app-pila-vertical espacio="1">
              <texto-titulo tamanio="xl">Libros</texto-titulo>
              <texto-pequeno>Administra el catálogo de libros de la biblioteca.</texto-pequeno>
            </app-pila-vertical>

            <app-boton
              etiqueta="Nuevo Libro"
              tamanio="sm"
              icono="✚"
              (presionado)="nuevoLibro()"/>
          </app-pila-horizontal>

          <div class="bg-white rounded-xl border border-stone-200 p-4 mb-6">
            <app-pila-horizontal espacio="4" alinear="fin" envolver="si">
              <app-entrada-busqueda
                class="flex-1 min-w-[240px]"
                placeholder="Buscar por título, autor o ISBN..."
                [valor]="terminoBusqueda"
                (valorCambio)="onBusquedaCambio($event)"/>

              <app-selector
                etiqueta="Categoría"
                id="filtro-categoria"
                [opciones]="opcionesCategorias"
                [valor]="filtroCategoria"
                (valorCambio)="onFiltroCategoriaCambio($event)"
                placeholder="Todas las categorías"/>

              <app-selector
                etiqueta="Disponibilidad"
                id="filtro-disponibilidad"
                [opciones]="opcionesDisponibilidad"
                [valor]="filtroDisponibilidad"
                (valorCambio)="onFiltroDisponibilidadCambio($event)"
                placeholder="Cualquier estado"/>
            </app-pila-horizontal>
          </div>
          <div class="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-stone-200 bg-stone-50">
                    <th class="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Título</th>
                    <th class="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">ISBN</th>
                    <th class="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Autores</th>
                    <th class="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Editorial</th>
                    <th class="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Año</th>
                    <th class="text-center px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Ejemplares</th>
                    <th class="text-center px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-stone-100">
                  @for (libro of librosPaginados; track libro.id) {
                    <tr class="hover:bg-amber-50/30 transition-colors">
                      <td class="px-5 py-3">
                        <div class="flex flex-col gap-1">
                          <a
                            [routerLink]="['/catalogo', libro.id]"
                            class="font-medium text-stone-800 hover:text-amber-700 transition-colors no-underline cursor-pointer"
                            (click)="seleccionarYVer(libro)">
                            {{ libro.titulo }}
                          </a>
                          <div class="flex flex-wrap gap-1">
                            @for (cat of libro.categorias; track cat) {
                              <app-insignia [etiqueta]="cat" color="amber" variante="sutil"/>
                            }
                          </div>
                        </div>
                      </td>

                      <td class="px-5 py-3">
                        <span class="text-xs font-mono text-stone-500">{{ libro.isbn }}</span>
                      </td>

                      <td class="px-5 py-3">
                        <texto-pequeno>{{ libro.autores.join(', ') }}</texto-pequeno>
                      </td>
                      <td class="px-5 py-3">
                        <texto-pequeno>{{ libro.editorial }}</texto-pequeno>
                      </td>
                      <td class="px-5 py-3">
                        <span class="text-xs text-stone-500">{{ libro.anioPublicacion }}</span>
                      </td>

                      <td class="px-5 py-3 text-center">
                        @if (libro.ejemplaresDisponibles > 0) {
                          <span class="text-xs font-medium text-green-700">
                            {{ libro.ejemplaresDisponibles }}/{{ libro.ejemplaresTotal }}
                          </span>
                        } @else {
                          <span class="text-xs font-medium text-red-600">
                            {{ libro.ejemplaresDisponibles }}/{{ libro.ejemplaresTotal }}
                          </span>
                        }
                      </td>
                      <td class="px-5 py-3">
                        <app-pila-horizontal espacio="1" justificar="centro">
                          <a
                            [routerLink]="['/catalogo', libro.id]"
                            (click)="seleccionarYVer(libro)"
                            class="no-underline">
                            <app-boton-icono
                              icono="👁"
                              tamanio="sm"
                              tooltip="Ver detalle"/>
                          </a>
                          <app-boton-icono
                            icono="+"
                            tamanio="sm"
                            tooltip="Agregar ejemplar"
                            (presionado)="agregarEjemplar(libro)"/>
                          <app-boton-icono
                            icono="✎"
                            tamanio="sm"
                            tooltip="Editar"
                            (presionado)="editarLibro(libro)"/>
                          <app-boton-icono
                            icono="✕"
                            tamanio="sm"
                            tooltip="Eliminar"
                            (presionado)="eliminarLibro(libro)"/>
                        </app-pila-horizontal>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="7" class="px-5 py-12 text-center">
                        <texto-pequeno>No se encontraron libros que coincidan con los filtros.</texto-pequeno>
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
                [total]="librosFiltrados.length"
                [tamanioPagina]="tamanioPagina"
                (cambioPagina)="irAPagina($event)"/>
            </div>
          }
        </div>
      </main>
    </div>
  `,
})
export class AdminLibrosComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly navigationService = inject(NavigationService);
  private readonly libroService = inject(LibroService);
  private readonly cdr = inject(ChangeDetectorRef);

  cargando: boolean = false;

  ngOnInit(): void {
    this.cargarLibros();
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
      error: (err) => {
        console.error('Error al cargar libros:', err.message);
        this.cargando = false;
      },
    });
  }

  private mapearLibro(l: any): any {
    const ejemplares: any[] = Array.isArray(l.ejemplares) ? l.ejemplares : [];
    return {
      ...l,
      ejemplaresTotal: ejemplares.length,
      ejemplaresDisponibles: ejemplares.filter(e => e.estado === 'disponible').length,
      autores: Array.isArray(l.autores)
        ? l.autores.map((a: any) => a.autor ? `${a.autor.nombre ?? ''} ${a.autor.apellidos ?? ''}`.trim() : String(a))
        : [],
      categorias: Array.isArray(l.categorias)
        ? l.categorias.map((c: any) => c.categoria?.nombre ?? String(c))
        : [],
      editorial: l.editorial?.nombre ?? l.editorial ?? '',
    };
  }

  terminoBusqueda: string = '';
  filtroCategoria: string = '';
  filtroDisponibilidad: string = '';

  opcionesDisponibilidad: Array<{ etiqueta: string; valor: string }> = [
    {etiqueta: 'Con ejemplares disponibles', valor: 'disponible'},
    {etiqueta: 'Sin ejemplares', valor: 'agotado'},
  ];

  get opcionesCategorias(): Array<{ etiqueta: string; valor: string }> {
    const cats = new Set<string>();
    this.libros.forEach((l: any) => l.categorias.forEach((c: any) => cats.add(c)));
    return Array.from(cats).sort().map(c => ({etiqueta: c, valor: c}));
  }

  onBusquedaCambio(valor: string): void {
    this.terminoBusqueda = valor;
    this.paginaActual = 1;
  }

  onFiltroCategoriaCambio(valor: string): void {
    this.filtroCategoria = valor;
    this.paginaActual = 1;
  }

  onFiltroDisponibilidadCambio(valor: string): void {
    this.filtroDisponibilidad = valor;
    this.paginaActual = 1;
  }

  paginaActual: number = 1;
  tamanioPagina: number = 10;

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.librosFiltrados.length / this.tamanioPagina));
  }

  get librosPaginados() {
    const inicio = (this.paginaActual - 1) * this.tamanioPagina;
    return this.librosFiltrados.slice(inicio, inicio + this.tamanioPagina);
  }

  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  get librosFiltrados() {
    let resultado = this.libros;
    const termino = this.terminoBusqueda.trim().toLowerCase();
    if (termino) {
      resultado = resultado.filter(l =>
        l.titulo.toLowerCase().includes(termino) ||
        l.autores.some((a: string) => a.toLowerCase().includes(termino)) ||
        l.isbn.toLowerCase().includes(termino),
      );
    }
    if (this.filtroCategoria) {
      resultado = resultado.filter(l =>
        l.categorias.includes(this.filtroCategoria),
      );
    }
    if (this.filtroDisponibilidad === 'disponible') {
      resultado = resultado.filter(l => l.ejemplaresDisponibles > 0);
    } else if (this.filtroDisponibilidad === 'agotado') {
      resultado = resultado.filter(l => l.ejemplaresDisponibles === 0);
    }
    return resultado;
  }

  seleccionarYVer(libro: any): void {
    this.navigationService.store.getState().seleccionarLibro(libro.id);
  }

  nuevoLibro(): void {
    this.navigationService.store.getState().seleccionarLibro(null);
    this.router.navigate(['/admin/libros/crear']);
  }

  editarLibro(libro: any): void {
    this.navigationService.store.getState().seleccionarLibro(libro.id);
    this.router.navigate(['/admin/libros/editar', libro.id]);
  }

  agregarEjemplar(libro: any): void {
    this.navigationService.store.getState().seleccionarLibro(libro.id);
    this.router.navigate(['/admin/libros', libro.id, 'agregar-ejemplar']);
  }

  eliminarLibro(libro: any): void {
    if (!confirm(`¿Eliminar "${libro.titulo}"? Esta acción no se puede deshacer.`)) return;
    this.libroService.eliminar(libro.id).subscribe({
      next: () => {
        this.libros = this.libros.filter(l => l.id !== libro.id);
        this.paginaActual = 1;
      },
      error: (err) => {
        console.error('Error al eliminar libro:', err);
      },
    });
  }
  libros: any[] = [];
}
