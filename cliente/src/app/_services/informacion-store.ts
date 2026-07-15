import { createStore } from 'zustand/vanilla';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Injectable } from '@angular/core';

export interface InformacionLibroState {
  libroId: string;
  nodos: any[];
  edges: any[];
  nivelExpansionActual: number;
  setLibroId: (libroId: string) => void;
  setNodos: (nodos: any[]) => void;
  setEdges: (edges: any[]) => void;
  incrementarNivelExpansion: () => number;
  reset: () => void;
}

export const informacionLibroStore = createStore<InformacionLibroState>()(
  persist(
    (set, get) => ({
      libroId: '',
      nodos: [],
      edges: [],
      nivelExpansionActual: 0,
      setLibroId: (libroId) => set({ libroId }),
      setNodos: (nodos) => set({ nodos }),
      setEdges: (edges) => set({ edges }),
      incrementarNivelExpansion: () => {
        const nuevoNivel = get().nivelExpansionActual + 1;
        set({ nivelExpansionActual: nuevoNivel });
        return nuevoNivel;
      },
      reset: () => set({ libroId: '', nodos: [], edges: [], nivelExpansionActual: 0 }),
    }),
    {
      name: 'informacion-libro-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        libroId: state.libroId,
        nodos: state.nodos,
        edges: state.edges,
        nivelExpansionActual: state.nivelExpansionActual,
      }),
    }
  )
);

@Injectable({ providedIn: 'root' })
export class InformacionLibroService {
  readonly store = informacionLibroStore;
}
