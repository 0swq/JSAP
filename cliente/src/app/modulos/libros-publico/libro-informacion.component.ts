import { Component, inject, OnInit, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../_shared/componentes/navegacion/header.component';
import { InformacionLibroService } from '../../_services/informacion-store';
import { LibroService } from '../../_services/libro.service';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';

const NUM_NODOS_POR_EXPANSION_DEFECTO = 5;
const NUM_NODOS_MAXIMO = 5;
const NUM_NODOS_MINIMO = 1;
const MAX_INTENTOS_EXPANSION = 8;
const ESPERA_MAXIMA_MS = 15000;

const LONGITUD_MAXIMA_ETIQUETA = 40;
const TAMANIO_NODO_MIN = 14;
const TAMANIO_NODO_MAX = 55;
const TAMANIO_NODO_LIBRO = 42;

const PALETA_EXPANSION: { background: string; border: string }[] = [
  { background: '#3b82f6', border: '#1d4ed8' },
  { background: '#10b981', border: '#047857' },
  { background: '#a855f7', border: '#7e22ce' },
  { background: '#ec4899', border: '#be185d' },
  { background: '#eab308', border: '#a16207' },
  { background: '#14b8a6', border: '#0f766e' },
  { background: '#ef4444', border: '#b91c1c' },
  { background: '#6366f1', border: '#4338ca' },
];

const COLOR_LIBRO = { background: '#f59e0b', border: '#b45309' };

function colorPorNivel(nivel: number): { background: string; border: string } {
  return PALETA_EXPANSION[nivel % PALETA_EXPANSION.length];
}
function truncarEtiqueta(texto: string, maxLen: number = LONGITUD_MAXIMA_ETIQUETA): string {
  const limpio = (texto ?? '').trim();
  if (limpio.length <= maxLen) return limpio;
  return `${limpio.slice(0, Math.max(maxLen - 1, 1))}…`;
}
function calcularTamanioPorCitas(citas: number): number {
  if (!citas || citas <= 0) return TAMANIO_NODO_MIN;
  const tamanio = TAMANIO_NODO_MIN + Math.sqrt(citas) * 4;
  return Math.min(Math.round(tamanio), TAMANIO_NODO_MAX);
}

@Component({
  selector: 'informacion-libro',
  standalone: true,
  imports: [HeaderComponent],
  template: `
    <div class="w-screen h-screen overflow-hidden relative bg-stone-950">
      <div class="absolute top-0 left-0 right-0 z-20">
        <app-header></app-header>
      </div>

      @if (!tieneDatos) {
        <div class="w-full h-full flex items-center justify-center">
          <p class="text-stone-400 text-sm">No hay información disponible para este libro.</p>
        </div>
      } @else {
        <div #networkContainer class="absolute inset-0" style="background-color: #ffffff;"></div>

        @if (cargandoExpansion) {
          <div class="absolute top-20 left-1/2 -translate-x-1/2 z-30 bg-stone-800 text-white text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2">
            <span>Buscando nodos relacionados...</span>
            @if (intentosExpansion > 1) {
              <span class="text-stone-300">(intento {{ intentosExpansion }}/{{ MAX_INTENTOS_EXPANSION }})</span>
            }
          </div>
        }

        @if (expansionFallidaDefinitiva) {
          <div class="absolute top-32 left-1/2 -translate-x-1/2 z-30 bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg shadow-lg flex items-center gap-3">
            <span>No se pudo expandir el nodo tras {{ MAX_INTENTOS_EXPANSION }} intentos.</span>
            <button
              type="button"
              (click)="reintentarManualmente()"
              class="font-medium underline hover:text-red-800">
              Reintentar
            </button>
          </div>
        }

        <div class="absolute top-20 right-6 bottom-6 z-20 w-[300px] bg-white/95 backdrop-blur rounded-xl border border-stone-200 shadow-xl flex flex-col overflow-hidden">
          <div class="px-4 py-3 border-b border-stone-100 shrink-0 flex items-center justify-between">
            <span class="text-sm font-semibold text-stone-800">
              Resultados ({{ listaOrdenada.length }})@if (nodoSeleccionado) {<span class="text-stone-400 font-normal"> de {{ listaCompleta.length }}</span>}
            </span>
            @if (nodoSeleccionado) {
              <button type="button" (click)="cerrarPanel()" class="text-[11px] text-amber-700 hover:text-amber-800 underline shrink-0">
                Ver todos
              </button>
            }
          </div>
          <div class="flex-1 overflow-y-auto">
            @if (listaOrdenada.length === 0) {
              <p class="text-xs text-stone-400 px-4 py-3">Este nodo no tiene conexiones.</p>
            }
            @for (item of listaOrdenada; track item.id) {
              <button
                type="button"
                (click)="seleccionarNodoPorId(item.id)"
                [title]="item.tituloCompleto"
                class="w-full text-left px-4 py-2.5 border-b border-stone-50 transition-colors"
                [class.bg-amber-50]="nodoSeleccionado?.id === item.id"
                [class.hover:bg-stone-50]="nodoSeleccionado?.id !== item.id">
                <p class="text-xs font-medium text-stone-700 leading-snug line-clamp-2">{{ item.tituloCompleto }}</p>
                <p class="text-[11px] text-stone-400 mt-0.5">{{ item.citas ?? 0 }} citas</p>
              </button>
            }
          </div>
        </div>

        @if (nodoSeleccionado) {
          <div
            class="absolute bottom-6 left-6 z-30 w-[340px] bg-white/95 backdrop-blur rounded-xl border border-stone-200 shadow-xl p-4">
            <div class="flex items-start justify-between gap-2 mb-2">
              <span class="font-semibold text-stone-800 text-sm leading-snug">{{ nodoSeleccionado.tituloCompleto }}</span>
              <button (click)="cerrarPanel()" class="text-stone-400 hover:text-stone-600 text-lg leading-none shrink-0">
                ×
              </button>
            </div>

            @if (nodoSeleccionado.anio) {
              <p class="text-xs text-stone-500 mb-1">Año: {{ nodoSeleccionado.anio }}</p>
            }

            @if (nodoSeleccionado.citas !== undefined) {
              <p class="text-xs text-stone-500 mb-2">Citas: {{ nodoSeleccionado.citas }}</p>
            }

            @if (nodoSeleccionado.doi) {
              <p class="text-xs text-stone-500 mb-3 break-all">DOI: {{ nodoSeleccionado.doi }}</p>
            }

            <div class="flex items-center flex-wrap gap-y-2">
              @if (nodoSeleccionado.url) {
                <a [href]="nodoSeleccionado.url" target="_blank" rel="noopener"
                   class="inline-block text-xs font-medium text-amber-700 hover:text-amber-800 underline">
                  Ver fuente original →
                </a>
              }
            </div>

            @if (nodoSeleccionado.group !== 'libro_catalogo') {
              <div class="mt-3 pt-3 border-t border-stone-100">
                <div class="flex items-center gap-2 mb-2">
                  <label class="text-[11px] text-stone-500" for="numNodosExpansion">
                    Nodos a expandir (1-5):
                  </label>
                  <input
                    id="numNodosExpansion"
                    type="number"
                    min="1"
                    max="5"
                    [value]="numNodosExpansion"
                    (change)="onCambiarNumNodos($event)"
                    class="w-14 text-xs border border-stone-200 rounded px-1.5 py-0.5" />
                </div>

                <button
                  type="button"
                  (click)="expandirDesdeNodo(nodoSeleccionado)"
                  [disabled]="nodosExpandidos.has(nodoSeleccionado.id) || cargandoExpansion"
                  class="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border transition-colors"
                  [class.text-stone-400]="nodosExpandidos.has(nodoSeleccionado.id)"
                  [class.border-stone-200]="nodosExpandidos.has(nodoSeleccionado.id)"
                  [class.text-blue-700]="!nodosExpandidos.has(nodoSeleccionado.id)"
                  [class.border-blue-200]="!nodosExpandidos.has(nodoSeleccionado.id)"
                  [class.hover:bg-blue-50]="!nodosExpandidos.has(nodoSeleccionado.id)">
                  @if (nodosExpandidos.has(nodoSeleccionado.id)) {
                    Ya expandido ✓
                  } @else {
                    Expandir red +
                  }
                </button>
              </div>
            }
          </div>
        }

        @if (aristaSeleccionada) {
          <div
            class="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-[380px] bg-white/95 backdrop-blur rounded-xl border border-stone-200 shadow-xl p-4">
            <div class="flex items-start justify-between gap-2 mb-2">
              <span class="text-xs font-semibold text-stone-800">Relación entre artículos</span>
              <button (click)="cerrarPanelArista()" class="text-stone-400 hover:text-stone-600 text-lg leading-none shrink-0">
                ×
              </button>
            </div>

            <p class="text-[11px] text-stone-500 mb-1 leading-snug">
              <span class="font-medium text-stone-700">{{ aristaSeleccionada.origenLabel }}</span>
              →
              <span class="font-medium text-stone-700">{{ aristaSeleccionada.destinoLabel }}</span>
            </p>

            @if (aristaSeleccionada.esCruzada) {
              <span class="inline-block text-[10px] font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-full px-2 py-0.5 mb-2">
                Relación cruzada (no esperada al expandir)
              </span>
            }

            @if (cargandoExplicacion) {
              <p class="text-xs text-stone-400 italic">Analizando relación...</p>
            } @else if (explicacionRelacion) {
              <span class="inline-block text-[10px] font-medium uppercase tracking-wide text-stone-500 mb-1">
                {{ explicacionRelacion.tipo }}
              </span>
              <p class="text-xs text-stone-600 leading-relaxed">{{ explicacionRelacion.explicacion }}</p>
            }
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .vis-tooltip {
      display: none !important;
    }
  `],
})
export class LibroInformacionComponent implements OnInit, AfterViewInit {
  private readonly router = inject(Router);
  private readonly informacionLibroService = inject(InformacionLibroService);
  private readonly libroService = inject(LibroService);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild('networkContainer', { static: false }) containerRef!: ElementRef;

