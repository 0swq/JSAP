import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'texto-normal',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-content />`,
  host: { '[class]': 'clases' },
})
export class TextoNormalComponent {
  @Input() tamanio: string = 'base';
  @Input() color: string = 'negro';
  @Input() peso: string = 'normal';
  @Input() truncar: boolean = false;

  get clases(): string {
    const colorMap: Record<string, string> = { negro: 'text-gray-800', gris: 'text-gray-500', claro: 'text-gray-300', blanco: 'text-white', primario: 'text-blue-600', error: 'text-red-500' };
    const pesoMap: Record<string, string> = { fino: 'font-thin', ligero: 'font-light', normal: 'font-normal', medio: 'font-medium', negrita: 'font-bold' };
    return `text-${this.tamanio} ${colorMap[this.color] ?? 'text-gray-800'} ${pesoMap[this.peso] ?? 'font-normal'} ${this.truncar ? 'truncate' : ''}`;
  }
}
