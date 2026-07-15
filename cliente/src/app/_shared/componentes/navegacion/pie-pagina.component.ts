import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pie-pagina',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="border-t border-gray-200 bg-gray-50 py-6 px-4 mt-auto">
      <div class="max-w-7xl mx-auto text-center text-sm text-gray-400">
        <ng-content />
      </div>
    </footer>
  `,
})
export class PiePaginaComponent {}
