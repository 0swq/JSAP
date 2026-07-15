import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {StorageService} from '../../../_services/storage.service';
import {BotonContornoComponent} from '../botones/boton-contorno.component';
import {AvatarComponent} from '../datos/avatar.component';
import {AuthService} from "../../../_services/auth.service";

const USER_KEY = 'auth-user';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, BotonContornoComponent, AvatarComponent],
  template: `
    <nav class="bg-white border-b border-amber-100 shadow-sm px-4 py-3">
      <div class="flex items-center justify-between max-w-7xl mx-auto">

        <div class="flex items-center gap-8">
          <a routerLink="/inicio" class="flex items-center gap-2 no-underline">
            <span class="text-base font-bold text-stone-800 tracking-tight">Biblioteca JSA</span>
          </a>

          <div class="hidden md:flex items-center gap-1">
            @for (link of enlaces; track link.ruta) {
              <a [routerLink]="link.ruta"
                 class="px-3 py-1.5 text-sm text-stone-600 hover:text-amber-700 hover:bg-amber-50
                        rounded-lg transition-all duration-200 no-underline font-medium">
                {{ link.etiqueta }}
              </a>
            }
          </div>
        </div>

        <div class="hidden md:flex items-center gap-3">
          @if (!logueado) {
            <a routerLink="/login" class="no-underline">
              <app-boton-contorno etiqueta="Iniciar Sesión" tamanio="sm"/>
            </a>
          }
          @if (logueado) {
            <div class="flex items-center gap-3">
              @if (storage.esAdmin||storage.esDocente||storage.esBibliotecario) {
                <a routerLink="/admin/libros" class="no-underline">
                  <app-boton-contorno etiqueta="Gestión" tamanio="sm"/>
                </a>
              }
              <div class="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-xl">
                <app-avatar [nombre]="storage.getNombre()" tamanio="sm"/>
                <div class="flex flex-col leading-tight">
                  <span class="text-sm font-semibold text-stone-800">{{ storage.getNombre() }}</span>
                  @if (storage.getRol()) {
                    <span class="text-xs text-amber-700 font-medium">{{ storage.getRol() }}</span>
                  }
                </div>
              </div>
              <app-boton-contorno etiqueta="Salir" tamanio="sm" (presionado)="onLogout()"/>
            </div>
          }
        </div>

        <button
          type="button"
          (click)="menuAbierto = !menuAbierto"
          [attr.aria-expanded]="menuAbierto"
          aria-label="Abrir menú"
          class="md:hidden p-2 -mr-2 rounded-lg text-stone-600 hover:bg-amber-50 hover:text-amber-700
                 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-200">
          @if (!menuAbierto) {
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          }
        </button>

      </div>

      @if (menuAbierto) {
        <div class="md:hidden flex flex-col gap-1 pt-3 mt-3 border-t border-amber-100 max-w-7xl mx-auto">
          @for (link of enlaces; track link.ruta) {
            <a [routerLink]="link.ruta"
               (click)="menuAbierto = false"
               class="px-3 py-2 text-sm text-stone-600 hover:text-amber-700 hover:bg-amber-50
                      rounded-lg transition-all duration-200 no-underline font-medium">
              {{ link.etiqueta }}
            </a>
          }

          <div class="pt-2 mt-1 border-t border-amber-100">
            @if (!logueado) {
              <a routerLink="/login" (click)="menuAbierto = false" class="no-underline block">
                <app-boton-contorno etiqueta="Iniciar Sesión" tamanio="sm"/>
              </a>
            }
            @if (logueado) {
              <div class="flex flex-col gap-3 pt-1">
                @if (storage.esAdmin||storage.esDocente||storage.esBibliotecario) {
                  <a routerLink="/admin/libros" (click)="menuAbierto = false" class="no-underline block">
                    <app-boton-contorno etiqueta="Gestión" tamanio="sm"/>
                  </a>
                }
                <div class="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-xl">
                  <app-avatar [nombre]="storage.getNombre()" tamanio="sm"/>
                  <div class="flex flex-col leading-tight">
                    <span class="text-sm font-semibold text-stone-800">{{ storage.getNombre() }}</span>
                    @if (storage.getRol()) {
                      <span class="text-xs text-amber-700 font-medium">{{ storage.getRol() }}</span>
                    }
                  </div>
                </div>
                <app-boton-contorno etiqueta="Salir" tamanio="sm" (presionado)="onLogout()"/>
              </div>
            }
          </div>
        </div>
      }
    </nav>
  `,
  styles: `
    .no-underline {
      text-decoration: none;
      color: inherit;
    }
  `,
})
export class HeaderComponent implements OnInit {
  @Output() logout = new EventEmitter<void>();

  menuAbierto = false;

  enlaces = [
    {etiqueta: 'Inicio', ruta: '/inicio'},
    {etiqueta: 'Libros', ruta: '/catalogo'},
    {etiqueta: 'Mis Préstamos', ruta: '/mis-prestamos'},
    {etiqueta: 'Mis Reservas', ruta: '/mis-reservas'},
  ];

  constructor(public storage: StorageService) {
  }

  get logueado(): boolean {
    return this.storage.isLoggedIn();
  }

  ngOnInit(): void {
    if (this.storage.isLoggedIn()) {
      this.storage.fetchPerfil();
    }
  }

  onLogout(): void {
    this.storage.clean();
    window.location.reload();
  }

}
