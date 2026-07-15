import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pestanias',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="border-b border-gray-200">
      <nav class="flex gap-0 -mb-px">
        @for (p of pestanias; track p.id) {
          <button type="button"
            class="px-4 py-2.5 text-sm font-medium border-b-2 transition-colors duration-150"
            [class]="p.id === pestaniaActiva
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            (click)="activar(p.id)">
            {{ p.etiqueta }}
          </button>
        }
      </nav>
    </div>
  `,
})
export class PestaniasComponent {
  @Input() pestanias: Array<{ etiqueta: string; id: string }> = [];
  @Input() pestaniaActiva: string = '';
  @Output() cambioPestania = new EventEmitter<string>();

  activar(id: string): void {
    this.pestaniaActiva = id;
    this.cambioPestania.emit(id);
  }
}
