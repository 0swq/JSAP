import { Component, inject, OnInit, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../_shared/componentes/navegacion/header.component';
import { FooterComponent } from '../../_shared/componentes/navegacion/footer.component';
import { BotonComponent } from '../../_shared/componentes/botones/boton.component';
import { TextoNormalComponent } from '../../_shared/componentes/texto/texto-normal.component';
import { TextoPequenoComponent } from '../../_shared/componentes/texto/texto-pequeno.component';
import { MapaService } from '../../_services/mapa-store';
import { NavigationService } from '../../_services/navigation-store';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, BotonComponent, TextoNormalComponent, TextoPequenoComponent, FormsModule],
  template: `
    <div class="min-h-screen flex flex-col bg-amber-50/30">
      <app-header></app-header>

      <main class="flex-1 max-w-6xl mx-auto w-full px-4 py-10 flex flex-col">
        <div class="flex items-center justify-between gap-4 mb-8">
          <div class="flex flex-col gap-1">
            <texto-normal>Mapa de relaciones — visualización de red.</texto-normal>
            @if (termino) {
              <texto-pequeno>Búsqueda: <span class="font-medium text-stone-700">{{ termino }}</span></texto-pequeno>
            }
          </div>
          <app-boton etiqueta="Volver al catálogo" tamanio="sm" (presionado)="volverCatalogo()"/>
        </div>
        <div>¡Dale click al circulo para ver el detalle y la recomendación para lo que buscaste!</div>
        @if (!tieneDatos) {
          <div class="flex-1 flex items-center justify-center">
            <div class="text-center py-12">
              <texto-pequeno>No se hizo ninguna consulta.</texto-pequeno>
            </div>
          </div>
        } @else {
          <div class="flex-1 flex flex-row gap-4 min-h-[500px] mt-4">
            <div class="flex-[2] bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden relative min-h-[500px]">
              <div #networkContainer class="absolute inset-0"></div>
            </div>

            <div class="flex-1 min-w-[280px] max-w-[360px] bg-white rounded-xl border border-stone-200 shadow-sm p-4 flex flex-col">
              @if (!nodoSeleccionado) {
                <div class="flex-1 flex items-center justify-center text-center">
                  <texto-pequeno>Selecciona un nodo del grafo para ver su información.</texto-pequeno>
                </div>
              } @else {
                <div class="flex items-center justify-between mb-2 gap-2">
                  <span class="font-semibold text-stone-800">{{ nodoSeleccionado.tituloOriginal }}</span>
                  <span class="shrink-0 px-2 py-0.5 text-xs rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                    Relevancia: {{ nodoSeleccionado.value }}
                  </span>
                </div>

                @if (nodoSeleccionado.posicion) {
                  <span class="self-start mb-3 px-2 py-0.5 text-xs rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                    Orden de lectura: {{ nodoSeleccionado.posicion }}
                  </span>
                }

                <p class="text-sm text-stone-600 mb-3">{{ nodoSeleccionado.data?.razon ?? 'Sin descripción' }}</p>

                @if (nodoSeleccionado.motivo) {
                  <div class="mb-4 p-3 rounded-lg bg-amber-50/60 border border-amber-100">
                    <p class="text-xs font-medium text-amber-700 mb-1">¿Por qué en este orden?</p>
                    <p class="text-sm text-stone-600">{{ nodoSeleccionado.motivo }}</p>
                  </div>
                }
                <app-boton etiqueta="Ver en catálogo" tamanio="sm" (presionado)="verEnCatalogo(nodoSeleccionado.id)"/>
              }
            </div>
          </div>

          <div class="mt-4 bg-white rounded-xl border border-stone-200 shadow-sm p-4">
            <div class="flex items-center justify-between gap-4 mb-3 flex-wrap">
              <texto-pequeno>Dato: El tamaño del circulo representa su relevancia en relación a lo que buscaste</texto-pequeno>
              <texto-pequeno>El número del círculo representa el orden de lectura. Haz click en la lista para ubicar un libro:</texto-pequeno>

            </div>

            <div class="max-h-64 overflow-y-auto pr-1">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                @for (item of listaOrdenFiltrada; track item.id) {
                  <button
                    type="button"
                    (click)="seleccionarNodoPorId(item.id)"
                    class="flex items-center gap-2 text-left px-3 py-2 rounded-lg border text-sm transition-colors"
                    [class.bg-amber-50]="nodoSeleccionado?.id === item.id"
                    [class.border-amber-300]="nodoSeleccionado?.id === item.id"
                    [class.border-stone-200]="nodoSeleccionado?.id !== item.id"
                    [class.hover:bg-stone-50]="nodoSeleccionado?.id !== item.id">
                    <span class="shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-stone-100 text-stone-600 text-xs font-medium">
                      {{ item.posicion ?? '–' }}
                    </span>
                    <span class="line-clamp-1 text-stone-700">{{ item.titulo }}</span>
                  </button>
                }
              </div>

              @if (listaOrdenFiltrada.length === 0) {
                <div class="text-center py-6">
                  <texto-pequeno>No se encontraron libros con ese filtro.</texto-pequeno>
                </div>
              }
            </div>
          </div>
        }
      </main>

      <app-footer/>
    </div>
  `,
  styles: [`
    .vis-tooltip {
      display: none !important;
    }
  `],
})
export class MapaComponent implements OnInit, AfterViewInit {
  private readonly router = inject(Router);
  private readonly mapaService = inject(MapaService);
  private readonly navigationService = inject(NavigationService);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild('networkContainer', { static: false }) containerRef!: ElementRef;

