import {ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SidebarComponent} from '../../_shared/componentes/navegacion/sidebar.component';
import {TarjetaComponent} from '../../_shared/componentes/datos/tarjeta.component';
import {BotonComponent} from '../../_shared/componentes/botones/boton.component';
import {BotonContornoComponent} from '../../_shared/componentes/botones/boton-contorno.component';
import {TextoNormalComponent} from '../../_shared/componentes/texto/texto-normal.component';
import {TextoPequenoComponent} from '../../_shared/componentes/texto/texto-pequeno.component';
import {TextTituloComponent} from '../../_shared/componentes/texto/text-titulo.component';
import {EntradaNumeroComponent} from '../../_shared/componentes/entradas/entrada-numero.component';
import {AlertaComponent} from '../../_shared/componentes/retroalimentacion/alerta.component';
import {ConfiguracionMulta} from '../../model';
import {ConfiguracionMultaService} from '../../_services/configuracion-multa.service';

@Component({
  selector: 'app-configuracion-multa',
  standalone: true,
  imports: [
    SidebarComponent,
    TarjetaComponent, BotonComponent, BotonContornoComponent,
    TextoNormalComponent, TextoPequenoComponent, TextTituloComponent,
    EntradaNumeroComponent, AlertaComponent,
    FormsModule, DatePipe,
  ],
  template: `
    <div class="flex min-h-screen bg-stone-50">
      <app-sidebar></app-sidebar>

      <main class="flex-1 flex flex-col min-w-0">
        <div class="px-6 py-6 max-w-7xl w-full mx-auto">
          <div class="flex flex-col gap-6">

            <texto-titulo>Configuración de Multas</texto-titulo>
            <texto-normal>Define la tarifa diaria y los días máximos de préstamo.</texto-normal>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="bg-white rounded-xl border border-stone-200 p-4">
                <texto-pequeno color="gris">Creada el</texto-pequeno>
                <p class="text-lg font-bold text-stone-800 mt-1">
                  @if (cargando) {
                    <span class="inline-block w-24 h-6 bg-stone-200 rounded animate-pulse align-middle"></span>
                  } @else if (configActual) {
                    {{ configActual.creadoEn | date: 'dd/MM/yyyy' }}
                  } @else {
                    —
                  }
                </p>
              </div>
              <div class="bg-white rounded-xl border border-stone-200 p-4">
                <texto-pequeno color="gris">Tarifa diaria actual</texto-pequeno>
                <p class="text-lg font-bold text-amber-600 mt-1">
                  @if (cargando) {
                    <span class="inline-block w-20 h-6 bg-stone-200 rounded animate-pulse align-middle"></span>
                  } @else {
                    S/ {{ tarifaDiaria.toFixed(2) }}
                  }
                </p>
              </div>
              <div class="bg-white rounded-xl border border-stone-200 p-4 hidden">
                <texto-pequeno color="gris">Días máx. préstamo</texto-pequeno>
                <p class="text-lg font-bold text-stone-800 mt-1">
                  @if (cargando) {
                    <span class="inline-block w-16 h-6 bg-stone-200 rounded animate-pulse align-middle"></span>
                  } @else {
                    {{ diasMaxPrestamo }} días
                  }
                </p>
              </div>
            </div>

            @if (exito) {
              <app-alerta tipo="exito" mensaje="Configuración actualizada correctamente."/>
            }

            @if (error) {
              <app-alerta tipo="error" [mensaje]="error"/>
            }

            <app-tarjeta titulo="Modificar configuración">
              <div class="flex flex-col gap-6">
                <app-entrada-numero
                  etiqueta="Tarifa diaria (S/)"
                  id="tarifa-diaria"
                  [min]="0.50"
                  [max]="100"
                  [paso]="0.50"
                  [valor]="tarifaDiaria"
                  [deshabilitado]="cargando"
                  (valorCambio)="tarifaDiaria = +$event"/>

                <div class="bg-stone-50 rounded-lg border border-stone-200 p-4">
                  <div class="flex flex-col gap-2">
                    <span class="text-sm font-medium text-stone-700">Resumen del ejemplo</span>
                    <div class="flex justify-between text-sm text-stone-600">
                      <span>Si se devuelve con 5 días de retraso</span>
                      <span class="text-red-600 font-medium">Multa: S/ {{ (5 * tarifaDiaria).toFixed(2) }}</span>
                    </div>
                    <div class="flex justify-between text-sm text-stone-600">
                      <span>Si se devuelve con 15 días de retraso</span>
                      <span class="text-red-600 font-medium">Multa: S/ {{ (15 * tarifaDiaria).toFixed(2) }}</span>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-4">
                  <app-boton
                    etiqueta="Guardar Cambios"
                    tamanio="md"
                    [deshabilitado]="!cambiosPendientes || cargando"
                    (presionado)="guardarConfiguracion()"/>
                </div>
              </div>
            </app-tarjeta>

          </div>
        </div>
      </main>
    </div>
  `,
})
export class ConfiguracionMultaComponent implements OnInit, OnDestroy {
  private readonly service = inject(ConfiguracionMultaService);
  private readonly cdr = inject(ChangeDetectorRef);

