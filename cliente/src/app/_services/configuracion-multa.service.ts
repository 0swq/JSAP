import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { HistorialService } from './historial.service';
import { StorageService } from './storage.service';


@Injectable({ providedIn: 'root' })
export class ConfiguracionMultaService {
  private base = `${environment.apiUrl}${environment.endpoints.configuracionMulta.listar}`;

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

  crear(data: { tarifaDiaria: number; diasMaxPrestamo: number }): Observable<any> {
    return this.http.post(this.base, data).pipe(
      tap(() => {
        this.historialService.crear({
          nombreAccion: 'Crear configuración multa',
          accion: 'crear',
          modulo: 'configuracion-multa',
          hechoPorId: this.storageService.getId(),
        }).subscribe();
      }),
    );
  }

  actualizar(id: string, data: { tarifaDiaria?: number; diasMaxPrestamo?: number }): Observable<any> {
    return this.http.patch(`${this.base}/${id}`, data).pipe(
      tap(() => {
        this.historialService.crear({
          nombreAccion: 'Actualizar configuración multa',
          accion: 'actualizar',
          modulo: 'configuracion-multa',
          hechoPorId: this.storageService.getId(),
        }).subscribe();
      }),
    );
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`).pipe(
      tap(() => {
        this.historialService.crear({
          nombreAccion: 'Eliminar configuración multa',
          accion: 'eliminar',
          modulo: 'configuracion-multa',
          hechoPorId: this.storageService.getId(),
        }).subscribe();
      }),
    );
  }
}
