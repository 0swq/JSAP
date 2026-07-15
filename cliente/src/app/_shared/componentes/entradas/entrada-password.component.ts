import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-entrada-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col gap-1">
      @if (etiqueta) {
        <label [for]="id" class="text-sm font-medium text-gray-700">
          {{ etiqueta }} @if (requerido) { <span class="text-red-500">*</span> }
        </label>
      }
      <div class="relative">
        <input [id]="id" [type]="mostrar ? 'text' : 'password'" [placeholder]="placeholder"
          [disabled]="deshabilitado" [ngModel]="valor" (ngModelChange)="onCambio($event)"
          class="w-full px-3 py-2 pr-10 border rounded-lg text-sm transition-colors duration-150
                 focus:outline-none focus:ring-2 focus:ring-offset-0
                 disabled:bg-gray-100 disabled:cursor-not-allowed"
          [class]="clasesInput" />
        <button type="button" tabindex="-1"
          class="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          (click)="mostrar = !mostrar">
          @if (mostrar) {
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          } @else {
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          }
        </button>
      </div>
      @if (pista && !error) { <span class="text-xs text-gray-400 ml-1">{{ pista }}</span> }
      @if (error) { <span class="text-xs text-red-500 ml-1">{{ error }}</span> }
    </div>
  `,
})
export class EntradaPasswordComponent {
  @Input() etiqueta: string = '';
  @Input() id: string = '';
  @Input() placeholder: string = '';
  @Input() valor: string = '';
  @Input() error: string = '';
  @Input() pista: string = '';
  @Input() requerido: boolean = false;
  @Input() deshabilitado: boolean = false;
  @Output() valorCambio = new EventEmitter<string>();
  mostrar: boolean = false;

  get clasesInput(): string {
    const base = 'border-gray-300 focus:border-blue-500 focus:ring-blue-200';
    const err = this.error ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : '';
    return `${base} ${err}`;
  }

  onCambio(nuevo: string): void {
    this.valor = nuevo;
    this.valorCambio.emit(nuevo);
  }
}
