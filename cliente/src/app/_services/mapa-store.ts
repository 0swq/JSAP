import { createStore } from 'zustand/vanilla';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Injectable } from '@angular/core';

export interface OrdenLecturaItem {
  id: string;
  posicion: number;
  motivo: string;
}

export interface MapaState {
  termino: string;
  nodos: any[];
  edges: any[];
  ordenLectura: OrdenLecturaItem[];
  setTermino: (termino: string) => void;
  setNodos: (nodos: any[]) => void;
  setEdges: (edges: any[]) => void;
  setOrdenLectura: (ordenLectura: OrdenLecturaItem[]) => void;
}

export const mapaStore = createStore<MapaState>()(
  persist(
    (set) => ({
      termino: '',
      nodos: [],
      edges: [],
      ordenLectura: [],
      setTermino: (termino) => set({ termino }),
      setNodos: (nodos) => set({ nodos }),
      setEdges: (edges) => set({ edges }),
      setOrdenLectura: (ordenLectura) => set({ ordenLectura }),
    }),
    {
      name: 'mapa-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        termino: state.termino,
        nodos: state.nodos,
        edges: state.edges,
        ordenLectura: state.ordenLectura,
      }),
    }
  )
);

@Injectable({ providedIn: 'root' })
export class MapaService {
  readonly store = mapaStore;
}