  configActual: ConfiguracionMulta | undefined;
  tarifaDiaria: number = 2.50;
  diasMaxPrestamo: number = 7;
  cargando: boolean = true;

  exito: boolean = false;
  error: string = '';

  private exitoTimeout: ReturnType<typeof setTimeout> | null = null;
  private cargaTimeout: ReturnType<typeof setTimeout> | null = null;

  private tarifaOriginal: number = 2.50;
  private diasOriginal: number = 7;

  get cambiosPendientes(): boolean {
    if (!this.configActual) return false;
    return (
      this.tarifaDiaria !== this.tarifaOriginal ||
      this.diasMaxPrestamo !== this.diasOriginal
    );
  }

  ngOnInit(): void {
    this.cargarConfiguracion();
  }

  ngOnDestroy(): void {
    if (this.exitoTimeout) clearTimeout(this.exitoTimeout);
    if (this.cargaTimeout) clearTimeout(this.cargaTimeout);
  }

  private cargarConfiguracion(): void {
    this.cargando = true;
    this.error = '';

    this.cargaTimeout = setTimeout(() => {
      if (this.cargando) {
        this.cargando = false;
        this.error = 'La solicitud tardó demasiado. Intenta de nuevo.';
        this.cdr.detectChanges();
      }
    }, 10000);

    this.service.listar().subscribe({
      next: (res: any) => {
        clearTimeout(this.cargaTimeout!);
        const config: ConfiguracionMulta | null = res?.data ?? null;
        if (config) {
          this.configActual = config;
          this.tarifaDiaria = Number(config.tarifaDiaria);
          this.diasMaxPrestamo = Number(config.diasMaxPrestamo);
          this.tarifaOriginal = this.tarifaDiaria;
          this.diasOriginal = this.diasMaxPrestamo;
        }
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        clearTimeout(this.cargaTimeout!);
        this.error = 'Error al cargar la configuración de multas.';
        console.error(err);
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  guardarConfiguracion(): void {
    if (!this.configActual) {
      this.error = 'No hay una configuración cargada para actualizar.';
      return;
    }

    this.cargando = true;
    this.error = '';
    this.exito = false;
    if (this.exitoTimeout) clearTimeout(this.exitoTimeout);
    this.cdr.detectChanges();

    this.service.actualizar(this.configActual.id, {
      tarifaDiaria: this.tarifaDiaria,
      diasMaxPrestamo: this.diasMaxPrestamo,
    }).subscribe({
      next: (res: any) => {
        clearTimeout(this.cargaTimeout!);
        this.tarifaOriginal = Number(this.tarifaDiaria);
        this.diasOriginal = Number(this.diasMaxPrestamo);
        this.configActual = {
          ...this.configActual!,
          tarifaDiaria: this.tarifaOriginal,
          diasMaxPrestamo: this.diasOriginal,
        };
        this.exito = true;
        this.cargando = false;
        this.cdr.detectChanges();
        this.exitoTimeout = setTimeout(() => {
          this.exito = false;
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err: any) => {
        this.error = 'Error al guardar la configuración.';
        console.error(err);
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  restablecer(): void {
    this.tarifaDiaria = this.tarifaOriginal;
    this.diasMaxPrestamo = this.diasOriginal;
    this.exito = false;
    this.error = '';
    if (this.exitoTimeout) clearTimeout(this.exitoTimeout);
    this.cdr.detectChanges();
  }
}
