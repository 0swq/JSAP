import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {environment} from '../../environments/environment';
import {HistorialService} from './historial.service';
import {StorageService} from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private historialService: HistorialService,
    private storageService: StorageService,
  ) {
  }

  listarUsuarios(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}${environment.endpoints.usuarios.listar}`,
    );
  }

  obtenerUsuario(id: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}${environment.endpoints.usuarios.obtener}/${id}`,
    );
  }

  actualizarUsuario(id: string, data: any): Observable<any> {
    return this.http.patch(
      `${environment.apiUrl}${environment.endpoints.usuarios.actualizar}/${id}`,
      data,
    ).pipe(
      tap(() => {
        this.historialService.crear({
          nombreAccion: 'Actualizar usuario',
          accion: 'actualizar',
          modulo: 'usuarios',
          hechoPorId: this.storageService.getId(),
        }).subscribe();
      }),
    );
  }

  eliminarUsuario(id: string): Observable<any> {
    return this.http.delete(
      `${environment.apiUrl}${environment.endpoints.usuarios.eliminar}/${id}`,
    ).pipe(
      tap(() => {
        this.historialService.crear({
          nombreAccion: 'Eliminar usuario',
          accion: 'eliminar',
          modulo: 'usuarios',
          hechoPorId: this.storageService.getId(),
        }).subscribe();
      }),
    );
  }
}
