import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tarjeta',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden h-full flex flex-col" [class]="clases">
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
export class TarjetaComponent {
  @Input() titulo: string = '';
  @Input() subtitulo: string = '';
  @Input() sombra: boolean = false;
  @Input() relleno: boolean = true;

  get clases(): string {
    return this.sombra ? 'shadow-md' : '';
  }
}
