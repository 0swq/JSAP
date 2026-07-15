import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';
import {StorageService} from '../../../_services/storage.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  template: `
    @if (!abierto) {
      <button
        type="button"
        class="sm:hidden fixed top-4 left-4 z-50 bg-white border border-amber-100 rounded-lg p-2 shadow-sm text-stone-600"
        (click)="abierto = true">
        ☰
      </button>
    }

    @if (abierto) {
      <div
        class="fixed inset-0 bg-black/40 z-30 sm:hidden"
        (click)="abierto = false"></div>
    }

    <aside
      class="h-full w-60 max-w-[80vw] bg-white border-r border-amber-100 flex flex-col
             fixed sm:static top-0 left-0 z-40 transition-transform duration-200
             sm:translate-x-0"
      [class.-translate-x-full]="!abierto"
      [class.translate-x-0]="abierto">

      <div class="px-4 py-4 border-b border-amber-100 flex items-center justify-between">
        <a routerLink="/inicio" class="block">
          <span class="text-base font-bold text-stone-800 tracking-tight">Gestión</span>
        </a>
        <button
          type="button"
          class="sm:hidden text-stone-400 hover:text-stone-600 p-1"
          (click)="abierto = false">
          ✕
        </button>
      </div>

      <nav class="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">

        <div class="mb-2">
          <span class="px-3 text-xs font-semibold text-stone-400 uppercase tracking-wide">
            Biblioteca
          </span>
          <div class="mt-1 flex flex-col gap-0.5">
            <a routerLink="/admin/libros" routerLinkActive="bg-amber-50 text-amber-700" class="enlace-sidebar">Libros</a>
            <a routerLink="/admin/autores" routerLinkActive="bg-amber-50 text-amber-700" class="enlace-sidebar">Autores</a>
            <a routerLink="/admin/categorias" routerLinkActive="bg-amber-50 text-amber-700" class="enlace-sidebar">Categorías</a>
            <a routerLink="/admin/editoriales" routerLinkActive="bg-amber-50 text-amber-700" class="enlace-sidebar">Editoriales</a>
          </div>
        </div>

        <div class="mb-2">
          <span class="px-3 text-xs font-semibold text-stone-400 uppercase tracking-wide">
            Operaciones
          </span>
          @if (storage.esBibliotecario||storage.esAdmin) {
            <div class="mt-1 flex flex-col gap-0.5">
              <a routerLink="/admin/prestamos" routerLinkActive="bg-amber-50 text-amber-700" class="enlace-sidebar">Préstamos</a>
              <a routerLink="/admin/reservas" routerLinkActive="bg-amber-50 text-amber-700" class="enlace-sidebar">Reservas</a>
              <a routerLink="/admin/multas" routerLinkActive="bg-amber-50 text-amber-700" class="enlace-sidebar">Multas</a>
              <a routerLink="/admin/historial" routerLinkActive="bg-amber-50 text-amber-700" class="enlace-sidebar">Historial</a>
            </div>
          }
        </div>


        @if (storage.esAdmin) {
          <div class="mb-2">
            <span class="px-3 text-xs font-semibold text-stone-400 uppercase tracking-wide">
              Administración
            </span>
            <div class="mt-1 flex flex-col gap-0.5">
              <a routerLink="/admin/dashboard" routerLinkActive="bg-amber-50 text-amber-700" class="enlace-sidebar">Dashboard</a>
              <a routerLink="/admin/configuracion-multa" routerLinkActive="bg-amber-50 text-amber-700" class="enlace-sidebar">Config. multas</a>
            </div>
          </div>
        }

      </nav>

    </aside>
  `,
  styles: `
    .no-underline, a.enlace-sidebar {
      text-decoration: none;
      color: inherit;
    }
    .enlace-sidebar {
      display: block;
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
      color: #57534e;
      border-radius: 0.5rem;
      transition: all 0.2s;
      font-weight: 500;
    }
    .enlace-sidebar:hover {
      color: #b45309;
      background-color: #fffbeb;
    }
  `,
})
export class SidebarComponent {
  abierto = false;

  constructor(public storage: StorageService) {
  }
}
