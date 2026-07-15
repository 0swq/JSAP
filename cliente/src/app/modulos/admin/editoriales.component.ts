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
import {InsigniaComponent} from '../../_shared/componentes/datos/insignia.component';
import {PaginacionComponent} from '../../_shared/componentes/navegacion/paginacion.component';
import {EditorialService} from '../../_services/editorial.service';
import {NavigationService} from '../../_services/navigation-store';
import {Editorial} from '../../model';

@Component({
  selector: 'app-admin-editoriales',
  standalone: true,
  imports: [SidebarComponent, PilaVerticalComponent, PilaHorizontalComponent,
    BotonComponent, BotonIconoComponent, TextoPequenoComponent, TextTituloComponent,
    EntradaBusquedaComponent, InsigniaComponent, PaginacionComponent,
    FormsModule, RouterModule, DatePipe],
  template: `
    <div class="flex min-h-screen bg-stone-50">
      <app-sidebar></app-sidebar>
      <main class="flex-1 flex flex-col min-w-0">
        <div class="px-4 sm:px-6 py-6 max-w-7xl w-full mx-auto">
          <app-pila-horizontal espacio="4" alinear="centro" justificar="entre" class="mb-6 flex-wrap">
            <app-pila-vertical espacio="1">
              <texto-titulo tamanio="xl">Editoriales</texto-titulo>
              <texto-pequeno>Administra las editoriales registradas.</texto-pequeno>
            </app-pila-vertical>
            <app-boton etiqueta="Nueva Editorial" tamanio="sm" (presionado)="nueva()"/>
          </app-pila-horizontal>
          <div class="bg-white rounded-xl border border-stone-200 p-3 sm:p-4 mb-6">
            <app-entrada-busqueda placeholder="Buscar editorial..." [valor]="terminoBusqueda"
              (valorCambio)="onBusquedaCambio($event)"/>
          </div>
          <div class="bg-white rounded-xl border border-stone-200 overflow-hidden w-full">
            <div class="overflow-x-auto">
              <table class="w-full text-sm"><thead><tr class="border-b border-stone-200 bg-stone-50">
                <th class="text-left px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Nombre</th>
                <th class="text-left px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">País</th>
                <th class="text-left px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Creado</th>
                <th class="text-center px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Acciones</th>
              </tr></thead>
              <tbody class="divide-y divide-stone-100">
                @for (item of paginados; track obtenerId(item)) {
                  <tr class="hover:bg-amber-50/30 transition-colors">
                    <td class="px-3 sm:px-5 py-3"><span class="font-medium text-stone-800">{{ item.nombre }}</span></td>
                    <td class="px-3 sm:px-5 py-3"><texto-pequeno>{{ item.pais || '—' }}</texto-pequeno></td>
                    <td class="px-3 sm:px-5 py-3"><texto-pequeno>{{ item.creadoEn | date: 'dd/MM/yyyy' }}</texto-pequeno></td>
                    <td class="px-3 sm:px-5 py-3 text-center">
                      <app-pila-horizontal espacio="1" justificar="centro">
                        <app-boton-icono icono="✎" tamanio="sm" tooltip="Editar" (presionado)="editar(item)"/>
                        <app-boton-icono icono="✕" tamanio="sm" tooltip="Eliminar" (presionado)="eliminar(item)"/>
                      </app-pila-horizontal>
                    </td>
                  </tr>
                } @empty {
                  <tr><td colspan="4" class="px-5 py-12 text-center"><texto-pequeno>No se encontraron editoriales.</texto-pequeno></td></tr>
                }
              </tbody></table>
            </div>
          </div>
          @if (totalPaginas > 1) { <div class="mt-6 flex justify-center"><app-paginacion [pagina]="paginaActual" [total]="filtrados.length" [tamanioPagina]="tamPagina" (cambioPagina)="irAPagina($event)"/></div> }
        </div>
      </main>
    </div>`,
})
export class AdminEditorialesComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly svc = inject(EditorialService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly nav = inject(NavigationService);

  items: Editorial[] = [];
  terminoBusqueda = '';
  paginaActual = 1; tamPagina = 10;
  obtenerId = (o: any) => o?._id ?? o?.id ?? '';

  ngOnInit(): void { this.cargar(); }
  cargar(): void { this.svc.listar().subscribe({ next: (d: any) => { const l = Array.isArray(d) ? d : (d?.data ?? d?.resultados ?? []); this.items = l; this.cdr.detectChanges(); }, error: () => {} }); }

  onBusquedaCambio(v: string): void { this.terminoBusqueda = v; this.paginaActual = 1; }
  get filtrados(): Editorial[] { const t = this.terminoBusqueda.trim().toLowerCase(); return t ? this.items.filter(i => (i.nombre ?? '').toLowerCase().includes(t) || (i.pais ?? '').toLowerCase().includes(t)) : this.items; }
  get totalPaginas(): number { return Math.max(1, Math.ceil(this.filtrados.length / this.tamPagina)); }
  get paginados(): Editorial[] { const ini = (this.paginaActual - 1) * this.tamPagina; return this.filtrados.slice(ini, ini + this.tamPagina); }
  irAPagina(p: number): void { if (p >= 1 && p <= this.totalPaginas) this.paginaActual = p; }

  nueva(): void { this.nav.store.getState().seleccionarEditorial(null); this.router.navigate(['/admin/editoriales/crear']); }
  editar(item: Editorial): void { const id = this.obtenerId(item); this.nav.store.getState().seleccionarEditorial(id); this.router.navigate(['/admin/editoriales/editar', id]); }
  eliminar(item: Editorial): void { if (!confirm(`¿Eliminar "${item.nombre}"?`)) return; this.svc.eliminar(this.obtenerId(item)).subscribe({ next: () => { this.items = this.items.filter(i => this.obtenerId(i) !== this.obtenerId(item)); this.paginaActual = 1; }, error: (e: any) => console.error(e) }); }
}
