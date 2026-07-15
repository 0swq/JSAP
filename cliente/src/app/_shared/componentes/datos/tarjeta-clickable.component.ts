import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tarjeta-clickable',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer h-full flex flex-col
                transition-all duration-200 hover:shadow-md hover:border-gray-300 hover:-translate-y-0.5"
         [class]="relleno ? '' : ''" (click)="presionado.emit()" (keydown.enter)="presionado.emit()" tabindex="0">
      @if (titulo || subtitulo) {
        <div class="px-5 py-4 border-b border-gray-100">
          @if (titulo) { <h3 class="text-base font-semibold text-gray-800">{{ titulo }}</h3> }
          @if (subtitulo) { <p class="text-sm text-gray-500 mt-0.5">{{ subtitulo }}</p> }
        </div>
      }
      <div [class]="relleno ? 'p-5' : ''" class="flex-1 min-h-0">
        <ng-content />
      </div>
    </div>
  `,
})
export class TarjetaClickableComponent {
  @Input() titulo: string = '';
  @Input() subtitulo: string = '';
  @Input() relleno: boolean = true;
  @Output() presionado = new EventEmitter<void>();
}
