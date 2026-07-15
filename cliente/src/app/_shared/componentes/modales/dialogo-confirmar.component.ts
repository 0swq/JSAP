import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialogo-confirmar',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (abierto) {
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50" (click)="cancelar()"></div>
        <div class="relative bg-white rounded-xl shadow-xl p-6 z-10 w-full max-w-sm mx-4 text-center">
          <svg class="w-12 h-12 mx-auto mb-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <p class="text-gray-700 mb-6">{{ mensaje }}</p>
          <div class="flex gap-3 justify-center">
            <button type="button" class="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700
                           hover:bg-gray-50 transition-colors" (click)="cancelar()">
              {{ etiquetaCancelar }}
            </button>
            <button type="button" class="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white
                           hover:bg-red-700 transition-colors" (click)="confirmar()">
              {{ etiquetaConfirmar }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class DialogoConfirmarComponent {
  @Input() mensaje: string = '¿Estás seguro?';
  @Input() abierto: boolean = false;
  @Input() etiquetaConfirmar: string = 'Confirmar';
  @Input() etiquetaCancelar: string = 'Cancelar';
  @Output() confirmado = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();

  confirmar(): void { this.abierto = false; this.confirmado.emit(); }
  cancelar(): void { this.abierto = false; this.cancelado.emit(); }
}
