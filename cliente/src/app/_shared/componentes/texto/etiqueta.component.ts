import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'texto-etiqueta',
  standalone: true,
  imports: [CommonModule],
  template: `<label [for]="para" class="text-sm font-medium text-gray-700">
    <ng-content />
    @if (requerido) { <span class="text-red-500 ml-0.5">*</span> }
  </label>`,
})
export class EtiquetaComponent {
  @Input() para: string = '';
  @Input() requerido: boolean = false;
}
