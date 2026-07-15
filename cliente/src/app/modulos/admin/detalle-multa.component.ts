import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {DatePipe} from '@angular/common';
import {SidebarComponent} from '../../_shared/componentes/navegacion/sidebar.component';
import {PilaVerticalComponent} from '../../_shared/componentes/diseno/pila-vertical.component';
import {PilaHorizontalComponent} from '../../_shared/componentes/diseno/pila-horizontal.component';
import {TarjetaComponent} from '../../_shared/componentes/datos/tarjeta.component';
import {BotonComponent} from '../../_shared/componentes/botones/boton.component';
import {BotonContornoComponent} from '../../_shared/componentes/botones/boton-contorno.component';
import {TextoNormalComponent} from '../../_shared/componentes/texto/texto-normal.component';
import {TextoPequenoComponent} from '../../_shared/componentes/texto/texto-pequeno.component';
import {TextTituloComponent} from '../../_shared/componentes/texto/text-titulo.component';
import {InsigniaComponent} from '../../_shared/componentes/datos/insignia.component';
import {AvatarComponent} from '../../_shared/componentes/datos/avatar.component';
import {AlertaComponent} from '../../_shared/componentes/retroalimentacion/alerta.component';
import {MultaService} from '../../_services/multa.service';
import {Multa, Prestamo, Ejemplar, Usuario} from '../../model';

