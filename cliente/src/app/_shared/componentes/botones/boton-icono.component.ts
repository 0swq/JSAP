import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-boton-icono',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button [type]="tipo" [disabled]="deshabilitado" [title]="tooltip"
      class="inline-flex items-center justify-center rounded-lg transition-all duration-200
             hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
             disabled:opacity-40 disabled:cursor-not-allowed"
      [class]="clases" (click)="presionado.emit()">
      <span [innerHTML]="icono" class="inline-block"></span>
    </button>
  `,
})
export class BotonIconoComponent {
  @Input() icono: string = '';
  @Input() tamanio: string = 'md';
  @Input() tooltip: string = '';
  @Input() deshabilitado: boolean = false;
  @Input() tipo: string = 'button';
  @Output() presionado = new EventEmitter<void>();

  get clases(): string {
    const tamanios: Record<string, string> = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12' };
    return `${tamanios[this.tamanio] ?? 'w-10 h-10'} text-gray-600`;
  }
}
