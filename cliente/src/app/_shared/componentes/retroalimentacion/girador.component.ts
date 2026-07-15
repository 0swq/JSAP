import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-girador',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center" [class]="clasesContenedor">
      <svg class="animate-spin" [class]="clasesSvg" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
    </div>
  `,
})
export class GiradorComponent {
  @Input() tamanio: string = 'md';
  @Input() color: string = 'blue';

  get clasesSvg(): string {
    const ts: Record<string, string> = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
    const cs: Record<string, string> = { blue: 'text-blue-600', gray: 'text-gray-400', white: 'text-white', green: 'text-green-600' };
    return `${ts[this.tamanio] ?? 'w-8 h-8'} ${cs[this.color] ?? 'text-blue-600'}`;
  }
  get clasesContenedor(): string { return this.tamanio === 'sm' ? '' : 'py-4'; }
}
