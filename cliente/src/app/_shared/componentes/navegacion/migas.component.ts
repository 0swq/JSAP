import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-migas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="flex items-center text-sm text-gray-500">
      @for (item of elementos; track $index; let ultimo = $last) {
        @if (!ultimo) {
          <a [routerLink]="item.ruta" class="hover:text-gray-700 transition-colors no-underline">{{ item.etiqueta }}</a>
          <svg class="w-4 h-4 mx-1.5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        } @else {
          <span class="text-gray-900 font-medium">{{ item.etiqueta }}</span>
        }
      }
    </nav>
  `,
})
export class MigasComponent {
  @Input() elementos: Array<{ etiqueta: string; ruta: string }> = [];
}
