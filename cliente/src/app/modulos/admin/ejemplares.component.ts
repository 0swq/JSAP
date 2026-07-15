import { Component } from '@angular/core';
import {PilaHorizontalComponent} from "../../_shared/componentes/diseno/pila-horizontal.component";
import {SidebarComponent} from "../../_shared/componentes/navegacion/sidebar.component";

@Component({
  selector: 'app-admin-ejemplares',
  standalone: true,
  template: `
    <app-pila-horizontal>
      <app-sidebar></app-sidebar>
      <div>

      </div>
    </app-pila-horizontal>`,
  imports: [
    PilaHorizontalComponent,
    SidebarComponent
  ]
})
export class AdminEjemplaresComponent {}
