import {Component, inject, OnInit, ChangeDetectorRef} from '@angular/core';
import {Router, RouterModule, ActivatedRoute} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {switchMap} from 'rxjs';
import {SidebarComponent} from '../../_shared/componentes/navegacion/sidebar.component';
import {PilaVerticalComponent} from '../../_shared/componentes/diseno/pila-vertical.component';
import {PilaHorizontalComponent} from '../../_shared/componentes/diseno/pila-horizontal.component';
import {TarjetaComponent} from '../../_shared/componentes/datos/tarjeta.component';
import {BotonComponent} from '../../_shared/componentes/botones/boton.component';
import {BotonContornoComponent} from '../../_shared/componentes/botones/boton-contorno.component';
import {TextoNormalComponent} from '../../_shared/componentes/texto/texto-normal.component';
import {TextoPequenoComponent} from '../../_shared/componentes/texto/texto-pequeno.component';
import {TextTituloComponent} from '../../_shared/componentes/texto/text-titulo.component';
import {SelectorComponent} from '../../_shared/componentes/entradas/selector.component';
import {InsigniaComponent} from '../../_shared/componentes/datos/insignia.component';
import {AlertaComponent} from '../../_shared/componentes/retroalimentacion/alerta.component';
import {MultaService} from '../../_services/multa.service';
import {PagoMultaService} from '../../_services/pago-multa.service';
import {Multa, PagoMulta} from '../../model';

