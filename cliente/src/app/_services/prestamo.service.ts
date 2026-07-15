import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { HistorialService } from './historial.service';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class PrestamoService {
  private base = `${environment.apiUrl}${environment.endpoints.prestamos.listar}`;

  constructor(
    private http: HttpClient,
    private historialService: HistorialService,
    private storageService: StorageService,
  ) {}

  listar(filtros?: { estado?: string; usuarioId?: string; ejemplarId?: string }): Observable<any> {
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

  /** Préstamos del usuario autenticado (todos los roles) */
  misPrestamos(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}${environment.endpoints.prestamos.misPrestamos}`,
    );
  }

  /** Cantidad de préstamos activos del usuario autenticado */
  contarActivos(): Observable<number> {
    return this.misPrestamos().pipe(
      map((res: any) => {
        const data = res?.data ?? res;
        const items: any[] = Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);
        return items.filter((p: any) => p.estado === 'activo').length;
      }),
    );
  }

  crear(data: {
    usuarioId: string;
    ejemplarId: string;
    fechaMaxDevolucion: string;
  }): Observable<any> {
    return this.http.post(this.base, data).pipe(
      tap(() => {
        this.historialService.crear({
          nombreAccion: 'Crear préstamo',
          accion: 'crear',
          modulo: 'prestamos',
          hechoPorId: this.storageService.getId(),
        }).subscribe();
      }),
    );
  }

  /** Registrar devolución o cambiar estado (activo → devuelto/vencido) */
  actualizar(id: string, data: { estado?: 'activo' | 'devuelto' | 'vencido'; fechaDevolucion?: string }): Observable<any> {
    return this.http.patch(`${this.base}/${id}`, data).pipe(
      tap(() => {
        this.historialService.crear({
          nombreAccion: 'Actualizar préstamo',
          accion: 'actualizar',
          modulo: 'prestamos',
          hechoPorId: this.storageService.getId(),
        }).subscribe();
      }),
    );
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`).pipe(
      tap(() => {
        this.historialService.crear({
          nombreAccion: 'Eliminar préstamo',
          accion: 'eliminar',
          modulo: 'prestamos',
          hechoPorId: this.storageService.getId(),
        }).subscribe();
      }),
    );
  }
}
