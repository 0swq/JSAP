import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estado-vacio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center py-12 text-center px-4">
      <svg class="w-16 h-16 text-gray-300 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
      </svg>
      @if (titulo) { <p class="text-gray-500 font-medium">{{ titulo }}</p> }
      @if (descripcion) { <p class="text-sm text-gray-400 mt-1">{{ descripcion }}</p> }
      <ng-content />
    </div>
  `,
})
export class EstadoVacioComponent {
  @Input() titulo: string = 'Sin elementos';
  @Input() descripcion: string = '';
}
