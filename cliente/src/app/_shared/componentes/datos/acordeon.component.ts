import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-acordeon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="border border-gray-200 rounded-lg divide-y divide-gray-100 overflow-hidden">
      @for (item of elementos; track $index) {
        <div>
          <button type="button"
            class="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-700
                   hover:bg-gray-50 transition-colors duration-150"
            (click)="toggle($index)">
            <span>{{ item.titulo }}</span>
            <svg class="w-4 h-4 text-gray-400 transition-transform duration-200"
                 [class.rotate-180]="abiertos.has($index)"
                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          @if (abiertos.has($index)) {
            <div class="px-4 py-3 text-sm text-gray-600 bg-gray-50/50">
              {{ item.contenido }}
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class AcordeonComponent {
  @Input() elementos: Array<{ titulo: string; contenido: string }> = [];
  @Input() multiple: boolean = false;
  abiertos = new Set<number>();

  toggle(i: number): void {
    if (this.abiertos.has(i)) { this.abiertos.delete(i); }
    else {
      if (!this.multiple) this.abiertos.clear();
      this.abiertos.add(i);
    }
  }
}
