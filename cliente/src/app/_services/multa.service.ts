import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { HistorialService } from './historial.service';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class MultaService {
  private base = `${environment.apiUrl}${environment.endpoints.multas.listar}`;

  constructor(
    private http: HttpClient,
    private historialService: HistorialService,
    private storageService: StorageService,
  ) {}

  listar(filtros?: { estado?: string; usuarioId?: string }): Observable<any> {
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

  misMultas(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}${environment.endpoints.multas.misMultas}`,
    );
  }

  crear(data: { prestamoId: string; monto: number; diasMora: number }): Observable<any> {
    return this.http.post(this.base, data).pipe(
      tap(() => {
        this.historialService.crear({
          nombreAccion: 'Crear multa',
          accion: 'crear',
          modulo: 'multas',
          hechoPorId: this.storageService.getId(),
        }).subscribe();
      }),
    );
  }

  actualizar(id: string, data: { estado?: 'pendiente' | 'pagada' | 'perdonada'; monto?: number }): Observable<any> {
    return this.http.patch(`${this.base}/${id}`, data).pipe(
      tap(() => {
        this.historialService.crear({
          nombreAccion: 'Actualizar multa',
          accion: 'actualizar',
          modulo: 'multas',
          hechoPorId: this.storageService.getId(),
        }).subscribe();
      }),
    );
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`).pipe(
      tap(() => {
        this.historialService.crear({
          nombreAccion: 'Eliminar multa',
          accion: 'eliminar',
          modulo: 'multas',
          hechoPorId: this.storageService.getId(),
        }).subscribe();
      }),
    );
  }
}
