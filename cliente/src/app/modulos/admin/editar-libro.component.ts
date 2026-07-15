import {Component, inject, OnInit, ChangeDetectorRef} from '@angular/core';
import {Router, RouterModule, ActivatedRoute} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {LibroService} from '../../_services/libro.service';
import {EditorialService} from '../../_services/editorial.service';
import {AutorService} from '../../_services/autor.service';
import {CategoriaService} from '../../_services/categoria.service';
import {BotonComponent} from '../../_shared/componentes/botones/boton.component';
import {BotonContornoComponent} from '../../_shared/componentes/botones/boton-contorno.component';
import {TextoNormalComponent} from '../../_shared/componentes/texto/texto-normal.component';
import {TextTituloComponent} from '../../_shared/componentes/texto/text-titulo.component';
import {TarjetaComponent} from '../../_shared/componentes/datos/tarjeta.component';
import {EntradaComponent} from '../../_shared/componentes/entradas/entrada.component';
import {EntradaNumeroComponent} from '../../_shared/componentes/entradas/entrada-numero.component';
import {SelectorComponent} from '../../_shared/componentes/entradas/selector.component';
import {AlertaComponent} from '../../_shared/componentes/retroalimentacion/alerta.component';
import {NavigationService} from '../../_services/navigation-store';
import {SidebarComponent} from "../../_shared/componentes/navegacion/sidebar.component";

