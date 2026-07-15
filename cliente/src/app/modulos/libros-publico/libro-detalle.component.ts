import {Component, inject, OnInit, ChangeDetectorRef} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink, ActivatedRoute} from '@angular/router';
import {HeaderComponent} from '../../_shared/componentes/navegacion/header.component';
import {FooterComponent} from '../../_shared/componentes/navegacion/footer.component';
import {TarjetaComponent} from '../../_shared/componentes/datos/tarjeta.component';
import {BotonComponent} from '../../_shared/componentes/botones/boton.component';
import {TextoNormalComponent} from '../../_shared/componentes/texto/texto-normal.component';
import {TextoPequenoComponent} from '../../_shared/componentes/texto/texto-pequeno.component';
import {NavigationService} from "../../_services/navigation-store";
import {PilaHorizontalComponent} from "../../_shared/componentes/diseno/pila-horizontal.component";
import {BotonContornoComponent} from "../../_shared/componentes/botones/boton-contorno.component";
import {LibroService} from "../../_services/libro.service";
import {ResenaService} from "../../_services/resena.service";
import {FavoritoService} from "../../_services/favorito.service";
import {FavoritoStoreService} from "../../_services/favorito-store";
import {StorageService} from "../../_services/storage.service";
import {InformacionLibroService} from "../../_services/informacion-store";

interface Comentario {
  id: string;
  autor: string;
  texto: string;
  fecha: Date;
}

