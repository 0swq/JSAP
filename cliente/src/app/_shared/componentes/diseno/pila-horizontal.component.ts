import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pila-horizontal',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="flex" [class]="clases"><ng-content /></div>`,
})
export class PilaHorizontalComponent {
  @Input() espacio: string = '4';
  @Input() alinear: string = 'inicio';
  @Input() justificar: string = 'inicio';
  @Input() envolver: string = 'no';

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

    const wrapMap: Record<string, string> = {
      no: 'flex-nowrap',
      si: 'flex-wrap',
      inverso: 'flex-wrap-reverse',
    };
    partes.push(wrapMap[this.envolver] ?? 'flex-nowrap');

    return partes.join(' ');
  }
}