@Component({
  selector: 'app-pagar-multa',
  standalone: true,
  imports: [
    SidebarComponent, PilaVerticalComponent,
    TarjetaComponent, BotonComponent, BotonContornoComponent,
    TextoNormalComponent, TextoPequenoComponent, TextTituloComponent,
    SelectorComponent,
    InsigniaComponent, AlertaComponent,
    FormsModule, RouterModule, DatePipe,
  ],
  template: `
    <div class="flex min-h-screen bg-stone-50">
      <app-sidebar></app-sidebar>

      <main class="flex-1 flex flex-col min-w-0">
        <div class="px-4 sm:px-6 py-6 max-w-3xl w-full mx-auto">

          <button
            type="button"
            (click)="volver()"
            class="text-sm text-stone-500 hover:text-stone-700 mb-4 inline-flex items-center gap-1">
            ← Volver a multas
          </button>

          <app-pila-vertical espacio="6" class="w-full">

            <app-pila-vertical espacio="1" class="w-full">
              <texto-titulo tamanio="xl">Registrar Pago de Multa</texto-titulo>
              <texto-pequeno>Registra el pago de una multa pendiente.</texto-pequeno>
            </app-pila-vertical>

            @if (cargando) {
              <div class="flex justify-center py-12">
                <svg class="animate-spin w-8 h-8 text-amber-600" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              </div>
            }

            @if (!cargando && !multa && !exito) {
              <div class="text-center py-12">
                <texto-normal>No se encontró la multa solicitada.</texto-normal>
                <app-boton
                  class="mt-4"
                  etiqueta="Ir a multas"
                  tamanio="sm"
                  (presionado)="volver()"/>
              </div>
            }

            @if (exito) {
              <app-alerta tipo="exito" mensaje="Pago registrado correctamente. La multa ha sido marcada como pagada."/>
            }

            @if (error) {
              <app-alerta tipo="error" [mensaje]="error"/>
            }

            @if (!cargando && multa && !exito) {
              <app-tarjeta titulo="Detalle de la multa" class="w-full">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  <div class="w-full">
                    <texto-pequeno color="gris">Monto total de la multa</texto-pequeno>
                    <p class="text-2xl font-bold text-red-600">S/ {{ multa.monto.toFixed(2) }}</p>
                  </div>
                  <div class="w-full">
                    <texto-pequeno color="gris">Días de mora</texto-pequeno>
                    <p class="text-2xl font-bold text-stone-800">{{ multa.diasMora }}</p>
                  </div>
                  <div class="w-full">
                    <texto-pequeno color="gris">Estado</texto-pequeno>
                    <app-insignia etiqueta="Pendiente" color="amber" variante="sutil"/>
                  </div>
                  <div class="w-full">
                    <texto-pequeno color="gris">Creada</texto-pequeno>
                    <p class="text-sm font-medium text-stone-700 mt-1">
                      {{ multa.creadoEn | date: 'dd/MM/yyyy' }}
                    </p>
                  </div>
                </div>
              </app-tarjeta>

              <!-- Formulario de pago -->
              <app-tarjeta titulo="Registrar pago" class="w-full">
                <div class="flex flex-col gap-5 w-full">

                  <div class="flex flex-col gap-1">
                    <texto-pequeno color="gris">Monto a pagar</texto-pequeno>
                    <p class="text-2xl font-bold text-green-600">S/ {{ multa.monto.toFixed(2) }}</p>
                  </div>

                  <app-selector
                    etiqueta="Método de pago"
                    id="metodo-pago"
                    [opciones]="opcionesMetodoPago"
                    [valor]="metodoPago"
                    (valorCambio)="metodoPago = $event"
                    [requerido]="true"
                    [error]="errorMetodoPago"
                    placeholder="Selecciona un método de pago..."/>

                  <div class="flex flex-col sm:flex-row gap-4 pt-2">
                    <app-boton
                      etiqueta="Registrar Pago"
                      tamanio="md"
                      variante="exito"
                      [cargando]="enviando"
                      [deshabilitado]="!formularioValido || enviando"
                      (presionado)="registrarPago()"/>
                    <app-boton-contorno
                      etiqueta="Cancelar"
                      tamanio="md"
                      (presionado)="volver()"/>
                  </div>

                </div>
              </app-tarjeta>
            }

          </app-pila-vertical>
        </div>
      </main>
    </div>
  `,
})
export class PagarMultaComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly multaService = inject(MultaService);
  private readonly pagoMultaService = inject(PagoMultaService);
  private readonly cdr = inject(ChangeDetectorRef);

  cargando: boolean = true;
  enviando: boolean = false;
  multa: Multa | null = null;
  exito: boolean = false;
  error: string = '';

  metodoPago: string = '';

  opcionesMetodoPago: Array<{ etiqueta: string; valor: string }> = [
    {etiqueta: 'Efectivo', valor: 'efectivo'},
    {etiqueta: 'Transferencia', valor: 'transferencia'},
    {etiqueta: 'Tarjeta', valor: 'tarjeta'},
  ];

  errorMetodoPago: string = '';

  get formularioValido(): boolean {
    return this.metodoPago.trim().length > 0;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.cargando = false;
      this.error = 'No se proporcionó el ID de la multa.';
      this.cdr.detectChanges();
      return;
    }
    this.cargarMulta(id);
  }

  cargarMulta(id: string): void {
    this.cargando = true;
    this.multaService.obtener(id).subscribe({
      next: (res: any) => {
        const data = res?.data ?? res;
        const multaCargada: Multa = {
          ...data,
          monto: Number(data.monto),
        };
        this.multa = multaCargada;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar multa:', err.message);
        this.error = err?.error?.mensaje ?? err?.message ?? 'Error al cargar la multa.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  registrarPago(): void {
    this.errorMetodoPago = '';

    if (!this.metodoPago) {
      this.errorMetodoPago = 'Selecciona un método de pago.';
      return;
    }
    if (!this.multa) return;

    this.enviando = true;
    this.error = '';

    this.pagoMultaService.crear({
      multaId: this.multa.id,
      montoPagado: this.multa.monto,
      metodoPago: this.metodoPago as 'efectivo' | 'transferencia' | 'tarjeta',
    }).pipe(
      switchMap(() => this.multaService.actualizar(this.multa!.id, { estado: 'pagada' })),
    ).subscribe({
      next: () => {
        this.exito = true;
        this.enviando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = err?.error?.mensaje ?? err?.message ?? 'Error al registrar el pago.';
        this.enviando = false;
        this.cdr.detectChanges();
      },
    });
  }

  volver(): void {
    this.router.navigate(['/admin/multas']);
  }
}
