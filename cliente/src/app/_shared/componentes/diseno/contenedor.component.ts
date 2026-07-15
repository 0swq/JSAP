import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type AnchoMaximo = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';

@Component({
  selector: 'app-contenedor',
  standalone: true,
  imports: [CommonModule],
  template: `<div [class]="clases"><ng-content /></div>`,
})
export class ContenedorComponent {
  @Input() anchoMaximo: AnchoMaximo = '6xl';
  @Input() centrado: boolean = true;

  get clases(): string {
    const clasesArr: string[] = [];

    if (this.centrado) {
      clasesArr.push('mx-auto');
    }

    if (this.anchoMaximo !== 'none') {
      clasesArr.push(`max-w-${this.anchoMaximo}`);
    }

    return clasesArr.join(' ');
  }
}
