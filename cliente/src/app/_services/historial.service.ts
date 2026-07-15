import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HistorialService {
  private base = `${environment.apiUrl}${environment.endpoints.historial.listar}`;

  constructor(private http: HttpClient) {}

  listar(filtros?: {
    hechoPorId?: string;
    modulo?: string;
    nombreAccion?: string;
    accion?: string;
    buscar?: string;
    desde?: string;
    hasta?: string;
  }): Observable<any> {
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

  crear(data: { nombreAccion: string; accion: string; modulo: string; hechoPorId: string }): Observable<any> {
    return this.http.post(this.base, data);
  }
}
