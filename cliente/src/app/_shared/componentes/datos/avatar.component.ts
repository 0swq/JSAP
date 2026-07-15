import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (src) {
      <img [src]="src" [alt]="nombre" class="object-cover" [class]="clases" />
    } @else {
      <div class="flex items-center justify-center font-medium bg-gray-200 text-gray-600" [class]="clases">
        {{ iniciales() }}
      </div>
    }
  `,
})
export class AvatarComponent {
  @Input() src: string = '';
  @Input() nombre: string = '';
  @Input() tamanio: string = 'md';
  @Input() forma: string = 'circulo';

  get clases(): string {
    const ts: Record<string, string> = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg' };
    const fs = this.forma === 'cuadrado' ? 'rounded-lg' : 'rounded-full';
    return `${ts[this.tamanio] ?? 'w-10 h-10 text-sm'} ${fs}`;
  }

  iniciales(): string {
    if (!this.nombre) return '?';
    const partes = this.nombre.trim().split(/\s+/);
    if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
    return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase();
  }
}
