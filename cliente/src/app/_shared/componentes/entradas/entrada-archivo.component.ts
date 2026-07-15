import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-entrada-archivo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-1">
      @if (etiqueta) { <span class="text-sm font-medium text-gray-700">{{ etiqueta }}</span> }
      <label class="flex items-center gap-3 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer
                    transition-colors duration-150 hover:border-blue-400 hover:bg-blue-50/50"
             [class]="error ? 'border-red-300 bg-red-50/30' : 'border-gray-300 bg-gray-50/50'">
        <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        <span class="text-sm text-gray-500">{{ textoLabel }}</span>
        <input type="file" class="hidden" [accept]="aceptar" [multiple]="multiple"
               (change)="onArchivos($event)" />
      </label>
      @if (error) { <span class="text-xs text-red-500 ml-1">{{ error }}</span> }
    </div>
  `,
})
export class EntradaArchivoComponent {
  @Input() etiqueta: string = '';
  @Input() aceptar: string = '';
  @Input() multiple: boolean = false;
  @Input() pesoMaximoMB: number = 10;
  @Input() error: string = '';
  @Output() archivosSeleccionados = new EventEmitter<File[]>();

  get textoLabel(): string {
    return 'Haz clic para seleccionar' + (this.multiple ? ' archivos' : ' un archivo');
  }

  onArchivos(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const archivos = Array.from(input.files);
      const maxBytes = this.pesoMaximoMB * 1024 * 1024;
      const pesados = archivos.filter(f => f.size > maxBytes);
      if (pesados.length) {
        this.error = `Algunos archivos superan el límite de ${this.pesoMaximoMB} MB`;
        return;
      }
      this.archivosSeleccionados.emit(archivos);
    }
  }
}
