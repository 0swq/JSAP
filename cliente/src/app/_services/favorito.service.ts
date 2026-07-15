import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { HistorialService } from './historial.service';
import { StorageService } from './storage.service';


@Injectable({ providedIn: 'root' })
export class FavoritoService {
  private base = `${environment.apiUrl}${environment.endpoints.favoritos.agregar}`;

  constructor(
    private http: HttpClient,
    private historialService: HistorialService,
    private storageService: StorageService,
  ) {}

  misFavoritos(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}${environment.endpoints.favoritos.misFavoritos}`,
    );
  }

  obtener(id: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}${environment.endpoints.favoritos.obtener}/${id}`,
    );
  }

  agregar(data: { usuarioId: string; libroId: string }): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}${environment.endpoints.favoritos.agregar}`,
      data,
    ).pipe(
      tap(() => {
        this.historialService.crear({
          nombreAccion: 'Agregar favorito',
          accion: 'agregar',
          modulo: 'favoritos',
          hechoPorId: this.storageService.getId(),
        }).subscribe();
      }),
    );
  }
  eliminar(id: string): Observable<any> {
    return this.http.delete(
      `${environment.apiUrl}${environment.endpoints.favoritos.eliminar}/${id}`,
    ).pipe(
      tap(() => {
        this.historialService.crear({
          nombreAccion: 'Eliminar favorito',
          accion: 'eliminar',
          modulo: 'favoritos',
          hechoPorId: this.storageService.getId(),
        }).subscribe();
      }),
    );
  }
}
