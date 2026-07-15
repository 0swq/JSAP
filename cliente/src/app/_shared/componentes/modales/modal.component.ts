import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (abierto) {
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50 transition-opacity" (click)="cerrar()"></div>
        <div class="relative bg-white rounded-xl shadow-xl overflow-hidden z-10 w-full mx-4 transition-all duration-200"
             [class]="clases">
          @if (titulo) {
            <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 class="text-lg font-semibold text-gray-800">{{ titulo }}</h2>
              <button type="button"
                class="p-1 rounded-md hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                (click)="cerrar()">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          }
          <div class="p-5">
            <ng-content />
          </div>
        </div>
      </div>
    }
  `,
})
export class ModalComponent {
  @Input() titulo: string = '';
  @Input() abierto: boolean = false;
  @Input() tamanio: string = 'md';
  @Output() cerrado = new EventEmitter<void>();

  get clases(): string {
    const ts: Record<string, string> = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };
    return ts[this.tamanio] ?? 'max-w-lg';
  }

  cerrar(): void { this.abierto = false; this.cerrado.emit(); }
}
