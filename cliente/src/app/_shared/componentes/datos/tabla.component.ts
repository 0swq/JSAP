import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabla',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-x-auto border border-gray-200 rounded-lg">
      @if (cargando) {
        <div class="flex justify-center py-12">
          <svg class="animate-spin w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </div>
      } @else if (!filas?.length) {
        <div class="flex flex-col items-center py-12 text-center">
          <svg class="w-12 h-12 text-gray-300 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
          <p class="text-gray-400 text-sm">{{ mensajeVacio }}</p>
        </div>
      } @else {
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              @for (col of columnas; track col.clave) {
                <th class="px-4 py-3 text-left font-medium text-gray-600 text-xs uppercase tracking-wider">{{ col.etiqueta }}</th>
              }
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            @for (fila of filas; track $index) {
              <tr class="hover:bg-gray-50/50 transition-colors">
                @for (col of columnas; track col.clave) {
                  <td class="px-4 py-3 text-gray-700 whitespace-nowrap">{{ fila[col.clave] }}</td>
                }
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
})
export class TablaComponent {
  @Input() columnas: Array<{ clave: string; etiqueta: string }> = [];
  @Input() filas: any[] = [];
  @Input() cargando: boolean = false;
  @Input() mensajeVacio: string = 'No hay datos disponibles';
}
