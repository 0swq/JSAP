import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-interruptor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <label class="inline-flex items-center gap-2 cursor-pointer select-none"
           [class.opacity-50]="deshabilitado">
      <button type="button" role="switch" [attr.aria-checked]="activo"
        class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200
               focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-1"
        [class]="activo ? 'bg-blue-600' : 'bg-gray-300'"
        [disabled]="deshabilitado"
        (click)="onCambio(!activo)">
        <span class="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 shadow-sm"
              [class]="activo ? 'translate-x-[18px]' : 'translate-x-[2px]'">
        </span>
      </button>
      @if (etiqueta) { <span class="text-sm text-gray-700">{{ etiqueta }}</span> }
    </label>
  `,
})
export class InterruptorComponent {
  @Input() etiqueta: string = '';
  @Input() activo: boolean = false;
  @Input() deshabilitado: boolean = false;
  @Output() activoCambio = new EventEmitter<boolean>();

  onCambio(nuevo: boolean): void {
    this.activo = nuevo;
    this.activoCambio.emit(nuevo);
  }
}
