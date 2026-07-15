import {Component, inject, OnInit, ChangeDetectorRef} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SidebarComponent} from '../../_shared/componentes/navegacion/sidebar.component';
import {PilaVerticalComponent} from '../../_shared/componentes/diseno/pila-vertical.component';
import {PilaHorizontalComponent} from '../../_shared/componentes/diseno/pila-horizontal.component';
import {BotonComponent} from '../../_shared/componentes/botones/boton.component';
import {BotonIconoComponent} from '../../_shared/componentes/botones/boton-icono.component';
import {TextoPequenoComponent} from '../../_shared/componentes/texto/texto-pequeno.component';
import {TextTituloComponent} from '../../_shared/componentes/texto/text-titulo.component';
import {EntradaBusquedaComponent} from '../../_shared/componentes/entradas/entrada-busqueda.component';
import {PaginacionComponent} from '../../_shared/componentes/navegacion/paginacion.component';
import {AutorService} from '../../_services/autor.service';
import {NavigationService} from '../../_services/navigation-store';
import {Autor} from '../../model';

@Component({
  selector: 'app-admin-autores',
  standalone: true,
  imports: [SidebarComponent, PilaVerticalComponent, PilaHorizontalComponent,
    BotonComponent, BotonIconoComponent, TextoPequenoComponent, TextTituloComponent,
    EntradaBusquedaComponent, PaginacionComponent, FormsModule, RouterModule, DatePipe],
  template: `
    <div class="flex min-h-screen bg-stone-50">
      <app-sidebar></app-sidebar>
      <main class="flex-1 flex flex-col min-w-0">
        <div class="px-4 sm:px-6 py-6 max-w-7xl w-full mx-auto">
          <app-pila-horizontal espacio="4" alinear="centro" justificar="entre" class="mb-6 flex-wrap">
            <app-pila-vertical espacio="1">
              <texto-titulo tamanio="xl">Autores</texto-titulo>
              <texto-pequeno>Administra los autores registrados.</texto-pequeno>
            </app-pila-vertical>
            <app-boton etiqueta="Nuevo Autor" tamanio="sm" (presionado)="nuevo()"/>
          </app-pila-horizontal>
          <div class="bg-white rounded-xl border border-stone-200 p-3 sm:p-4 mb-6">
            <app-entrada-busqueda placeholder="Buscar autor..." [valor]="termino"
              (valorCambio)="onBusqueda($event)"/>
          </div>
          <div class="bg-white rounded-xl border border-stone-200 overflow-hidden w-full">
            <div class="overflow-x-auto">
              <table class="w-full text-sm"><thead><tr class="border-b border-stone-200 bg-stone-50">
                <th class="text-left px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Nombre</th>
                <th class="text-left px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Nacionalidad</th>
                <th class="text-left px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Nacimiento</th>
                <th class="text-center px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Acciones</th>
              </tr></thead>
              <tbody class="divide-y divide-stone-100">
                @for (a of paginados; track obtenerId(a)) {
                  <tr class="hover:bg-amber-50/30 transition-colors">
                    <td class="px-3 sm:px-5 py-3">
                      <span class="font-medium text-stone-800">{{ a.nombre }} {{ a.apellidos }}</span>
                    </td>
                    <td class="px-3 sm:px-5 py-3"><texto-pequeno>{{ a.nacionalidad || '—' }}</texto-pequeno></td>
                    <td class="px-3 sm:px-5 py-3"><texto-pequeno>{{ a.fechaNacimiento ? (a.fechaNacimiento | date:'dd/MM/yyyy') : '—' }}</texto-pequeno></td>
                    <td class="px-3 sm:px-5 py-3 text-center">
                      <app-pila-horizontal espacio="1" justificar="centro">
                        <app-boton-icono icono="✎" tamanio="sm" tooltip="Editar" (presionado)="editar(a)"/>
                        <app-boton-icono icono="✕" tamanio="sm" tooltip="Eliminar" (presionado)="eliminar(a)"/>
                      </app-pila-horizontal>
                    </td>
                  </tr>
                } @empty {
                  <tr><td colspan="4" class="px-5 py-12 text-center"><texto-pequeno>No se encontraron autores.</texto-pequeno></td></tr>
                }
              </tbody></table>
            </div>
          </div>
          @if (totalPaginas > 1) { <div class="mt-6 flex justify-center"><app-paginacion [pagina]="pagina" [total]="filtrados.length" [tamanioPagina]="tam" (cambioPagina)="irAPagina($event)"/></div> }
        </div>
      </main>
    </div>`,
})
export class AdminAutoresComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly svc = inject(AutorService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly nav = inject(NavigationService);
  items: Autor[] = []; termino = ''; pagina = 1; tam = 10;
  obtenerId = (o: any) => o?._id ?? o?.id ?? '';
  ngOnInit(): void { this.cargar(); }
  cargar(): void { this.svc.listar().subscribe({ next: (d: any) => { const l = Array.isArray(d) ? d : (d?.data ?? d?.resultados ?? []); this.items = l; this.cdr.detectChanges(); }, error: () => {} }); }
  onBusqueda(v: string): void { this.termino = v; this.pagina = 1; }
  get filtrados(): Autor[] { const t = this.termino.trim().toLowerCase(); return t ? this.items.filter(a => `${a.nombre ?? ''} ${a.apellidos ?? ''}`.toLowerCase().includes(t) || (a.nacionalidad ?? '').toLowerCase().includes(t)) : this.items; }
  get totalPaginas(): number { return Math.max(1, Math.ceil(this.filtrados.length / this.tam)); }
  get paginados(): Autor[] { const ini = (this.pagina - 1) * this.tam; return this.filtrados.slice(ini, ini + this.tam); }
  irAPagina(p: number): void { if (p >= 1 && p <= this.totalPaginas) this.pagina = p; }
  nuevo(): void { this.nav.store.getState().seleccionarAutor(null); this.router.navigate(['/admin/autores/crear']); }
  editar(item: Autor): void { const id = this.obtenerId(item); this.nav.store.getState().seleccionarAutor(id); this.router.navigate(['/admin/autores/editar', id]); }
  eliminar(item: Autor): void { if (!confirm(`¿Eliminar "${item.nombre} ${item.apellidos}"?`)) return; this.svc.eliminar(this.obtenerId(item)).subscribe({ next: () => { this.items = this.items.filter(a => this.obtenerId(a) !== this.obtenerId(item)); this.pagina = 1; }, error: (e: any) => console.error(e) }); }
}