@Component({
  selector: 'app-editar-libro',
  standalone: true,
  imports: [
    BotonComponent, BotonContornoComponent,
    TextoNormalComponent, TextTituloComponent,
    TarjetaComponent,
    EntradaComponent, EntradaNumeroComponent, SelectorComponent,
    AlertaComponent, FormsModule, RouterModule, SidebarComponent,
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

            <texto-titulo>Editar Libro</texto-titulo>
            <texto-normal>Modifica la información de este libro.</texto-normal>

            @if (exito) {
              <app-alerta tipo="exito" mensaje="Libro actualizado correctamente."/>
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
            @if (!cargando && !libroOriginal && !exito) {
              <div class="text-center py-12">
                <texto-normal>No se encontró el libro a editar.</texto-normal>
                <app-boton
                  class="mt-4"
                  etiqueta="Ir a libros"
                  tamanio="sm"
                  (presionado)="cancelar()"/>
              </div>
            }

            @if (!cargando && libroOriginal && !exito) {
              <app-tarjeta titulo="Información del libro">
                <div class="flex flex-col gap-6">

                  @if (foto) {
                    <div class="flex flex-col sm:flex-row gap-4 items-start">
                      <div class="aspect-[9/16] w-32 flex-shrink-0 rounded-lg bg-gray-200 overflow-hidden
                                flex items-center justify-center text-gray-400">
                        @if (!errorImagen) {
                          <img
                            [src]="foto"
                            alt="Portada actual"
                            (error)="errorImagen = true"
                            class="w-full h-full object-cover"/>
                        } @else {
                          <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                          </svg>
                        }
                      </div>
                      <div class="flex flex-col gap-1 pt-1">
                        <span class="text-sm font-medium text-stone-700">{{ libroOriginal.titulo }}</span>
                        <span class="text-xs text-gray-400">Portada actual</span>
                      </div>
                    </div>
                  }

                  <app-entrada
                    etiqueta="Título"
                    id="titulo"
                    placeholder="Título del libro"
                    [valor]="titulo"
                    (valorCambio)="titulo = $event"
                    [requerido]="true"
                    [error]="errores.titulo"/>

                  <app-entrada
                    etiqueta="ISBN"
                    id="isbn"
                    placeholder="978-..."
                    [valor]="isbn"
                    (valorCambio)="isbn = $event"/>

                  <!-- Autores multi-select -->
                  <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-700">
                      Autores <span class="text-red-500">*</span>
                    </label>
                    <select
                      [ngModel]="autorSeleccionando"
                      (ngModelChange)="agregarAutor($event)"
                      class="w-full px-3 py-2 border rounded-lg text-sm bg-white transition-colors duration-150
                           focus:outline-none focus:ring-2 focus:ring-offset-0
                           focus:border-amber-500 focus:ring-amber-200 border-gray-300">
                      <option value="" disabled>Selecciona un autor...</option>
                      @for (a of autoresDisponibles; track a.valor) {
                        @if (!autoresSeleccionados.includes(a.valor)) {
                          <option [value]="a.valor">{{ a.etiqueta }}</option>
                        }
                      }
                    </select>
                    @if (errores.autores) {
                      <span class="text-xs text-red-500 ml-1">{{ errores.autores }}</span>
                    }
                    @if (autoresSeleccionados.length > 0) {
                      <div class="flex flex-wrap gap-1.5 mt-2">
                        @for (id of autoresSeleccionados; track $index) {
                          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs
                                     bg-amber-50 text-amber-700 border border-amber-200">
                          {{ nombreAutor(id) }}
                            <button type="button" (click)="quitarAutor(id)"
                                    class="hover:text-red-500 transition-colors">&times;</button>
                        </span>
                        }
                      </div>
                    }
                  </div>

                  <app-selector
                    etiqueta="Editorial"
                    id="editorial"
                    [opciones]="opcionesEditoriales"
                    [valor]="editorial"
                    (valorCambio)="editorial = $event"
                    [requerido]="true"
                    [error]="errores.editorial"
                    placeholder="Selecciona una editorial..."/>

                  <div class="flex flex-col sm:flex-row gap-4">
                    <div class="flex-1">
                      <app-entrada-numero
                        etiqueta="Año de publicación"
                        id="anio"
                        [min]="0"
                        [max]="2026"
                        [paso]="1"
                        [valor]="anioPublicacion"
                        (valorCambio)="anioPublicacion = $event"/>
                    </div>
                    <div class="flex-1">
                      <app-selector
                        etiqueta="Idioma"
                        id="idioma"
                        [opciones]="opcionesIdiomas"
                        [valor]="idioma"
                        (valorCambio)="idioma = $event"
                        placeholder="Selecciona..."/>
                    </div>
                  </div>

                  <div class="flex flex-col gap-1">
                    <label for="descripcion" class="text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                      id="descripcion"
                      [(ngModel)]="descripcion"
                      rows="4"
                      placeholder="Sinopsis o resumen del libro..."
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none
                           focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500
                           transition-colors duration-150"></textarea>
                  </div>

                  <!-- Categorías multi-select -->
                  <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-700">Categorías</label>
                    <select
                      [ngModel]="categoriaSeleccionando"
                      (ngModelChange)="agregarCategoria($event)"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white
                           focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500
                           transition-colors duration-150">
                      <option value="" disabled>Selecciona una categoría...</option>
                      @for (c of categoriasDisponibles; track c.valor) {
                        @if (!categoriasSeleccionadas.includes(c.valor)) {
                          <option [value]="c.valor">{{ c.etiqueta }}</option>
                        }
                      }
                    </select>
                    @if (categoriasSeleccionadas.length > 0) {
                      <div class="flex flex-wrap gap-1.5 mt-2">
                        @for (id of categoriasSeleccionadas; track $index) {
                          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs
                                     bg-stone-100 text-stone-700 border border-stone-200">
                          {{ nombreCategoria(id) }}
                            <button type="button" (click)="quitarCategoria(id)"
                                    class="hover:text-red-500 transition-colors">&times;</button>
                        </span>
                        }
                      </div>
                    }
                  </div>

                  <!-- Recursos digitales -->
                  <div class="flex flex-col gap-3 p-4 bg-white border border-stone-200 rounded-xl">
                    <span class="text-sm font-medium text-stone-700">Recursos digitales</span>
                    <div class="flex flex-col sm:flex-row gap-2 items-end">
                      <app-selector class="flex-1" etiqueta="Tipo" id="tipo-recurso"
                                    [opciones]="opcionesTipoRecurso" [valor]="nuevoRecurso.tipo"
                                    (valorCambio)="nuevoRecurso.tipo = $event" placeholder="Tipo..."/>
                      <app-entrada class="flex-1" etiqueta="URL" id="url-recurso"
                                   placeholder="https://..." [valor]="nuevoRecurso.url"
                                   (valorCambio)="nuevoRecurso.url = $event"/>
                      <app-selector class="flex-1" etiqueta="Formato" id="formato-recurso"
                                    [opciones]="opcionesFormatoRecurso" [valor]="nuevoRecurso.formato"
                                    (valorCambio)="nuevoRecurso.formato = $event" placeholder="Formato..."/>
                      <app-boton etiqueta="Agregar" tamanio="sm"
                                 [deshabilitado]="!nuevoRecurso.tipo || !nuevoRecurso.url"
                                 (presionado)="agregarRecurso()"/>
                    </div>
                    @if (recursosDigitales.length > 0) {
                      <div class="flex flex-col gap-1.5">
                        @for (rec of recursosDigitales; track $index) {
                          <div class="flex items-center justify-between bg-stone-50 rounded-lg px-3 py-2 text-sm">
                            <div class="flex items-center gap-2">
                              <span
                                class="text-xs uppercase font-mono bg-stone-200 px-1.5 py-0.5 rounded">{{ rec.formato }}</span>
                              <span class="text-xs text-stone-400">{{ rec.tipo }}</span>
                              <span class="text-stone-600 truncate max-w-[300px]">{{ rec.url }}</span>
                            </div>
                            <button type="button" (click)="quitarRecurso($index)"
                                    class="text-stone-400 hover:text-red-500 transition-colors">&times;
                            </button>
                          </div>
                        }
                      </div>
                    }
                  </div>

                  <app-entrada
                    etiqueta="Foto (URL)"
                    id="foto"
                    placeholder="https://covers.openlibrary.org/b/isbn/..."
                    [valor]="foto"
                    (valorCambio)="onFotoCambio($event)"/>

                  <div class="bg-stone-50 rounded-lg border border-stone-200 p-4">
                    <div class="flex flex-col gap-1">
                      <span class="text-sm font-medium text-stone-700">Resumen</span>
                      <div class="flex justify-between text-sm text-stone-600">
                        <span>Título</span>
                        <span
                          class="font-medium text-stone-800 text-right max-w-[60%] truncate">{{ titulo || '—' }}</span>
                      </div>
                      <div class="flex justify-between text-sm text-stone-600">
                        <span>Autores</span>
                        <span
                          class="text-right max-w-[60%] truncate">{{ nombresAutoresSeleccionados || '—' }}</span>
                      </div>
                      <div class="flex justify-between text-sm text-stone-600">
                        <span>Editorial</span>
                        <span>{{ editorial || '—' }}</span>
                      </div>
                      <div class="flex justify-between text-sm text-stone-600">
                        <span>Año</span>
                        <span>{{ anioPublicacion }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="flex flex-col sm:flex-row gap-4">
                    <app-boton
                      etiqueta="Guardar Cambios"
                      tamanio="md"
                      [anchoCompleto]="false"
                      [deshabilitado]="!formularioValido"
                      (presionado)="guardarCambios()"/>
                    <app-boton-contorno
                      etiqueta="Cancelar"
                      tamanio="md"
                      [anchoCompleto]="false"
                      (presionado)="cancelar()"/>
                  </div>

                </div>
              </app-tarjeta>
            }

          </div>
        </div>
      </main>

    </div>
  `,
})
export class EditarLibroComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly navigationService = inject(NavigationService);
  private readonly libroService = inject(LibroService);
  private readonly editorialService = inject(EditorialService);
  private readonly autorService = inject(AutorService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly cdr = inject(ChangeDetectorRef);

  cargando: boolean = true;
  libroOriginal: any = null;
  errorImagen: boolean = false;

  titulo: string = '';
  isbn: string = '';
  editorial: string = '';
  anioPublicacion: number = 2026;
  idioma: string = '';
  descripcion: string = '';
  foto: string = '';

  autoresDisponibles: Array<{ etiqueta: string; valor: string }> = [];
  autoresSeleccionados: string[] = [];
  autorSeleccionando: string = '';
  categoriasDisponibles: Array<{ etiqueta: string; valor: string }> = [];
  categoriasSeleccionadas: string[] = [];
  categoriaSeleccionando: string = '';

  nuevoRecurso: { tipo: string; url: string; formato: string } = {tipo: '', url: '', formato: ''};
  recursosDigitales: Array<{ tipo: string; url: string; formato: string }> = [];

  opcionesTipoRecurso = [
    {etiqueta: 'PDF', valor: 'pdf'}, {etiqueta: 'EPUB', valor: 'epub'},
    {etiqueta: 'Audiolibro', valor: 'audiolibro'}, {etiqueta: 'Video', valor: 'video'},
  ];
  opcionesFormatoRecurso = [
    {etiqueta: 'PDF', valor: 'pdf'}, {etiqueta: 'EPUB', valor: 'epub'},
    {etiqueta: 'MP3', valor: 'mp3'}, {etiqueta: 'MP4', valor: 'mp4'},
  ];

  errores: { titulo: string; autores: string; editorial: string } = {titulo: '', autores: '', editorial: ''};
  exito: boolean = false;
  error: string = '';

  opcionesIdiomas: Array<{ etiqueta: string; valor: string }> = [
    {etiqueta: 'Español', valor: 'Español'}, {etiqueta: 'Inglés', valor: 'Inglés'},
    {etiqueta: 'Francés', valor: 'Francés'}, {etiqueta: 'Alemán', valor: 'Alemán'},
    {etiqueta: 'Italiano', valor: 'Italiano'}, {etiqueta: 'Portugués', valor: 'Portugués'},
    {etiqueta: 'Ruso', valor: 'Ruso'}, {etiqueta: 'Chino', valor: 'Chino'},
    {etiqueta: 'Japonés', valor: 'Japonés'}, {etiqueta: 'Otro', valor: 'Otro'},
  ];

  opcionesEditoriales: Array<{ etiqueta: string; valor: string }> = [];

  agregarAutor(id: string): void {
    if (id && !this.autoresSeleccionados.includes(id)) this.autoresSeleccionados.push(id);
    this.autorSeleccionando = '';
    this.errores.autores = '';
  }

  quitarAutor(id: string): void {
    this.autoresSeleccionados = this.autoresSeleccionados.filter(a => a !== id);
  }

  nombreAutor(id: string): string {
    return this.autoresDisponibles.find(a => a.valor === id)?.etiqueta ?? id;
  }

  agregarCategoria(id: string): void {
    if (id && !this.categoriasSeleccionadas.includes(id)) this.categoriasSeleccionadas.push(id);
    this.categoriaSeleccionando = '';
  }

  quitarCategoria(id: string): void {
    this.categoriasSeleccionadas = this.categoriasSeleccionadas.filter(c => c !== id);
  }

  nombreCategoria(id: string): string {
    return this.categoriasDisponibles.find(c => c.valor === id)?.etiqueta ?? id;
  }

  agregarRecurso(): void {
    if (this.nuevoRecurso.tipo && this.nuevoRecurso.url) {
      this.recursosDigitales.push({...this.nuevoRecurso});
      this.nuevoRecurso = {tipo: '', url: '', formato: ''};
    }
  }

  quitarRecurso(idx: number): void {
    this.recursosDigitales.splice(idx, 1);
  }

  onFotoCambio(valor: string): void { this.foto = valor; this.errorImagen = false; }

  get nombresAutoresSeleccionados(): string { return this.autoresSeleccionados.map(id => this.nombreAutor(id)).join(', '); }

  get formularioValido(): boolean {
    return (
      this.titulo.trim().length > 0 &&
      this.autoresSeleccionados.length > 0 &&
      this.editorial.trim().length > 0 &&
      !this.exito
    );
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
      ?? this.navigationService.store.getState().libroSeleccionadoId;

    this.cargarEditoriales();
    this.cargarAutores();
    this.cargarCategorias();

    if (!id) {
      this.cargando = false;
      this.cdr.detectChanges();
      return;
    }
    this.cargarLibro(id);
  }

  normalizarLista(data: any): any[] {
    if (Array.isArray(data)) return data;
    return data?.data ?? data?.resultados ?? data?.items ?? [];
  }

  obtenerId(obj: any): string {
    return obj?._id ?? obj?.id ?? '';
  }

  cargarEditoriales(): void {
    this.editorialService.listar().subscribe({
      next: (data: any) => {
        const l = this.normalizarLista(data);
        this.opcionesEditoriales = l.map((e: any) => ({
          etiqueta: e.nombre ?? e.razonSocial ?? '',
          valor: this.obtenerId(e),
        }));
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  cargarAutores(): void {
    this.autorService.listar().subscribe({
      next: (data: any) => {
        const l = this.normalizarLista(data);
        this.autoresDisponibles = l.map((a: any) => ({
          etiqueta: `${a.nombre ?? ''} ${a.apellidos ?? ''}`.trim() || this.obtenerId(a),
          valor: this.obtenerId(a),
        }));
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  cargarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (data: any) => {
        const l = this.normalizarLista(data);
        this.categoriasDisponibles = l.map((c: any) => ({
          etiqueta: c.nombre ?? this.obtenerId(c),
          valor: this.obtenerId(c),
        }));
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  cargarLibro(id: string): void {
    this.cargando = true;
    this.libroService.obtener(id).subscribe({
      next: (res: any) => {
        const libro = res?.data ?? res;
        this.libroOriginal = libro;
        this.titulo = libro.titulo || '';
        this.isbn = libro.isbn || '';

        if (Array.isArray(libro.autorIds)) {
          this.autoresSeleccionados = libro.autorIds;
        } else if (Array.isArray(libro.autores)) {
          this.autoresSeleccionados = libro.autores.map((a: any) =>
            a.autor?.id ?? a.autorId ?? this.obtenerId(a)
          ).filter(Boolean);
        } else {
          this.autoresSeleccionados = [];
        }

        this.editorial = (typeof libro.editorialId === 'string' ? libro.editorialId : '')
          || (libro.editorial?.id ?? '');

        this.anioPublicacion = libro.anioPublicacion ?? 2026;
        this.idioma = libro.idioma || '';
        this.descripcion = libro.descripcion || '';
        if (Array.isArray(libro.categoriaIds)) {
          this.categoriasSeleccionadas = libro.categoriaIds;
        } else if (Array.isArray(libro.categorias)) {
          this.categoriasSeleccionadas = libro.categorias.map((c: any) =>
            c.categoria?.id ?? c.categoriaId ?? c.id ?? ''
          ).filter(Boolean);
        } else {
          this.categoriasSeleccionadas = [];
        }

        this.foto = libro.fotoUrl || libro.foto || '';
        this.recursosDigitales = Array.isArray(libro.recursosDigitales)
          ? libro.recursosDigitales.map((r: any) => ({
              tipo: r.tipo ?? '',
              url: r.url ?? '',
              formato: r.formato ?? '',
            }))
          : [];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar libro:', err.message);
        this.error = err?.error?.mensaje ?? err?.message ?? 'Error al cargar el libro.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  guardarCambios(): void {
    this.errores.titulo = '';
    this.errores.autores = '';
    this.errores.editorial = '';

    if (!this.titulo.trim()) this.errores.titulo = 'El título es obligatorio.';
    if (this.autoresSeleccionados.length === 0) this.errores.autores = 'Selecciona al menos un autor.';
    if (!this.editorial.trim()) this.errores.editorial = 'La editorial es obligatoria.';
    if (this.errores.titulo || this.errores.autores || this.errores.editorial) return;
    if (!this.libroOriginal) return;

    const data: any = {
      titulo: this.titulo.trim(),
      isbn: this.isbn.trim(),
      editorialId: this.editorial,
      anioPublicacion: this.anioPublicacion,
      idioma: this.idioma,
      descripcion: this.descripcion.trim(),
      fotoUrl: this.foto.trim() || undefined,
      autorIds: this.autoresSeleccionados,
      categoriaIds: this.categoriasSeleccionadas,
    };
    if (this.recursosDigitales.length > 0) data.recursosDigitales = this.recursosDigitales;

    this.libroService.actualizar(this.libroOriginal.id, data).subscribe({
      next: () => {
        this.exito = true;
        this.error = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.mensaje ?? err?.message ?? 'Error al actualizar el libro.';
        this.cdr.detectChanges();
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/admin/libros']);
  }
}
