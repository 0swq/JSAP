import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-divisor',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (orientacion === 'vertical') {
      <div class="flex flex-col items-center gap-3 h-full">
        <div class="flex-1 border-l border-gray-200"></div>
        @if (etiqueta) {
          <span class="text-sm text-gray-400">{{ etiqueta }}</span>
          <div class="flex-1 border-l border-gray-200"></div>
        }
      </div>
    } @else {
      <div class="flex items-center gap-3">
        <div class="flex-1 border-t border-gray-200"></div>
        @if (etiqueta) {
          <span class="text-sm text-gray-400">{{ etiqueta }}</span>
          <div class="flex-1 border-t border-gray-200"></div>
        }
      </div>
    }
  `
})
export class DivisorComponent {
  @Input() orientacion: string = 'horizontal';
  @Input() etiqueta: string = '';
}
