import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { HistorialService } from './historial.service';
import { StorageService } from './storage.service';


@Injectable({ providedIn: 'root' })
export class ReservaService {
  private base = `${environment.apiUrl}${environment.endpoints.reservas.listar}`;

  constructor(
    private http: HttpClient,
    private historialService: HistorialService,
    private storageService: StorageService,
  ) {}

  listar(filtros?: { estado?: string; usuarioId?: string; libroId?: string }): Observable<any> {
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

  /** Reservas del usuario autenticado (todos los roles) */
  misReservas(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}${environment.endpoints.reservas.misReservas}`,
    );
  }

  /** Cantidad de reservas activas (pendientes o activas) del usuario autenticado */
  contarActivas(): Observable<number> {
    return this.misReservas().pipe(
      map((res: any) => {
        const data = res?.data ?? res;
        const items: any[] = Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);
        return items.filter((r: any) => r.estado === 'activa' || r.estado === 'pendiente').length;
      }),
    );
  }

  /**
   * Crear reserva — máximo 3 activas por usuario.
   * El backend rechaza con 409 si se excede el límite.
   */
  crear(data: { libroId: string; ejemplarId: string; fechaExpiracion?: string }): Observable<any> {
    return this.http.post(this.base, data).pipe(
      tap(() => {
        this.historialService.crear({
          nombreAccion: 'Crear reserva',
          accion: 'crear',
          modulo: 'reservas',
          hechoPorId: this.storageService.getId(),
        }).subscribe();
      }),
    );
  }

  actualizar(id: string, data: { estado?: 'pendiente' | 'activa' | 'cancelada' | 'completada' }): Observable<any> {
    return this.http.patch(`${this.base}/${id}`, data).pipe(
      tap(() => {
        this.historialService.crear({
          nombreAccion: 'Actualizar reserva',
          accion: 'actualizar',
          modulo: 'reservas',
          hechoPorId: this.storageService.getId(),
        }).subscribe();
      }),
    );
  }

  /** Cancelar reserva (alias semántico de eliminar) */
  cancelar(id: string): Observable<any> {
    return this.http.delete(
      `${environment.apiUrl}${environment.endpoints.reservas.cancelar}/${id}`,
    ).pipe(
      tap(() => {
        this.historialService.crear({
          nombreAccion: 'Cancelar reserva',
          accion: 'cancelar',
          modulo: 'reservas',
          hechoPorId: this.storageService.getId(),
        }).subscribe();
      }),
    );
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`).pipe(
      tap(() => {
        this.historialService.crear({
          nombreAccion: 'Eliminar reserva',
          accion: 'eliminar',
          modulo: 'reservas',
          hechoPorId: this.storageService.getId(),
        }).subscribe();
      }),
    );
  }
}
