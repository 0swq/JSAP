import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alerta',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible) {
      <div class="flex items-start gap-3 px-4 py-3 rounded-lg border text-sm" [class]="clases">
        <span class="mt-0.5 flex-shrink-0">
          @switch (tipo) {
            @case ('exito') { <svg class="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> }
            @case ('error') { <svg class="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> }
            @case ('advertencia') { <svg class="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> }
            @case ('info') { <svg class="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> }
          }
        </span>
        <span class="flex-1" [class]="textoColor">{{ mensaje }}</span>
        @if (descartable) {
          <button class="flex-shrink-0 p-0.5 rounded hover:bg-black/5 transition-colors" (click)="cerrar()">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        }
      </div>
    }
  `,
})
export class AlertaComponent {
  @Input() mensaje: string = '';
  @Input() tipo: string = 'info';
  @Input() descartable: boolean = false;
  @Output() descartada = new EventEmitter<void>();
  visible: boolean = true;

  get clases(): string {
    const map: Record<string, string> = {
      exito: 'bg-green-50 border-green-300 text-green-800',
      error: 'bg-red-50 border-red-300 text-red-800',
      advertencia: 'bg-amber-50 border-amber-300 text-amber-800',
      info: 'bg-blue-50 border-blue-300 text-blue-800',
    };
    return map[this.tipo] ?? map['info'];
  }

  get textoColor(): string {
    const map: Record<string, string> = { exito: 'text-green-700', error: 'text-red-700', advertencia: 'text-amber-700', info: 'text-blue-700' };
    return map[this.tipo] ?? map['info'];
  }

  cerrar(): void { this.visible = false; this.descartada.emit(); }
}
