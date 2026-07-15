import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'texto-pequeno',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-content />`,
  host: { '[class]': 'clases' },
})
export class TextoPequenoComponent {
  @Input() color: string = 'gris';
  get clases(): string {
    const colores: Record<string, string> = { gris: 'text-gray-400', negro: 'text-gray-600', claro: 'text-gray-300', error: 'text-red-500', exito: 'text-green-600' };
    return `text-xs ${colores[this.color] ?? 'text-gray-400'}`;
  }
}
