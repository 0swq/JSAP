import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'texto-titulo',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-content />`,
  host: { '[class]': 'clases' },
})
export class TextTituloComponent {
  @Input() nivel: string = 'h2';
  @Input() tamanio: string = '2xl';
  @Input() peso: string = 'negrita';
  @Input() color: string = 'negro';

  get clases(): string {
    const pesoMap: Record<string, string> = { fino: 'font-thin', ligero: 'font-light', normal: 'font-normal', medio: 'font-medium', seminegrita: 'font-semibold', negrita: 'font-bold', extranegrita: 'font-extrabold' };
    const colorMap: Record<string, string> = { negro: 'text-gray-900', gris: 'text-gray-600', claro: 'text-gray-400', blanco: 'text-white', primario: 'text-blue-600', error: 'text-red-600' };
    return `text-${this.tamanio} ${pesoMap[this.peso] ?? 'font-bold'} ${colorMap[this.color] ?? 'text-gray-900'}`;
  }
}
