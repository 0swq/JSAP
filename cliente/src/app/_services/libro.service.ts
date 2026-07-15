import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { HistorialService } from './historial.service';
import { StorageService } from './storage.service';


@Injectable({ providedIn: 'root' })
export class LibroService {
  private base = `${environment.apiUrl}${environment.endpoints.libros.listar}`;

  constructor(
    private http: HttpClient,
    private historialService: HistorialService,
    private storageService: StorageService,
  ) {}

  listar(filtros?: {
    titulo?: string;
    isbn?: string;
    editorialId?: string;
    autorId?: string;
    categoriaId?: string;
    publicado?: boolean;
    anioPublicacion?: number;
    buscar?: string;
  }): Observable<any> {
    let params = new HttpParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, String(value));
        }
      });
    }
    return this.http.get(this.base, { params });
  }
  obtener(id: string): Observable<any> {
    return this.http.get(`${this.base}/${id}`);
  }

  crear(data: {
    titulo: string;
    isbn: string;
    editorialId: string;
    anioPublicacion?: number;
    idioma?: string;
    publicado?: boolean;
    descripcion?: string;
    fotoUrl?: string;
    autorIds?: string[];
    categoriaIds?: string[];
  }): Observable<any> {
    return this.http.post(this.base, data).pipe(
      tap(() => {
        this.historialService.crear({
          nombreAccion: 'Crear libro',
          accion: 'crear',
          modulo: 'libros',
          hechoPorId: this.storageService.getId(),
        }).subscribe();
      }),
    );
  }

  actualizar(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.base}/${id}`, data).pipe(
      tap(() => {
        this.historialService.crear({
          nombreAccion: 'Actualizar libro',
          accion: 'actualizar',
          modulo: 'libros',
          hechoPorId: this.storageService.getId(),
        }).subscribe();
      }),
    );
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`).pipe(
      tap(() => {
        this.historialService.crear({
          nombreAccion: 'Eliminar libro',
          accion: 'eliminar',
          modulo: 'libros',
          hechoPorId: this.storageService.getId(),
        }).subscribe();
      }),
    );
  }

  buscar(termino: string, pagina?: number, porPagina?: number): Observable<any> {
    let params = new HttpParams().set('q', termino);
    if (pagina) params = params.set('pagina', String(pagina));
    if (porPagina) params = params.set('porPagina', String(porPagina));
    return this.http.get(`${this.base}/buscar`, { params });
  }

  solicitarGrafo(termino: string): Observable<{ nodes: any[]; edges: any[] }> {
    const params = new HttpParams().set('q', termino);
    return this.http.get<{ nodes: any[]; edges: any[] }>(`${this.base}/grafo`, { params });
  }

  solicitarInformacionLibro(
    id: string,
    numNodos: number = 5,
    historial: { nodes: any[]; edges: any[] } = { nodes: [], edges: [] },
  ): Observable<{ nodes: any[]; edges: any[] }> {
    return this.http.post<{ nodes: any[]; edges: any[] }>(
      `${this.base}/grafoInformacion`,
      { q: id, numNodos, historial },
    );
  }

  expandirNodo(
    query: string,
    nodoOrigenId: string,
    numNodos: number = 5,
    historial: { nodes: any[]; edges: any[] } = { nodes: [], edges: [] },
  ): Observable<{ nodes: any[]; edges: any[] }> {
    return this.http.post<{ nodes: any[]; edges: any[] }>(
      `${this.base}/grafoInformacion/expandir`,
      { q: query, nodoOrigenId, numNodos, historial },
    );
  }
  explicarRelacion(
    tituloOrigen: string,
    tituloDestino: string,
    contexto?: string,
  ): Observable<{ tipo: string; explicacion: string }> {
    return this.http.post<{ tipo: string; explicacion: string }>(
      `${this.base}/grafoInformacion/explicarRelacion`,
      { tituloOrigen, tituloDestino, contexto },
    );
  }
}