  private network: Network | null = null;
  private nodesDataSet: DataSet<any> | null = null;
  private edgesDataSet: DataSet<any> | null = null;

  nodosExpandidos = new Set<string>();

  tieneDatos = false;
  nodoSeleccionado: any = null;

  listaCompleta: any[] = [];
  listaOrdenada: any[] = [];

  cargandoExpansion = false;
  numNodosExpansion = NUM_NODOS_POR_EXPANSION_DEFECTO;

  intentosExpansion = 0;
  expansionFallidaDefinitiva = false;
  readonly MAX_INTENTOS_EXPANSION = MAX_INTENTOS_EXPANSION;
  private nodoEnExpansion: any = null;

  aristaSeleccionada: { origenLabel: string; destinoLabel: string; esCruzada: boolean } | null = null;
  explicacionRelacion: { tipo: string; explicacion: string } | null = null;
  cargandoExplicacion = false;

  ngOnInit(): void {
    const { nodos } = this.informacionLibroService.store.getState();
    this.tieneDatos = Array.isArray(nodos) && nodos.length > 0;
  }

  ngAfterViewInit(): void {
    if (!this.tieneDatos) return;

    const { nodos, edges: rawEdges } = this.informacionLibroService.store.getState();

    const nodosEstilizados = nodos.map((n: any) => this.aplicarEstiloNodo(n));

    this.actualizarListaCompleta(nodosEstilizados);

    const nodes = new DataSet(nodosEstilizados);
    const edges = new DataSet(
      rawEdges.map((e: any) => this.formatearEdgeVisual(e)),
    );
    this.nodesDataSet = nodes;
    this.edgesDataSet = edges;

    this.network = new Network(this.containerRef.nativeElement, { nodes, edges }, {
      nodes: {
        shape: 'dot',
        font: {
          size: 12,
          color: '#111827',
          background: 'rgba(255,255,255,0.85)',
          strokeWidth: 0,
        },
        borderWidth: 2,
        shadow: { enabled: true, size: 8 },
      },
      edges: {
        width: 1.5,
        color: { color: '#57534e', highlight: '#f59e0b' },
        smooth: false,
      },
      layout: {
        improvedLayout: true,
      },
      physics: {
        enabled: true,
        stabilization: { iterations: 400, fit: true },
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          springLength: 300,
          springConstant: 1,
          gravitationalConstant: -300,
          avoidOverlap: 1,
          damping: 0.6,
        },
        minVelocity: 0.5,
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
      },
    });

