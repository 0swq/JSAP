import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cajon',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (abierto) {
      <div class="fixed inset-0 z-50">
        <div class="absolute inset-0 bg-black/50" (click)="cerrar()"></div>
        <div class="absolute top-0 h-full bg-white shadow-xl z-10 transition-transform duration-300 ease-in-out overflow-auto"
             [class]="clases">
          <div class="p-5">
            <ng-content />
          </div>
        </div>
      </div>
    }
  `,
})
export class CajonComponent {
  @Input() abierto: boolean = false;
  @Input() lado: string = 'derecha';
  @Input() tamanio: string = 'sm';
  @Output() cerrado = new EventEmitter<void>();

  get clases(): string {
    const ladoCls = this.lado === 'izquierda' ? 'left-0' : 'right-0';
    const ts: Record<string, string> = { sm: 'w-80', md: 'w-96', lg: 'w-[480px]' };
    return `${ladoCls} ${ts[this.tamanio] ?? 'w-80'}`;
  }
  cerrar(): void { this.abierto = false; this.cerrado.emit(); }
}
