import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-casilla',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <label class="inline-flex items-center gap-2 cursor-pointer select-none"
           [class.opacity-50]="deshabilitado">
      <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-blue-600
             focus:ring-2 focus:ring-blue-200 focus:ring-offset-0 transition-colors
             disabled:cursor-not-allowed"
             [ngModel]="marcado" (ngModelChange)="onCambio($event)"
             [disabled]="deshabilitado" />
      @if (etiqueta) { <span class="text-sm text-gray-700">{{ etiqueta }}</span> }
    </label>
  `,
})
export class CasillaComponent {
  @Input() etiqueta: string = '';
  @Input() marcado: boolean = false;
  @Input() deshabilitado: boolean = false;
  @Output() marcadoCambio = new EventEmitter<boolean>();

  onCambio(nuevo: boolean): void {
    this.marcado = nuevo;
    this.marcadoCambio.emit(nuevo);
  }
}
