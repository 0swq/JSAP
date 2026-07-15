import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="border-t border-gray-200 bg-gray-50 py-6 px-4 mt-auto">
      <div class="max-w-7xl mx-auto text-center text-sm text-gray-400">
        © {{ anio }} Biblioteca JSA. Semana 14 :(
      </div>
    </footer>
  `,
})
export class FooterComponent {
  anio = new Date().getFullYear();
}
