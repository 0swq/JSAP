import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { HistorialService } from './historial.service';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class AutorService {
  private base = `${environment.apiUrl}${environment.endpoints.autores.listar}`;

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

  crear(data: {
    nombre: string;
    apellidos: string;
    nacionalidad?: string;
    biografia?: string;
    fotoUrl?: string;
    fechaNacimiento?: string;
  }): Observable<any> {
    return this.http.post(this.base, data).pipe(
      tap(() => {
        this.historialService.crear({
          nombreAccion: 'Crear autor',
          accion: 'crear',
          modulo: 'autores',
          hechoPorId: this.storageService.getId(),
        }).subscribe();
      }),
    );
  }

  actualizar(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.base}/${id}`, data).pipe(
      tap(() => {
        this.historialService.crear({
          nombreAccion: 'Actualizar autor',
          accion: 'actualizar',
          modulo: 'autores',
          hechoPorId: this.storageService.getId(),
        }).subscribe();
      }),
    );
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`).pipe(
      tap(() => {
        this.historialService.crear({
          nombreAccion: 'Eliminar autor',
          accion: 'eliminar',
          modulo: 'autores',
          hechoPorId: this.storageService.getId(),
        }).subscribe();
      }),
    );
  }
}
