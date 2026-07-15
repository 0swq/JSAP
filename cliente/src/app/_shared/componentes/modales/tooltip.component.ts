import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative inline-flex group">
      <ng-content />
      <div class="absolute z-50 px-2.5 py-1 text-xs text-white bg-gray-800 rounded-md shadow-sm
                  opacity-0 group-hover:opacity-100 transition-opacity duration-150
                  pointer-events-none whitespace-nowrap"
           [class]="clasesPosicion">
        {{ texto }}
        <div class="absolute w-2 h-2 bg-gray-800 rotate-45" [class]="clasesFlecha"></div>
      </div>
    </div>
  `,
})
export class TooltipComponent {
  @Input() texto: string = '';
  @Input() posicion: string = 'arriba';

  get clasesPosicion(): string {
    const map: Record<string, string> = {
      arriba: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
      abajo: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
      izquierda: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
      derecha: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
    };
    return map[this.posicion] ?? map['arriba'];
  }

  get clasesFlecha(): string {
    const map: Record<string, string> = {
      arriba: 'bottom-[-4px] left-1/2 -translate-x-1/2',
      abajo: 'top-[-4px] left-1/2 -translate-x-1/2',
      izquierda: 'right-[-4px] top-1/2 -translate-y-1/2',
      derecha: 'left-[-4px] top-1/2 -translate-y-1/2',
    };
    return map[this.posicion] ?? map['arriba'];
  }
}
