import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-barra-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-white border-b border-gray-200 px-4 py-3">
      <div class="flex items-center justify-between max-w-7xl mx-auto">
        <a [routerLink]="rutaMarca ?? '/'" class="text-lg font-bold text-gray-800 no-underline">
          {{ marca }}
        </a>
        <div class="flex items-center gap-6">
          @for (link of enlaces; track link.ruta) {
            <a [routerLink]="link.ruta"
               class="text-sm text-gray-600 hover:text-gray-900 transition-colors no-underline
                      font-medium px-1 py-0.5">
              {{ link.etiqueta }}
            </a>
          }
        </div>
      </div>
    </nav>
  `,
})
export class BarraNavComponent {
  @Input() marca: string = '';
  @Input() enlaces: Array<{ etiqueta: string; ruta: string }> = [];
  @Input() rutaMarca: string = '/';
}
