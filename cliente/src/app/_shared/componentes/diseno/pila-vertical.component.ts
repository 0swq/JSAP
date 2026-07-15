import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pila-vertical',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="flex flex-col" [class]="clases"><ng-content /></div>`,
})
export class PilaVerticalComponent {
  @Input() espacio: string = '4';
  @Input() alinear: string = 'inicio';
  @Input() justificar: string = 'inicio';

  get clases(): string {
    const partes: string[] = [];

    partes.push(`gap-${this.espacio}`);

    const itemsMap: Record<string, string> = {
      inicio: 'items-start',
      centro: 'items-center',
      fin: 'items-end',
      estirar: 'items-stretch',
    };
    partes.push(itemsMap[this.alinear] ?? 'items-start');

    const justifyMap: Record<string, string> = {
      inicio: 'justify-start',
      centro: 'justify-center',
      fin: 'justify-end',
      entre: 'justify-between',
      alrededor: 'justify-around',
      uniforme: 'justify-evenly',
    };
    partes.push(justifyMap[this.justificar] ?? 'justify-start');

    return partes.join(' ');
  }
}
