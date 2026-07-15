import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-entrada-imagen',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-1">
      @if (etiqueta) { <span class="text-sm font-medium text-gray-700">{{ etiqueta }}</span> }
      @if (previewUrl) {
        <div class="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 group">
          <img [src]="previewUrl" class="w-full h-full object-cover" alt="Preview" />
          <button type="button"
            class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
            (click)="remover()">
            <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      } @else {
        <label class="flex flex-col items-center gap-2 px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg
                      cursor-pointer transition-colors hover:border-blue-400 hover:bg-blue-50/50">
          <svg class="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          <span class="text-sm text-gray-500">Subir imagen</span>
          <input type="file" class="hidden" accept="image/*" (change)="onImagen($event)" />
        </label>
      }
    </div>
  `,
})
export class EntradaImagenComponent {
  @Input() etiqueta: string = '';
  @Output() imagenSeleccionada = new EventEmitter<File | null>();
  previewUrl: string | null = null;

  onImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      this.previewUrl = url;
      this.imagenSeleccionada.emit(file);
    }
  }

  remover(): void {
    this.previewUrl = null;
    this.imagenSeleccionada.emit(null);
  }
}