@Component({
  selector: 'app-detalle-multa',
  standalone: true,
  imports: [
    SidebarComponent, PilaVerticalComponent, PilaHorizontalComponent,
    TarjetaComponent, BotonComponent, BotonContornoComponent,
    TextoNormalComponent, TextoPequenoComponent, TextTituloComponent,
    InsigniaComponent, AvatarComponent, AlertaComponent,
    RouterModule, DatePipe,
  ],
  template: `
    <div class="flex min-h-screen bg-stone-50">
      <app-sidebar></app-sidebar>

      <main class="flex-1 flex flex-col min-w-0">
        <div class="px-4 sm:px-6 py-6 max-w-4xl w-full mx-auto">

          <button
            type="button"
            (click)="volver()"
            class="text-sm text-stone-500 hover:text-stone-700 mb-4 inline-flex items-center gap-1">
            ← Volver a multas
          </button>

          @if (mensajeExito) {
            <app-alerta tipo="exito" [mensaje]="mensajeExito" class="mb-4 block"/>
          }
          @if (error) {
            <app-alerta tipo="error" [mensaje]="error" class="mb-4 block"/>
          }

          <app-pila-horizontal espacio="4" alinear="centro" justificar="entre" class="mb-6 flex-wrap w-full">
            <app-pila-vertical espacio="1" class="w-full">
              <texto-titulo tamanio="xl">Detalle de Multa</texto-titulo>
              <texto-pequeno>Información completa de la multa y sus entidades relacionadas.</texto-pequeno>
            </app-pila-vertical>
          </app-pila-horizontal>

          @if (cargando) {
            <div class="text-center py-16">
              <texto-normal>Cargando detalle de la multa…</texto-normal>
            </div>
          } @else if (!multa) {
            <div class="text-center py-16">
              <texto-normal>No se encontró la multa seleccionada.</texto-normal>
              <app-boton
                class="mt-4"
                etiqueta="Ir a multas"
                tamanio="sm"
                (presionado)="volver()"/>
            </div>
          } @else {
            <app-pila-vertical espacio="6" class="w-full">

              <app-pila-horizontal espacio="4" alinear="centro" justificar="entre" class="flex-col sm:flex-row !items-start sm:!items-center w-full">
                <app-pila-horizontal espacio="3" alinear="centro" class="w-full sm:w-auto">
                  @switch (multa.estado) {
                    @case ('pendiente') {
                      <app-insignia etiqueta="Pendiente" color="amber"/>
                    }
                    @case ('pagada') {
                      <app-insignia etiqueta="Pagada" color="green"/>
                    }
                    @case ('perdonada') {
                      <app-insignia etiqueta="Perdonada" color="blue"/>
                    }
                  }
                  <span class="text-xs font-mono text-stone-400">{{ multa.id }}</span>
                </app-pila-horizontal>

                @if (multa.estado === 'pendiente') {
                  <app-pila-horizontal espacio="3" class="w-full sm:w-auto">
                    <app-boton
                      class="w-full sm:w-auto"
                      etiqueta="Registrar Pago"
                      tamanio="sm"
                      (presionado)="registrarPago()"/>
                    <app-boton-contorno
                      class="w-full sm:w-auto"
                      etiqueta="Perdonar"
                      tamanio="sm"
                      (presionado)="perdonarMulta()"/>
                  </app-pila-horizontal>
                }
              </app-pila-horizontal>

              <app-tarjeta titulo="Datos de la multa" class="w-full">
                <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 w-full">
                  <div class="w-full">
                    <texto-pequeno color="gris">Monto</texto-pequeno>
                    <p class="text-xl font-bold text-red-600">S/ {{ multa.monto.toFixed(2) }}</p>
                  </div>
                  <div class="w-full">
                    <texto-pequeno color="gris">Días de mora</texto-pequeno>
                    <p class="text-xl font-bold text-stone-800">{{ multa.diasMora }}</p>
                  </div>
                  <div class="w-full">
                    <texto-pequeno color="gris">Tarifa diaria</texto-pequeno>
                    <p class="text-xl font-bold text-amber-600">
                      S/ {{ (multa.monto / multa.diasMora).toFixed(2) }}
                    </p>
                  </div>
                  <div class="w-full">
                    <texto-pequeno color="gris">Creada</texto-pequeno>
                    <p class="text-sm font-medium text-stone-700 mt-1">
                      {{ multa.creadoEn | date: 'dd/MM/yyyy' }}
                    </p>
                  </div>
                </div>
              </app-tarjeta>

              @if (libro) {
                <app-tarjeta titulo="Libro" class="w-full">
                  <div class="flex flex-col sm:flex-row items-start gap-4 w-full">

                    <div class="flex flex-col gap-1 w-full flex-1">
                      <p class="font-semibold text-stone-800">{{ libro.titulo }}</p>
                      <texto-pequeno>{{ libro.autores.join(', ') }}</texto-pequeno>
                      <texto-pequeno>{{ $any(libro.editorial)?.nombre || libro.editorial }} · {{ libro.anioPublicacion }} · ISBN {{ libro.isbn }}</texto-pequeno>
                      <div class="flex flex-wrap gap-1 mt-1">
                        @for (cat of libro.categorias; track cat) {
                          <span class="px-2 py-0.5 text-xs rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                            {{ cat }}
                          </span>
                        }
                      </div>
                    </div>
                  </div>
                </app-tarjeta>
              }

              @if (ejemplar) {
                <app-tarjeta titulo="Ejemplar" class="w-full">
                  <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 w-full">
                    <div class="w-full">
                      <texto-pequeno color="gris">Código de barras</texto-pequeno>
                      <p class="font-semibold font-mono text-stone-800">{{ ejemplar.codigoBarras }}</p>
                    </div>
                    <div class="w-full">
                      <texto-pequeno color="gris">Ubicación</texto-pequeno>
                      <p class="font-semibold text-stone-800">{{ ejemplar.ubicacion || '—' }}</p>
                    </div>
                    <div class="w-full">
                      <texto-pequeno color="gris">Estado</texto-pequeno>
                      <app-insignia
                        [etiqueta]="ejemplar.estado"
                        [color]="ejemplar.estado === 'disponible' ? 'green' : ejemplar.estado === 'prestado' ? 'amber' : 'red'"
                        variante="sutil"/>
                    </div>
                    <div class="w-full">
                      <texto-pequeno color="gris">Adquirido</texto-pequeno>
                      <p class="text-sm text-stone-700 mt-1">{{ ejemplar.fechaAdquisicion || '—' }}</p>
                    </div>
                  </div>
                </app-tarjeta>
              }

              @if (usuario) {
                <app-tarjeta titulo="Usuario" class="w-full">
                  <div class="flex flex-col sm:flex-row items-start gap-4 w-full">
                    <app-avatar [nombre]="usuario.nombre + ' ' + usuario.apellidos" tamanio="lg"/>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 w-full">
                      <div class="w-full">
                        <texto-pequeno color="gris">Nombre completo</texto-pequeno>
                        <p class="font-semibold text-stone-800">{{ usuario.nombre }} {{ usuario.apellidos }}</p>
                      </div>
                      <div class="w-full">
                        <texto-pequeno color="gris">DNI</texto-pequeno>
                        <p class="font-mono text-stone-700">{{ usuario.dni || '—' }}</p>
                      </div>
                      <div class="w-full">
                        <texto-pequeno color="gris">Correo</texto-pequeno>
                        <p class="text-stone-700">{{ usuario.correo || '—' }}</p>
                      </div>
                    </div>
                  </div>
                </app-tarjeta>
              }

              @if (prestamo) {
                <app-tarjeta titulo="Préstamo" class="w-full">
                  <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 w-full">
                    <div class="w-full">
                      <texto-pequeno color="gris">Fecha máx. devolución</texto-pequeno>
                      <p class="font-semibold text-stone-800">
                        {{ prestamo.fechaMaxDevolucion | date: 'dd/MM/yyyy' }}
                      </p>
                    </div>
                    <div class="w-full">
                      <texto-pequeno color="gris">Devuelto</texto-pequeno>
                      @if (prestamo.fechaDevolucion) {
                        <p class="font-semibold text-green-700">
                          {{ prestamo.fechaDevolucion | date: 'dd/MM/yyyy' }}
                        </p>
                      } @else {
                        <app-insignia etiqueta="No devuelto" color="red" variante="sutil"/>
                      }
                    </div>
                    <div class="w-full">
                      <texto-pequeno color="gris">Estado</texto-pequeno>
                      <app-insignia
                        [etiqueta]="prestamo.estado"
                        [color]="prestamo.estado === 'activo' ? 'amber' : prestamo.estado === 'devuelto' ? 'green' : 'red'"
                        variante="sutil"/>
                    </div>
                    <div class="w-full">
                      <texto-pequeno color="gris">Creado</texto-pequeno>
                      <p class="text-sm text-stone-700 mt-1">{{ prestamo.creadoEn | date: 'dd/MM/yyyy' }}</p>
                    </div>
                  </div>
                </app-tarjeta>
              }

            </app-pila-vertical>
          }
        </div>
      </main>
    </div>
  `,
})
export class DetalleMultaComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly multaService = inject(MultaService);
  private readonly cdr = inject(ChangeDetectorRef);

  cargando: boolean = true;
  multa: Multa | null = null;
  prestamo: Prestamo | null = null;
  ejemplar: Ejemplar | null = null;
  usuario: Usuario | null = null;
  libro: any = null;
  mensajeExito: string = '';
  error: string = '';

  ngOnInit(): void {
    const idMulta = this.route.snapshot.paramMap.get('id');
    if (idMulta) {
      this.cargarDetalle(idMulta);
    } else {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  cargarDetalle(idMulta: string): void {
    this.error = '';
    this.cargando = true;

    this.multaService.obtener(idMulta).subscribe({
      next: (res: any) => {
        const data = res?.data ?? res;

        this.multa = {
          id: data.id,
          prestamoId: data.prestamoId,
          monto: Number(data.monto),
          diasMora: Number(data.diasMora),
          estado: data.estado,
          creadoEn: data.creadoEn,
        };

        const prestamoData = data.prestamo;
        if (prestamoData) {
          this.prestamo = {
            id: prestamoData.id,
            usuarioId: prestamoData.usuarioId,
            ejemplarId: prestamoData.ejemplarId,
            fechaMaxDevolucion: prestamoData.fechaMaxDevolucion,
            fechaDevolucion: prestamoData.fechaDevolucion ?? undefined,
            estado: prestamoData.estado,
            creadoEn: prestamoData.creadoEn,
          };

          const ejemplarData = prestamoData.ejemplar;
          if (ejemplarData) {
            this.ejemplar = {
              id: ejemplarData.id,
              libroId: ejemplarData.libroId,
              codigoBarras: ejemplarData.codigoBarras,
              estado: ejemplarData.estado,
              ubicacion: ejemplarData.ubicacion ?? undefined,
              fechaAdquisicion: ejemplarData.fechaAdquisicion ?? undefined,
              creadoEn: ejemplarData.creadoEn,
            };

            const libroData = ejemplarData.libro;
            if (libroData) {
              this.libro = {
                id: libroData.id,
                titulo: libroData.titulo,
                isbn: libroData.isbn ?? undefined,
                anioPublicacion: libroData.anioPublicacion ?? undefined,
                idioma: libroData.idioma ?? undefined,
                foto: libroData.fotoUrl ?? undefined,
                editorial: libroData.editorial ?? undefined,
                autores: (libroData.autores || []).map((la: any) =>
                  la.autor ? [la.autor.nombre, la.autor.apellidos].filter(Boolean).join(' ') : ''
                ),
                categorias: (libroData.categorias || []).map((lc: any) => lc.categoria?.nombre || ''),
              };
            }
          }

          const usuarioData = prestamoData.usuario;
          if (usuarioData) {
            this.usuario = {
              id: usuarioData.id,
              rolId: usuarioData.rolId || '',
              nombre: usuarioData.nombre ?? undefined,
              apellidos: usuarioData.apellidos ?? undefined,
              dni: usuarioData.dni ?? undefined,
              correo: usuarioData.correo ?? undefined,
              creadoEn: usuarioData.creadoEn || '',
            };
          }
        }

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = err?.error?.mensaje ?? err?.message ?? 'Error al cargar el detalle de la multa.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  registrarPago(): void {
    if (!this.multa) return;
    this.router.navigate(['/admin/multas/pagar', this.multa.id]);
  }

  perdonarMulta(): void {
    if (!this.multa || this.multa.estado !== 'pendiente') return;
    if (!confirm('¿Estás seguro de que deseas perdonar esta multa?')) return;

    this.error = '';
    this.mensajeExito = '';

    this.multaService.actualizar(this.multa.id, {estado: 'perdonada'}).subscribe({
      next: () => {
        this.multa!.estado = 'perdonada';
        this.mensajeExito = 'Multa perdonada correctamente.';
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = err?.error?.mensaje ?? err?.message ?? 'Error al perdonar la multa.';
        this.cdr.detectChanges();
      },
    });
  }

  volver(): void {
    this.router.navigate(['/admin/multas']);
  }
}
