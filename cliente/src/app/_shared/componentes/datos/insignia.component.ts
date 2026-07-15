import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-insignia',
  standalone: true,
  imports: [CommonModule],
  template: `<span [class]="clases">{{ etiqueta }}</span>`,
})
export class InsigniaComponent {
  @Input() etiqueta: string = '';
  @Input() color: string = 'blue';
  @Input() variante: string = 'solido';

  get clases(): string {
    const colores: Record<string, Record<string, string>> = {
      solido: { blue: 'bg-blue-600 text-white', gray: 'bg-gray-500 text-white', green: 'bg-green-600 text-white', red: 'bg-red-600 text-white', amber: 'bg-amber-500 text-white' },
      contorno: { blue: 'border border-blue-300 text-blue-700', gray: 'border border-gray-300 text-gray-600', green: 'border border-green-300 text-green-700', red: 'border border-red-300 text-red-700', amber: 'border border-amber-300 text-amber-700' },
      sutil: { blue: 'bg-blue-100 text-blue-700', gray: 'bg-gray-100 text-gray-600', green: 'bg-green-100 text-green-700', red: 'bg-red-100 text-red-700', amber: 'bg-amber-100 text-amber-700' },
    };
    const base = 'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full';
    return `${base} ${colores[this.variante]?.[this.color] ?? colores['solido']['blue']}`;
  }
}
