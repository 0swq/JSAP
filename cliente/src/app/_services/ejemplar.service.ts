import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { HistorialService } from './historial.service';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class EjemplarService {
  private base = `${environment.apiUrl}${environment.endpoints.ejemplares.listar}`;

  constructor(
    private http: HttpClient,
    private historialService: HistorialService,
    private storageService: StorageService,
  ) {}
  listar(filtros?: { estado?: string; libroId?: string }): Observable<any> {
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

  porLibro(libroId: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}${environment.endpoints.ejemplares.porLibro}/${libroId}`,
    );
  }
  crear(data: {
    libroId: string;
    codigoBarras: string;
    estado?: 'disponible' | 'prestado' | 'perdido' | 'mantenimiento';
    ubicacion?: string;
  }): Observable<any> {
    return this.http.post(this.base, data).pipe(
      tap(() => {
        this.historialService.crear({
          nombreAccion: 'Crear ejemplar',
          accion: 'crear',
          modulo: 'ejemplares',
          hechoPorId: this.storageService.getId(),
        }).subscribe();
      }),
    );
  }

  actualizar(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.base}/${id}`, data).pipe(
      tap(() => {
        this.historialService.crear({
          nombreAccion: 'Actualizar ejemplar',
          accion: 'actualizar',
          modulo: 'ejemplares',
          hechoPorId: this.storageService.getId(),
        }).subscribe();
      }),
    );
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`).pipe(
      tap(() => {
        this.historialService.crear({
          nombreAccion: 'Eliminar ejemplar',
          accion: 'eliminar',
          modulo: 'ejemplares',
          hechoPorId: this.storageService.getId(),
        }).subscribe();
      }),
    );
  }
}
