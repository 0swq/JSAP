import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-entrada-busqueda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col gap-1">
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input [id]="id" type="text" [placeholder]="placeholder"
          [ngModel]="valor" (ngModelChange)="onCambio($event)"
          class="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm
                 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500
                 transition-colors duration-150" />
        @if (valor) {
          <button type="button"
            class="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
            (click)="limpiar()">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        }
      </div>
    </div>
  `,
})
export class EntradaBusquedaComponent {
  @Input() id: string = '';
  @Input() placeholder: string = 'Buscar...';
  @Input() valor: string = '';
  @Output() valorCambio = new EventEmitter<string>();

  onCambio(nuevo: string): void {
    this.valor = nuevo;
    this.valorCambio.emit(nuevo);
  }

  limpiar(): void {
    this.valor = '';
    this.valorCambio.emit('');
  }
}
