import {Component, inject, OnInit, ChangeDetectorRef} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {LibroService} from '../../_services/libro.service';
import {EditorialService} from '../../_services/editorial.service';
import {AutorService} from '../../_services/autor.service';
import {CategoriaService} from '../../_services/categoria.service';
import {HeaderComponent} from '../../_shared/componentes/navegacion/header.component';
import {FooterComponent} from '../../_shared/componentes/navegacion/footer.component';
import {PilaVerticalComponent} from '../../_shared/componentes/diseno/pila-vertical.component';
import {PilaHorizontalComponent} from '../../_shared/componentes/diseno/pila-horizontal.component';
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
  selector: 'app-crear-libro',
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

            <texto-titulo>Crear Libro</texto-titulo>
            <texto-normal>Registra un nuevo libro en el catálogo.</texto-normal>

            @if (exito) {
              <app-alerta tipo="exito" mensaje="Libro creado correctamente."/>
            }

            @if (error) {
              <app-alerta tipo="error" [mensaje]="error"/>
            }

            @if (!exito) {
              <app-tarjeta titulo="Información del libro">
                <div class="flex flex-col gap-6">

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

                  <app-entrada
                    etiqueta="Foto (URL)"
                    id="foto"
                    placeholder="https://covers.openlibrary.org/b/isbn/..."
                    [valor]="foto"
                    (valorCambio)="foto = $event"/>


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
                        [deshabilitado]="!nuevoRecurso.tipo || !nuevoRecurso.formato || !nuevoRecurso.url"
                        (presionado)="agregarRecurso()"/>
                    </div>
                    @if (recursosDigitales.length > 0) {
                      <div class="flex flex-col gap-1.5">
                        @for (rec of recursosDigitales; track $index) {
                          <div class="flex items-center justify-between bg-stone-50 rounded-lg px-3 py-2 text-sm">
                            <div class="flex items-center gap-2">
                              <span class="text-xs uppercase font-mono bg-stone-200 px-1.5 py-0.5 rounded">{{ rec.formato }}</span>
                              <span class="text-xs text-stone-400">{{ rec.tipo }}</span>
                              <span class="text-stone-600 truncate max-w-[300px]">{{ rec.url }}</span>
                            </div>
                            <button type="button" (click)="quitarRecurso($index)"
                              class="text-stone-400 hover:text-red-500 transition-colors">&times;</button>
                          </div>
                        }
                      </div>
                    }
                  </div>

                  @if (titulo || autoresSeleccionados.length) {
                    <div class="bg-stone-50 rounded-lg border border-stone-200 p-4">
                      <div class="flex flex-col gap-1">
                        <span class="text-sm font-medium text-stone-700">Resumen</span>
                        @if (titulo) {
                          <div class="flex justify-between text-sm text-stone-600">
                            <span>Título</span>
                            <span class="font-medium text-stone-800 text-right max-w-[60%] truncate">{{ titulo }}</span>
                          </div>
                        }
                        @if (autoresSeleccionados.length) {
                          <div class="flex justify-between text-sm text-stone-600">
                            <span>Autores</span>
                            <span class="text-right max-w-[60%] truncate">{{ nombresAutoresSeleccionados }}</span>
                          </div>
                        }
                        @if (editorial) {
                          <div class="flex justify-between text-sm text-stone-600">
                            <span>Editorial</span>
                            <span>{{ editorial }}</span>
                          </div>
                        }
                        @if (anioPublicacion) {
                          <div class="flex justify-between text-sm text-stone-600">
                            <span>Año</span>
                            <span>{{ anioPublicacion }}</span>
                          </div>
                        }
                      </div>
                    </div>
                  }

                  <div class="flex flex-col sm:flex-row gap-4">
                    <app-boton
                      etiqueta="Crear Libro"
                      tamanio="md"
                      [anchoCompleto]="false"
                      [deshabilitado]="!formularioValido"
                      (presionado)="crearLibro()"/>
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
export class CrearLibroComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly navigationService = inject(NavigationService);
  private readonly libroService = inject(LibroService);
  private readonly editorialService = inject(EditorialService);
  private readonly autorService = inject(AutorService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly cdr = inject(ChangeDetectorRef);

  titulo: string = '';
  isbn: string = '';
  editorial: string = '';
  anioPublicacion: number = 2026;
  idioma: string = '';
  descripcion: string = '';
  foto: string = '';
  errorImagen: boolean = false;

  autoresDisponibles: Array<{etiqueta: string; valor: string}> = [];
  autoresSeleccionados: string[] = [];
  autorSeleccionando: string = '';
  categoriasDisponibles: Array<{etiqueta: string; valor: string}> = [];
  categoriasSeleccionadas: string[] = [];
  categoriaSeleccionando: string = '';

  nuevoRecurso: {tipo: string; url: string; formato: string} = {tipo: '', url: '', formato: ''};
  recursosDigitales: Array<{tipo: string; url: string; formato: string}> = [];

  opcionesTipoRecurso = [
    {etiqueta: 'PDF', valor: 'pdf'},
    {etiqueta: 'EPUB', valor: 'epub'},
    {etiqueta: 'Audiolibro', valor: 'audiolibro'},
    {etiqueta: 'Video', valor: 'video'},
  ];
  opcionesFormatoRecurso = [
    {etiqueta: 'PDF', valor: 'pdf'},
    {etiqueta: 'EPUB', valor: 'epub'},
    {etiqueta: 'MP3', valor: 'mp3'},
    {etiqueta: 'MP4', valor: 'mp4'},
  ];

  errores: { titulo: string; autores: string; editorial: string } = {titulo: '', autores: '', editorial: ''};
  exito: boolean = false;
  error: string = '';

  opcionesIdiomas: Array<{ etiqueta: string; valor: string }> = [
    {etiqueta: 'Español', valor: 'Español'},
    {etiqueta: 'Inglés', valor: 'Inglés'},
    {etiqueta: 'Francés', valor: 'Francés'},
    {etiqueta: 'Alemán', valor: 'Alemán'},
    {etiqueta: 'Italiano', valor: 'Italiano'},
    {etiqueta: 'Portugués', valor: 'Portugués'},
    {etiqueta: 'Ruso', valor: 'Ruso'},
    {etiqueta: 'Chino', valor: 'Chino'},
    {etiqueta: 'Japonés', valor: 'Japonés'},
    {etiqueta: 'Otro', valor: 'Otro'},
  ];

  opcionesEditoriales: Array<{ etiqueta: string; valor: string }> = [];

  get nombresAutoresSeleccionados(): string { return this.autoresSeleccionados.map(id => this.nombreAutor(id)).join(', '); }

  get formularioValido(): boolean {
    return (
      this.titulo.trim().length > 0 &&
      this.autoresSeleccionados.length > 0 &&
      this.editorial.trim().length > 0 &&
      !this.exito
    );
  }

  agregarAutor(id: string): void {
    if (id && !this.autoresSeleccionados.includes(id)) {
      this.autoresSeleccionados.push(id);
    }
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
    if (id && !this.categoriasSeleccionadas.includes(id)) {
      this.categoriasSeleccionadas.push(id);
    }
    this.categoriaSeleccionando = '';
  }

  quitarCategoria(id: string): void {
    this.categoriasSeleccionadas = this.categoriasSeleccionadas.filter(c => c !== id);
  }

  nombreCategoria(id: string): string {
    return this.categoriasDisponibles.find(c => c.valor === id)?.etiqueta ?? id;
  }

  agregarRecurso(): void {
    if (this.nuevoRecurso.tipo && this.nuevoRecurso.formato && this.nuevoRecurso.url) {
      this.recursosDigitales.push({...this.nuevoRecurso});
      this.nuevoRecurso = {tipo: '', url: '', formato: ''};
    }
  }

  quitarRecurso(idx: number): void {
    this.recursosDigitales.splice(idx, 1);
  }

  normalizarLista(data: any): any[] {
    if (Array.isArray(data)) return data;
    return data?.data ?? data?.resultados ?? data?.items ?? [];
  }

  obtenerId(obj: any): string { return obj?._id ?? obj?.id ?? ''; }

  ngOnInit(): void {
    this.editorialService.listar().subscribe({
      next: (data: any) => {
        const listado = this.normalizarLista(data);
        this.opcionesEditoriales = listado.map((e: any) => ({
          etiqueta: e.nombre ?? e.razonSocial ?? '',
          valor: this.obtenerId(e),
        }));
        this.cdr.detectChanges();
      },
      error: () => {},
    });
    this.autorService.listar().subscribe({
      next: (data: any) => {
        const listado = this.normalizarLista(data);
        this.autoresDisponibles = listado.map((a: any) => ({
          etiqueta: `${a.nombre ?? ''} ${a.apellidos ?? ''}`.trim() || a._id || a.id || '',
          valor: a._id ?? a.id ?? '',
        }));
        this.cdr.detectChanges();
      },
      error: () => {},
    });
    this.categoriaService.listar().subscribe({
      next: (data: any) => {
        const listado = this.normalizarLista(data);
        console.log('[CrearLibro] Categorías recibidas:', listado);
        this.categoriasDisponibles = listado.map((c: any) => ({
          etiqueta: c.nombre ?? c._id ?? c.id ?? '',
          valor: c._id ?? c.id ?? '',
        }));
        console.log('[CrearLibro] Categorías mapeadas:', this.categoriasDisponibles);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('[CrearLibro] Error al cargar categorías:', err);
      },
    });
  }

  crearLibro(): void {
    this.errores.titulo = '';
    this.errores.autores = '';
    this.errores.editorial = '';

    if (!this.titulo.trim()) {
      this.errores.titulo = 'El título es obligatorio.';
    }
    if (this.autoresSeleccionados.length === 0) {
      this.errores.autores = 'Selecciona al menos un autor.';
    }
    if (!this.editorial.trim()) {
      this.errores.editorial = 'La editorial es obligatoria.';
    }
    if (this.errores.titulo || this.errores.autores || this.errores.editorial) {
      return;
    }

    const data: any = {
      titulo: this.titulo.trim(),
      isbn: this.isbn.trim(),
      anioPublicacion: this.anioPublicacion,
      idioma: this.idioma,
      descripcion: this.descripcion.trim(),
      fotoUrl: this.foto.trim() || undefined,
      autorIds: this.autoresSeleccionados,
      categoriaIds: this.categoriasSeleccionadas,
    };
    data.editorialId = this.editorial;
    if (this.recursosDigitales.length > 0) {
      data.recursosDigitales = this.recursosDigitales;
    }

    this.libroService.crear(data).subscribe({
      next: (res: any) => {
        const nuevo = res?.data ?? res;
        this.navigationService.store.getState().seleccionarLibro(nuevo?.id ?? null);
        this.exito = true;
        this.error = '';
      },
      error: (err) => {
        this.error = err?.error?.mensaje ?? err?.message ?? 'Error al crear el libro.';
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/admin/libros']);
  }
}
