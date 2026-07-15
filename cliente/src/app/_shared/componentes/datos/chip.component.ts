import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700
                 transition-colors duration-150 select-none">
      @if (icono) { <span [innerHTML]="icono" class="w-3.5 h-3.5 inline-block"></span> }
      <span>{{ etiqueta }}</span>
      @if (removible) {
        <button type="button" class="inline-flex items-center justify-center w-4 h-4 rounded-full
                      hover:bg-gray-300 transition-colors text-gray-400 hover:text-gray-600"
                (click)="$event.stopPropagation(); eliminado.emit()">
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      }
    </span>
  `,
})
export class ChipComponent {
  @Input() etiqueta: string = '';
  @Input() icono: string = '';
  @Input() removible: boolean = false;
  @Output() eliminado = new EventEmitter<void>();
}