  private network: Network | null = null;
  private nodesDataSet: DataSet<any> | null = null;

  tieneDatos = false;
  termino = '';
  nodoSeleccionado: any = null;
  filtroLista = '';
  listaOrden: any[] = [];

  ngOnInit(): void {
    // @ts-ignore
    const { nodos, termino } = this.mapaService.store.getState();
    this.termino = termino;
    this.tieneDatos = Array.isArray(nodos) && nodos.length > 0;
  }

  ngAfterViewInit(): void {
    if (!this.tieneDatos) return;

    // @ts-ignore
    const { nodos, edges: rawEdges, ordenLectura } = this.mapaService.store.getState();

    const ordenPorId = new Map<string, { posicion: number; motivo: string }>();
    (ordenLectura ?? []).forEach((o: any) => {
      ordenPorId.set(o.id, { posicion: o.posicion, motivo: o.motivo });
    });

    const nodosProcesados = nodos.map((n: any) => {
      const orden = ordenPorId.get(n.id);
      return {
        ...n,
        tituloOriginal: n.label,
        posicion: orden?.posicion ?? null,
        motivo: orden?.motivo ?? null,
        label: orden?.posicion ? `${orden.posicion}. ${n.label}` : n.label,
        title: undefined,
      };
    });

    this.listaOrden = [...nodosProcesados]
      .sort((a, b) => (a.posicion ?? Infinity) - (b.posicion ?? Infinity))
      .map(n => ({ id: n.id, posicion: n.posicion, titulo: n.tituloOriginal }));

    const nodes = new DataSet(nodosProcesados);
    const edges = new DataSet(rawEdges);
    this.nodesDataSet = nodes;

    const data = { nodes, edges };

    this.network = new Network(this.containerRef.nativeElement, data, {
      nodes: {
        shape: 'dot',
        size: 30,
        font: { size: 14, color: '#292524' },
        borderWidth: 2,
        shadow: { enabled: true, size: 8 },
      },
      edges: {
        width: 2,
        color: { color: '#d6d3d1', highlight: '#b45309' },
        smooth: { enabled: true, type: 'continuous', roundness: 0.5 },
      },
      physics: {
        stabilization: { iterations: 150 },
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          springLength: 220,
          springConstant: 0.05,
          gravitationalConstant: -120,
          avoidOverlap: 0.6,
        },
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
      },
    });

    this.network.on('click', (params: any) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const node = nodes.get(nodeId) as any;
        if (node?.id) {
          this.nodoSeleccionado = node;
          this.cdr.detectChanges();
        }
      } else {
        this.nodoSeleccionado = null;
        this.cdr.detectChanges();
      }
    });
  }

  get listaOrdenFiltrada() {
    const filtro = this.filtroLista.trim().toLowerCase();
    if (!filtro) return this.listaOrden;
    return this.listaOrden.filter(item => item.titulo?.toLowerCase().includes(filtro));
  }

  seleccionarNodoPorId(id: string): void {
    if (!this.network || !this.nodesDataSet) return;

    const node = this.nodesDataSet.get(id) as any;
    if (!node) return;

    this.network.selectNodes([id]);
    this.network.focus(id, {
      scale: 1,
      animation: { duration: 500, easingFunction: 'easeInOutQuad' },
    });

    this.nodoSeleccionado = node;
    this.cdr.detectChanges();
  }

  verEnCatalogo(libroId: string): void {
    this.navigationService.store.getState().seleccionarLibro(libroId);
    this.router.navigate(['/catalogo', libroId]);
  }

  volverCatalogo(): void {
    this.router.navigate(['/catalogo']);
  }
}
