import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-esqueleto',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="animate-pulse bg-gray-200" [class]="clases"></div>`,
})
export class EsqueletoComponent {
  @Input() ancho: string = 'full';
  @Input() alto: string = '4';
  @Input() redondeado: boolean = true;

  get clases(): string {
    return `w-${this.ancho === 'full' ? 'full' : `[${this.ancho}]`} h-${this.alto} ${this.redondeado ? 'rounded-lg' : ''}`;
  }
}