    this.network.on('click', (params: any) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const node = this.nodesDataSet!.get(nodeId) as any;
        this.nodoSeleccionado = node ?? null;
        this.aristaSeleccionada = null;
        this.explicacionRelacion = null;

        if (node) {
          this.aplicarResaltado(nodeId);
          this.filtrarListaPorNodo(nodeId);
        }
      } else if (params.edges.length > 0) {
        const edgeId = params.edges[0];
        const edge = this.edgesDataSet!.get(edgeId) as any;
        this.abrirPanelArista(edge);
        this.nodoSeleccionado = null;
        this.quitarResaltado();
        this.listaOrdenada = this.listaCompleta;
      } else {
        this.nodoSeleccionado = null;
        this.aristaSeleccionada = null;
        this.explicacionRelacion = null;
        this.quitarResaltado();
        this.listaOrdenada = this.listaCompleta;
      }
      this.cdr.detectChanges();
    });
  }

  private formatearEdgeVisual(e: any): any {
    if (e.tipo === 'cruzada') {
      return { ...e, color: { color: '#f97316' }, dashes: true };
    }
    return e;
  }

  private obtenerTitulo(node: any): string {
    return node?.tituloCompleto ?? node?.label ?? '';
  }
  private aplicarEstiloNodo(n: any): any {
    const tituloCompleto = n.tituloCompleto ?? n.label ?? '';

    if (n.group === 'libro_catalogo') {
      return {
        ...n,
        tituloCompleto,
        label: truncarEtiqueta(tituloCompleto),
        color: COLOR_LIBRO,
        size: TAMANIO_NODO_LIBRO,
        mass: 3,
      };
    }

    const nivel = n.nivelExpansion ?? 0;
    const tamanio = calcularTamanioPorCitas(n.citas ?? 0);
    return {
      ...n,
      tituloCompleto,
      label: truncarEtiqueta(tituloCompleto),
      nivelExpansion: nivel,
      color: colorPorNivel(nivel),
      size: tamanio,
      mass: Math.max(1, tamanio / TAMANIO_NODO_MIN),
    };
  }

  onCambiarNumNodos(event: Event): void {
    const valor = Number((event.target as HTMLInputElement).value);
    if (!Number.isFinite(valor)) return;
    this.numNodosExpansion = Math.min(NUM_NODOS_MAXIMO, Math.max(NUM_NODOS_MINIMO, Math.trunc(valor)));
  }

  expandirDesdeNodo(node: any): void {
    if (!this.nodesDataSet || !this.edgesDataSet) return;
    if (this.nodosExpandidos.has(node.id) || this.cargandoExpansion) return;

    this.nodosExpandidos.add(node.id);
    this.cargandoExpansion = true;
    this.intentosExpansion = 0;
    this.expansionFallidaDefinitiva = false;
    this.nodoEnExpansion = node;
    this.cdr.detectChanges();

    this.intentarExpansion(node, this.numNodosExpansion);
  }

  reintentarManualmente(): void {
    if (!this.nodoEnExpansion) return;
    this.cargandoExpansion = true;
    this.expansionFallidaDefinitiva = false;
    this.intentosExpansion = 0;
    this.cdr.detectChanges();
    this.intentarExpansion(this.nodoEnExpansion, this.numNodosExpansion);
  }

  private intentarExpansion(node: any, numNodos: number): void {
    if (!this.nodesDataSet || !this.edgesDataSet) return;

    this.intentosExpansion++;

    const historial = {
      nodes: this.nodesDataSet.get(),
      edges: this.edgesDataSet.get(),
    };

    this.libroService.expandirNodo(this.obtenerTitulo(node), node.id, numNodos, historial).subscribe({
      next: (data: any) => {
        const nivel = this.informacionLibroService.store.getState().incrementarNivelExpansion();

        const nuevosNodos = (data?.nodes ?? []).map((n: any) =>
          this.aplicarEstiloNodo({ ...n, nivelExpansion: nivel })
        );
        const nuevosEdges = (data?.edges ?? []).map((e: any) => this.formatearEdgeVisual(e));

        if (nuevosNodos.length > 0) {
          this.nodesDataSet!.add(nuevosNodos);
          this.edgesDataSet!.add(nuevosEdges);

          const nodosCompletos = this.nodesDataSet!.get();
          const edgesCompletos = this.edgesDataSet!.get();

          this.informacionLibroService.store.getState().setNodos(nodosCompletos);
          this.informacionLibroService.store.getState().setEdges(edgesCompletos);

          this.actualizarListaCompleta(nodosCompletos);

          if (this.nodoSeleccionado?.id === node.id) {
            this.aplicarResaltado(node.id);
            this.filtrarListaPorNodo(node.id);
          }
        }

        this.cargandoExpansion = false;
        this.intentosExpansion = 0;
        this.expansionFallidaDefinitiva = false;
        this.nodoEnExpansion = null;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error(`Error al expandir nodo (intento ${this.intentosExpansion}):`, err.message);

        if (this.intentosExpansion >= MAX_INTENTOS_EXPANSION) {
          this.cargandoExpansion = false;
          this.expansionFallidaDefinitiva = true;
          this.cdr.detectChanges();
          return;
        }

        const espera = Math.min(1000 * Math.pow(2, this.intentosExpansion - 1), ESPERA_MAXIMA_MS);
        this.cdr.detectChanges();

        setTimeout(() => {
          this.intentarExpansion(node, numNodos);
        }, espera);
      },
    });
  }

  private abrirPanelArista(edge: any): void {
    if (!edge || !this.nodesDataSet) return;

    const origen = this.nodesDataSet.get(edge.from) as any;
    const destino = this.nodesDataSet.get(edge.to) as any;
    if (!origen || !destino) return;

    const tituloOrigen = this.obtenerTitulo(origen);
    const tituloDestino = this.obtenerTitulo(destino);

    this.aristaSeleccionada = {
      origenLabel: tituloOrigen,
      destinoLabel: tituloDestino,
      esCruzada: edge.tipo === 'cruzada',
    };
    this.explicacionRelacion = null;
    this.cargandoExplicacion = true;
    this.cdr.detectChanges();

    const contexto = Array.isArray(origen.contextos) && origen.contextos.length > 0
      ? origen.contextos[0]
      : undefined;

    this.libroService.explicarRelacion(tituloOrigen, tituloDestino, contexto).subscribe({
      next: (data: any) => {
        this.explicacionRelacion = data;
        this.cargandoExplicacion = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al explicar relación:', err.message);
        this.cargandoExplicacion = false;
        this.cdr.detectChanges();
      },
    });
  }

  cerrarPanelArista(): void {
    this.aristaSeleccionada = null;
    this.explicacionRelacion = null;
  }

  private actualizarListaCompleta(nodos: any[]): void {
    this.listaCompleta = [...nodos]
      .filter((n: any) => n.group !== 'libro_catalogo')
      .sort((a: any, b: any) => (b.citas ?? 0) - (a.citas ?? 0));

    if (this.nodoSeleccionado) {
      this.filtrarListaPorNodo(this.nodoSeleccionado.id);
    } else {
      this.listaOrdenada = this.listaCompleta;
    }
  }

  private filtrarListaPorNodo(nodeId: string): void {
    if (!this.network) {
      this.listaOrdenada = this.listaCompleta;
      return;
    }
    const conectados = new Set<string>(this.network.getConnectedNodes(nodeId) as string[]);
    this.listaOrdenada = this.listaCompleta.filter((n: any) => conectados.has(n.id));
  }

  private aplicarResaltado(nodeId: string): void {
    if (!this.network || !this.nodesDataSet || !this.edgesDataSet) return;

    const conectados = new Set<string>(this.network.getConnectedNodes(nodeId) as string[]);
    conectados.add(nodeId);

    const nodosActualizados = this.nodesDataSet.get().map((n: any) => ({
      id: n.id,
      opacity: conectados.has(n.id) ? 1 : 0.12,
    }));
    this.nodesDataSet.update(nodosActualizados);

    const edgesConectados = new Set<any>(this.network.getConnectedEdges(nodeId) as any[]);
    const edgesActualizados = this.edgesDataSet.get().map((e: any) => ({
      id: e.id,
      color: {
        color: e.tipo === 'cruzada' ? '#f97316' : '#57534e',
        opacity: edgesConectados.has(e.id) ? 1 : 0.08,
      },
    }));
    this.edgesDataSet.update(edgesActualizados);
  }

  private quitarResaltado(): void {
    if (!this.nodesDataSet || !this.edgesDataSet) return;

    const nodosActualizados = this.nodesDataSet.get().map((n: any) => ({ id: n.id, opacity: 1 }));
    this.nodesDataSet.update(nodosActualizados);

    const edgesActualizados = this.edgesDataSet.get().map((e: any) => ({
      id: e.id,
      color: {
        color: e.tipo === 'cruzada' ? '#f97316' : '#57534e',
        opacity: 1,
      },
    }));
    this.edgesDataSet.update(edgesActualizados);
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
    this.aristaSeleccionada = null;
    this.explicacionRelacion = null;
    this.aplicarResaltado(id);
    this.filtrarListaPorNodo(id);
    this.cdr.detectChanges();
  }

  cerrarPanel(): void {
    this.nodoSeleccionado = null;
    this.quitarResaltado();
    this.listaOrdenada = this.listaCompleta;
    this.cdr.detectChanges();
  }
}