@Component({
  selector: 'app-libro-detalle',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, TarjetaComponent, BotonComponent,
    TextoNormalComponent, TextoPequenoComponent, FormsModule, DatePipe, PilaHorizontalComponent, BotonContornoComponent, RouterLink],
  template: `
    <div class="min-h-screen flex flex-col bg-amber-50/30">
      <app-header></app-header>

      <main class="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
        <button
          type="button"
          (click)="volver()"
          class="text-sm text-stone-500 hover:text-stone-700 mb-6 inline-flex items-center gap-1">
          ← Volver al catálogo
        </button>

        @if (libro) {
          <div class="flex flex-col gap-6">
            <app-tarjeta>
              <div class="flex flex-col sm:flex-row gap-6">

                <div
                  class="aspect-[9/16] w-full sm:w-48 flex-shrink-0 self-start rounded-lg bg-gray-200 overflow-hidden flex items-center justify-center text-gray-400">
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
                    <h1 class="text-2xl font-semibold text-stone-800">{{ libro.titulo }}</h1>
                    <texto-pequeno>{{ libro.autores.join(', ') }}</texto-pequeno>
                  </div>

                  <texto-normal>{{ libro.descripcion }}</texto-normal>

                  <texto-pequeno>
                    {{ libro.editorial }} · {{ libro.anioPublicacion }} · {{ libro.idioma }} · ISBN {{ libro.isbn }}
                  </texto-pequeno>

                  <div class="flex flex-wrap gap-1.5">
                    @for (categoria of libro.categorias; track categoria) {
                      <span class="px-2 py-0.5 text-xs rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                      {{ categoria }}
                    </span>
                    }
                  </div>

                  @if (libro.archivosDigitales.length > 0) {
                    <div class="flex flex-wrap gap-1.5">
                      @for (archivo of libro.archivosDigitales; track archivo) {
                        <span
                          class="px-2 py-0.5 text-xs rounded-full bg-stone-100 text-stone-600 border border-stone-200 uppercase">
                        {{ archivo }}
                      </span>
                      }
                    </div>
                  }

                  @if (libro.ejemplaresDisponibles > 0) {
                    <span class="text-sm font-medium text-green-700">
                    {{ libro.ejemplaresDisponibles }} de {{ libro.ejemplaresTotal }} disponibles
                  </span>
                  } @else {
                    <span class="text-sm font-medium text-red-600">Sin ejemplares disponibles</span>
                  }

                  <app-pila-horizontal>
                    @if (!esFavorito) {
                      <app-boton
                        etiqueta="Favorito"
                        tamanio="md"
                        [anchoCompleto]="false"
                        [cargando]="cargandoFavorito"
                        (presionado)="toggleFavorito()"/>
                    } @else {
                      <app-boton-contorno
                        etiqueta="Favorito ★"
                        tamanio="md"
                        [anchoCompleto]="false"
                        [cargando]="cargandoFavorito"
                        (presionado)="toggleFavorito()"/>
                    }
                    <a [routerLink]="['/realizar-reserva', libro.id]">
                      <app-boton-contorno
                        etiqueta="Reservar"
                        tamanio="md"
                        [anchoCompleto]="false"
                        [deshabilitado]="libro.ejemplaresDisponibles === 0"/>
                    </a>
                    <a [routerLink]="['/realizar-prestamo', libro.id]">
                      <app-boton
                        etiqueta="Hacer Prestamo"
                        tamanio="md"
                        [anchoCompleto]="false"
                        [deshabilitado]="libro.ejemplaresDisponibles === 0"/>
                    </a>
                    <app-boton-contorno
                      etiqueta="Grafo de referencias"
                      tamanio="md"
                      [anchoCompleto]="false"
                      [cargando]="cargandoGrafo"
                      (presionado)="solicitarGrafoReferencias()"/>
                  </app-pila-horizontal>
                </div>
              </div>
            </app-tarjeta>
            @if (isLoggedIn && libro.recursosDigitales.length > 0) {
              <app-tarjeta titulo="Recursos digitales">
                <div class="flex flex-col gap-3">
                  @for (recurso of libro.recursosDigitales; track recurso.id) {
                    <div class="flex items-center justify-between bg-stone-50 rounded-lg px-4 py-3">
                      <div class="flex items-center gap-3">
                        <span class="text-xs uppercase font-mono bg-stone-200 px-2 py-1 rounded">{{ recurso.formato }}</span>
                        <div class="flex flex-col">
                          <span class="text-sm font-medium text-stone-700">{{ recurso.tipo }}</span>
                          <span class="text-xs text-stone-400 truncate max-w-[300px]">{{ recurso.url }}</span>
                        </div>
                      </div>
                      <a [href]="recurso.url" target="_blank" rel="noopener noreferrer"
                         class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg
                                bg-amber-500 text-white hover:bg-amber-600 transition-colors
                                no-underline">
                        Obtener
                      </a>
                    </div>
                  }
                </div>
              </app-tarjeta>
            }
            <app-tarjeta>
              <div class="flex flex-col gap-4">
                <h2 class="text-lg font-semibold text-stone-800">
                  Comentarios ({{ comentariosDelLibro.length }})
                </h2>

                @if (isLoggedIn) {
                  <div class="flex flex-col gap-2">
                    <textarea
                      [(ngModel)]="nuevoComentario"
                      rows="3"
                      placeholder="Escribe tu comentario sobre este libro..."
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none
                             focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500
                             transition-colors duration-150"></textarea>
                    <div class="flex justify-end">
                      <app-boton
                        etiqueta="Publicar comentario"
                        tamanio="sm"
                        [anchoCompleto]="false"
                        [deshabilitado]="!nuevoComentario.trim()"
                        (presionado)="agregarComentario()"/>
                    </div>
                  </div>
                } @else {
                  <div class="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-center">
                    <a [routerLink]="['/login']" class="text-amber-700 hover:text-amber-800 font-medium no-underline">
                      Inicia sesión
                    </a>
                    <span class="text-stone-500 text-sm"> para dejar un comentario</span>
                  </div>
                }

                <div class="flex flex-col gap-4 mt-2">
                  @for (comentario of comentariosDelLibro; track comentario.id) {
                    <div class="border-t border-stone-100 pt-3">
                      <div class="flex items-center justify-between">
                        <p class="text-sm font-medium text-stone-800">{{ comentario.autor }}</p>
                        <texto-pequeno>{{ comentario.fecha | date: 'dd/MM/yyyy' }}</texto-pequeno>
                      </div>
                      <texto-normal>{{ comentario.texto }}</texto-normal>
                    </div>
                  } @empty {
                    <texto-pequeno>Aún no hay comentarios. ¡Sé el primero en comentar!</texto-pequeno>
                  }
                </div>
              </div>
            </app-tarjeta>
          </div>
        } @else {
          <div class="text-center py-16">
            <texto-normal>No se encontró el libro seleccionado.</texto-normal>
          </div>
        }
      </main>

      <app-footer/>
    </div>
  `,
})
export class LibroDetalleComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly navigationService = inject(NavigationService);
  private readonly libroService = inject(LibroService);
  private readonly resenaService = inject(ResenaService);
  private readonly favoritoService = inject(FavoritoService);
  private readonly favoritoStoreService = inject(FavoritoStoreService);
  private readonly storageService = inject(StorageService);
  private readonly informacionLibroService = inject(InformacionLibroService);
  private readonly cdr = inject(ChangeDetectorRef);

  errorImagen = false;
  cargando: boolean = false;
  libro: any = null;
  comentariosDelLibro: Comentario[] = [];
  nuevoComentario: string = '';
  esFavorito: boolean = false;
  favoritoId: string | null = null;
  cargandoFavorito: boolean = false;
  cargandoGrafo: boolean = false;

  get isLoggedIn(): boolean {
    return this.storageService.isLoggedIn();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
      ?? this.navigationService.store.getState().libroSeleccionadoId;
    if (id) {
      this.navigationService.store.getState().seleccionarLibro(id);
      this.cargarLibro(id);
      this.cargarResenas(id);
    }
  }

  cargarLibro(id: string): void {
    this.cargando = true;
    this.libroService.obtener(id).subscribe({
      next: (data: any) => {
        const libro = data?.data ?? data;
        this.libro = this.mapearLibro(libro);
        this.cargarEstadoFavorito(id);
        this.cdr.detectChanges();
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error al cargar libro:', err.message);
        this.cargando = false;
      },
    });
  }

  cargarEstadoFavorito(libroId: string): void {
    this.favoritoService.misFavoritos().subscribe({
      next: (data: any) => {
        const favoritos = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        this.favoritoStoreService.store.getState().setFavoritosIds(favoritos.map((f: any) => f.libroId));
        const encontrado = favoritos.find((f: any) => f.libroId === libroId);
        if (encontrado) {
          this.esFavorito = true;
          this.favoritoId = encontrado.id;
        } else {
          this.esFavorito = false;
          this.favoritoId = null;
        }
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar favoritos:', err.message);
      },
    });
  }

  toggleFavorito(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.cargandoFavorito || !this.libro) return;
    this.cargandoFavorito = true;

    if (this.esFavorito && this.favoritoId) {
      this.favoritoService.eliminar(this.favoritoId).subscribe({
        next: () => {
          this.favoritoStoreService.store.getState().eliminarFavoritoId(this.libro.id);
          this.esFavorito = false;
          this.favoritoId = null;
          this.cargandoFavorito = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error al eliminar favorito:', err.message);
          this.cargandoFavorito = false;
        },
      });
    } else {
      this.favoritoService.agregar({ usuarioId: this.storageService.getId(), libroId: this.libro.id }).subscribe({
        next: (res: any) => {
          const creado = res?.data ?? res;
          this.favoritoStoreService.store.getState().agregarFavoritoId(this.libro.id);
          this.esFavorito = true;
          this.favoritoId = creado?.id ?? null;
          this.cargandoFavorito = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error al agregar favorito:', err.message);
          this.cargandoFavorito = false;
        },
      });
    }
  }

  cargarResenas(libroId: string): void {
    this.resenaService.porLibro(libroId).subscribe({
      next: (data: any) => {
        const listado = Array.isArray(data) ? data : (data?.data ?? data?.resenas ?? []);
        this.comentariosDelLibro = listado.map((r: any) => ({
          id: r.id,
          autor: r.usuario?.nombre ?? 'Anónimo',
          texto: r.comentario ?? '',
          fecha: new Date(r.creadoEn),
        }));
      },
      error: (err: any) => {
        console.error('Error al cargar reseñas:', err.message);
      },
    });
  }

  solicitarGrafoReferencias(): void {
    if (this.cargandoGrafo || !this.libro) return;
    this.cargandoGrafo = true;

    this.libroService.solicitarInformacionLibro(this.libro.id).subscribe({
      next: (data: any) => {
        const nodes = data?.nodes ?? [];
        const edges = data?.edges ?? [];

        this.informacionLibroService.store.getState().setLibroId(this.libro.id);
        this.informacionLibroService.store.getState().setNodos(nodes);
        this.informacionLibroService.store.getState().setEdges(edges);

        this.cargandoGrafo = false;
        this.cdr.detectChanges();
        this.router.navigate(['/informacion-libro']);
      },
      error: (err: any) => {
        console.error('Error al solicitar grafo de referencias:', err.message);
        this.cargandoGrafo = false;
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
      ejemplaresDisponibles: ejemplares.filter(e => e.estado === 'disponible').length,
      autores: Array.isArray(l.autores)
        ? l.autores.map((a: any) => a.autor ? `${a.autor.nombre ?? ''} ${a.autor.apellidos ?? ''}`.trim() : String(a))
        : [],
      categorias: Array.isArray(l.categorias)
        ? l.categorias.map((c: any) => c.categoria?.nombre ?? String(c))
        : [],
      editorial: l.editorial?.nombre ?? l.editorial ?? '',
      archivosDigitales: recursos.map(r => r.formato ?? r.tipo ?? 'pdf').filter(Boolean),
      recursosDigitales: recursos,
    };
  }

  agregarComentario(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    const texto = this.nuevoComentario.trim();
    if (!texto || !this.libro) return;

    this.resenaService.crear({
      libroId: this.libro.id,
      puntuacion: 5,
      comentario: texto,
    }).subscribe({
      next: (res: any) => {
        const creada = res?.data ?? res;
        const nuevo: Comentario = {
          id: creada.id ?? crypto.randomUUID(),
          autor: this.storageService.getNombre() || 'Tú',
          texto: creada.comentario ?? texto,
          fecha: new Date(creada.creadoEn),
        };
        this.comentariosDelLibro = [nuevo, ...this.comentariosDelLibro];
        this.nuevoComentario = '';
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al publicar comentario:', err.message);
      },
    });
  }

  volver(): void {
    this.router.navigate(['/catalogo']);
  }
}
