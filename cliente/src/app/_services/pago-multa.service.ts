import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { HistorialService } from './historial.service';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class PagoMultaService {
  private base = `${environment.apiUrl}${environment.endpoints.pagosMulta.listar}`;

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

  porMulta(multaId: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}${environment.endpoints.pagosMulta.porMulta}/${multaId}`,
    );
  }

  crear(data: {
    multaId: string;
    montoPagado: number;
    metodoPago: 'efectivo' | 'transferencia' | 'tarjeta';
  }): Observable<any> {
    return this.http.post(this.base, data).pipe(
      tap(() => {
        this.historialService.crear({
          nombreAccion: 'Crear pago multa',
          accion: 'crear',
          modulo: 'pagos-multa',
          hechoPorId: this.storageService.getId(),
        }).subscribe();
      }),
    );
  }

  actualizar(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.base}/${id}`, data).pipe(
      tap(() => {
        this.historialService.crear({
          nombreAccion: 'Actualizar pago multa',
          accion: 'actualizar',
          modulo: 'pagos-multa',
          hechoPorId: this.storageService.getId(),
        }).subscribe();
      }),
    );
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`).pipe(
      tap(() => {
        this.historialService.crear({
          nombreAccion: 'Eliminar pago multa',
          accion: 'eliminar',
          modulo: 'pagos-multa',
          hechoPorId: this.storageService.getId(),
        }).subscribe();
      }),
    );
  }
}
