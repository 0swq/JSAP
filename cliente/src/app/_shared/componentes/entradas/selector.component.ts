import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col gap-1">
      @if (etiqueta) {
        <label [for]="id" class="text-sm font-medium text-gray-700">
          {{ etiqueta }}
          @if (requerido) { <span class="text-red-500">*</span> }
        </label>
      }
      <select [id]="id" [ngModel]="valor" (ngModelChange)="onCambio($event)"
        class="w-full px-3 py-2 border rounded-lg text-sm bg-white transition-colors duration-150
               focus:outline-none focus:ring-2 focus:ring-offset-0
               disabled:bg-gray-100 disabled:cursor-not-allowed"
        [class]="clasesSelect">
        @if (placeholder) { <option value="">{{ placeholder }}</option> }
        @for (op of opciones; track op.valor) {
          <option [value]="op.valor">{{ op.etiqueta }}</option>
        }
      </select>
      @if (error) { <span class="text-xs text-red-500 ml-1">{{ error }}</span> }
    </div>
  `,
})
export class SelectorComponent {
  @Input() etiqueta: string = '';
  @Input() id: string = '';
  @Input() opciones: Array<{ etiqueta: string; valor: string }> = [];
  @Input() valor: string = '';
  @Input() error: string = '';
  @Input() placeholder: string = '';
  @Input() requerido: boolean = false;
  @Output() valorCambio = new EventEmitter<string>();

  get clasesSelect(): string {
    const base = 'border-gray-300 focus:border-blue-500 focus:ring-blue-200';
    return `${base} ${this.error ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : ''}`;
  }

  onCambio(nuevo: string): void {
    this.valor = nuevo;
    this.valorCambio.emit(nuevo);
  }
}
