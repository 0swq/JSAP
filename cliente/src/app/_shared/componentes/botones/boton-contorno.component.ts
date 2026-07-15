import {Component, Input, Output, EventEmitter} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-boton-contorno',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="tipo"
      [disabled]="deshabilitado || cargando"
      (click)="presionado.emit()"
      [class]="clases">

      @if (cargando) {
        <svg class="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      }

      @if (!cargando && tieneIcono && posicionIcono === 'izquierda') {
        <span [innerHTML]="icono" class="w-4 h-4 inline-flex items-center justify-center shrink-0"></span>
      }

      @if (etiqueta) {
        <span>{{ etiqueta }}</span>
      }

      @if (!cargando && tieneIcono && posicionIcono === 'derecha') {
        <span [innerHTML]="icono" class="w-4 h-4 inline-flex items-center justify-center shrink-0"></span>
      }

      <ng-content/>
    </button>
  `,
})
export class BotonContornoComponent {
  @Input() etiqueta: string = '';
  @Input() icono: string = '';
  @Input() posicionIcono: 'izquierda' | 'derecha' = 'izquierda';
  @Input() cargando: boolean = false;
  @Input() deshabilitado: boolean = false;
  @Input() tamanio: 'sm' | 'md' | 'lg' = 'md';
  @Input() anchoCompleto: boolean = false;
  @Input() tipo: string = 'button';
  @Input() variante: 'primario' | 'peligro' | 'exito' | 'neutro' = 'primario';
  @Input() cuadrado: boolean = false;

  @Output() presionado = new EventEmitter<void>();

  get tieneIcono(): boolean {
    return !!this.icono && this.icono.trim().length > 0;
  }

  get clases(): string {
    const base = [
      'inline-flex items-center justify-center gap-2',
      'font-semibold border-2 bg-transparent transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-40 disabled:cursor-not-allowed',
      'select-none cursor-pointer',
      'active:scale-95',
      "rounded-none"
    ];

    const tamanios: Record<string, string> = {
      sm: 'px-3.5 py-1.5 text-xs',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-7 py-3.5 text-base',
    };

    const variantes: Record<string, string> = {
      primario: 'border-amber-700 text-amber-700 hover:bg-amber-50 focus:ring-amber-600',
      peligro:  'border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500',
      exito:    'border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500',
      neutro:   'border-stone-800 text-stone-800 hover:bg-stone-100 focus:ring-stone-600',
    };

    return [
      ...base,
      tamanios[this.tamanio] ?? tamanios['md'],
      variantes[this.variante] ?? variantes['primario'],
      this.anchoCompleto ? 'w-full' : '',
    ].join(' ');
  }
}
