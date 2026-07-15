import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-entrada-numero',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col gap-1">
      @if (etiqueta) {
        <label [for]="id" class="text-sm font-medium text-gray-700">{{ etiqueta }}</label>
      }
      <div class="flex items-center">
        <button type="button"
          class="px-3 py-2 border border-gray-300 rounded-l-lg text-gray-600 hover:bg-gray-50
                 transition-colors disabled:opacity-30 disabled:cursor-not-allowed select-none"
          (click)="restar()" [disabled]="deshabilitado || valor <= min">−</button>
        <input [id]="id" type="number" [ngModel]="valor" (ngModelChange)="onCambio($event)"
          [min]="min" [max]="max" [step]="paso" [disabled]="deshabilitado"
          class="w-20 text-center py-2 border-y border-gray-300 text-sm
                 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-inset
                 disabled:bg-gray-100 disabled:cursor-not-allowed [-moz-appearance:textfield]
                 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
        <button type="button"
          class="px-3 py-2 border border-gray-300 rounded-r-lg text-gray-600 hover:bg-gray-50
                 transition-colors disabled:opacity-30 disabled:cursor-not-allowed select-none"
          (click)="sumar()" [disabled]="deshabilitado || valor >= max">+</button>
      </div>
    </div>
  `,
})
export class EntradaNumeroComponent {
  @Input() etiqueta: string = '';
  @Input() id: string = '';
  @Input() min: number = 0;
  @Input() max: number = 999;
  @Input() paso: number = 1;
  @Input() valor: number = 0;
  @Input() deshabilitado: boolean = false;
  @Output() valorCambio = new EventEmitter<number>();

  sumar(): void { if (this.valor < this.max) { this.valor += this.paso; this.valorCambio.emit(this.valor); } }
  restar(): void { if (this.valor > this.min) { this.valor -= this.paso; this.valorCambio.emit(this.valor); } }

  onCambio(nuevo: number): void {
    this.valor = Math.max(this.min, Math.min(this.max, nuevo ?? this.min));
    this.valorCambio.emit(this.valor);
  }
}
