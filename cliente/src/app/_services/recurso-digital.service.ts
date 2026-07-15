import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { HistorialService } from './historial.service';
import { StorageService } from './storage.service';


@Injectable({ providedIn: 'root' })
export class RecursoDigitalService {
  private base = `${environment.apiUrl}${environment.endpoints.recursosDigitales.listar}`;

  constructor(
    private http: HttpClient,
    private historialService: HistorialService,
    private storageService: StorageService,
  ) {}

  listar(): Observable<any> {
    return this.http.get(this.base);
  }

  obtener(id: string): Observable<any> {
    return this.http.get(`${this.base}/${id}`);
  }

  porLibro(libroId: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}${environment.endpoints.recursosDigitales.porLibro}/${libroId}`,
    );
  }

  crear(data: {
    libroId: string;
    tipo: 'pdf' | 'epub' | 'audiolibro' | 'video';
    url: string;
    acceso: 'publico' | 'autenticado' | 'restringido';
  }): Observable<any> {
    return this.http.post(this.base, data).pipe(
      tap(() => {
        this.historialService.crear({
          nombreAccion: 'Crear recurso digital',
          accion: 'crear',
          modulo: 'recursos-digitales',
          hechoPorId: this.storageService.getId(),
        }).subscribe();
      }),
    );
  }

  actualizar(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.base}/${id}`, data).pipe(
      tap(() => {
        this.historialService.crear({
          nombreAccion: 'Actualizar recurso digital',
          accion: 'actualizar',
          modulo: 'recursos-digitales',
          hechoPorId: this.storageService.getId(),
        }).subscribe();
      }),
    );
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`).pipe(
      tap(() => {
        this.historialService.crear({
          nombreAccion: 'Eliminar recurso digital',
          accion: 'eliminar',
          modulo: 'recursos-digitales',
          hechoPorId: this.storageService.getId(),
        }).subscribe();
      }),
    );
  }
}
