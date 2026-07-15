import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paginacion',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (totalPaginas > 1) {
      <div class="flex items-center gap-1">
        <button type="button" [disabled]="pagina <= 1"
          class="px-2.5 py-1.5 text-sm rounded-md border border-gray-200 hover:bg-gray-50
                 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          (click)="ir(pagina - 1)">Anterior</button>
        @for (p of paginas; track p) {
          @if (p === '...') {
            <span class="px-2 text-gray-400">...</span>
          } @else {
            <button type="button"
              class="w-8 h-8 text-sm rounded-md transition-colors"
              [class]="p === pagina ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-700'"
              (click)="ir(p)">{{ p }}</button>
          }
        }
        <button type="button" [disabled]="pagina >= totalPaginas"
          class="px-2.5 py-1.5 text-sm rounded-md border border-gray-200 hover:bg-gray-50
                 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          (click)="ir(pagina + 1)">Siguiente</button>
      </div>
    }
  `,
})
export class PaginacionComponent {
  @Input() pagina: number = 1;
  @Input() total: number = 0;
  @Input() tamanioPagina: number = 10;
  @Output() cambioPagina = new EventEmitter<number>();

  get totalPaginas(): number { return Math.max(1, Math.ceil(this.total / this.tamanioPagina)); }

  get paginas(): (number | string)[] {
    const t = this.totalPaginas;
    const p = this.pagina;
    const r: (number | string)[] = [];
    if (t <= 7) { for (let i = 1; i <= t; i++) r.push(i); return r; }
    r.push(1);
    if (p > 3) r.push('...');
    for (let i = Math.max(2, p - 1); i <= Math.min(t - 1, p + 1); i++) r.push(i);
    if (p < t - 2) r.push('...');
    r.push(t);
    return r;
  }

  ir(p: number | string): void {
    if (typeof p === 'number' && p >= 1 && p <= this.totalPaginas && p !== this.pagina) {
      this.pagina = p;
      this.cambioPagina.emit(p);
    }
  }
}
