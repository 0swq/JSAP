import { createStore } from 'zustand/vanilla';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Injectable } from '@angular/core';


export interface NavigationState {
  libroSeleccionadoId: string | null;
  prestamoSeleccionadoId: string | null;
  multaSeleccionadaId: string | null;
  reservaSeleccionadaId: string | null;
  usuarioSeleccionadoId: string | null;
  autorSeleccionadoId: string | null;
  ejemplarSeleccionadoId: string | null;
  categoriaSeleccionadaId: string | null;
  editorialSeleccionadaId: string | null;
  recursoDigitalSeleccionadoId: string | null;
  pagoSeleccionadoId: string | null;
  rolSeleccionadoId: string | null;
  filtroCatalogo: string | null;
  filtroPrestamos: string | null;
  seleccionarLibro: (id: string | null) => void;
  seleccionarPrestamo: (id: string | null) => void;
  seleccionarMulta: (id: string | null) => void;
  seleccionarReserva: (id: string | null) => void;
  seleccionarUsuario: (id: string | null) => void;
  seleccionarAutor: (id: string | null) => void;
  seleccionarEjemplar: (id: string | null) => void;
  seleccionarCategoria: (id: string | null) => void;
  seleccionarEditorial: (id: string | null) => void;
  seleccionarRecursoDigital: (id: string | null) => void;
  seleccionarPago: (id: string | null) => void;
  seleccionarRol: (id: string | null) => void;
  setFiltroCatalogo: (filtro: string | null) => void;
  setFiltroPrestamos: (filtro: string | null) => void;
  limpiarSelecciones: () => void;
}

export const navigationStore = createStore<NavigationState>()(
  persist(
    (set) => ({
      libroSeleccionadoId: null,
      prestamoSeleccionadoId: null,
      multaSeleccionadaId: null,
      reservaSeleccionadaId: null,
      usuarioSeleccionadoId: null,
      autorSeleccionadoId: null,
      ejemplarSeleccionadoId: null,
      categoriaSeleccionadaId: null,
      editorialSeleccionadaId: null,
      recursoDigitalSeleccionadoId: null,
      pagoSeleccionadoId: null,
      rolSeleccionadoId: null,
      filtroCatalogo: null,
      filtroPrestamos: null,

      seleccionarLibro: (id) => set({ libroSeleccionadoId: id }),
      seleccionarPrestamo: (id) => set({ prestamoSeleccionadoId: id }),
      seleccionarMulta: (id) => set({ multaSeleccionadaId: id }),
      seleccionarReserva: (id) => set({ reservaSeleccionadaId: id }),
      seleccionarUsuario: (id) => set({ usuarioSeleccionadoId: id }),
      seleccionarAutor: (id) => set({ autorSeleccionadoId: id }),
      seleccionarEjemplar: (id) => set({ ejemplarSeleccionadoId: id }),
      seleccionarCategoria: (id) => set({ categoriaSeleccionadaId: id }),
      seleccionarEditorial: (id) => set({ editorialSeleccionadaId: id }),
      seleccionarRecursoDigital: (id) => set({ recursoDigitalSeleccionadoId: id }),
      seleccionarPago: (id) => set({ pagoSeleccionadoId: id }),
      seleccionarRol: (id) => set({ rolSeleccionadoId: id }),
      setFiltroCatalogo: (filtro) => set({ filtroCatalogo: filtro }),
      setFiltroPrestamos: (filtro) => set({ filtroPrestamos: filtro }),

      limpiarSelecciones: () =>
        set({
          libroSeleccionadoId: null,
          prestamoSeleccionadoId: null,
          multaSeleccionadaId: null,
          reservaSeleccionadaId: null,
          usuarioSeleccionadoId: null,
          autorSeleccionadoId: null,
          ejemplarSeleccionadoId: null,
          categoriaSeleccionadaId: null,
          editorialSeleccionadaId: null,
          recursoDigitalSeleccionadoId: null,
          pagoSeleccionadoId: null,
          rolSeleccionadoId: null,
        }),
    }),
    {
      name: 'navigation-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        libroSeleccionadoId: state.libroSeleccionadoId,
        prestamoSeleccionadoId: state.prestamoSeleccionadoId,
        multaSeleccionadaId: state.multaSeleccionadaId,
        reservaSeleccionadaId: state.reservaSeleccionadaId,
        usuarioSeleccionadoId: state.usuarioSeleccionadoId,
        autorSeleccionadoId: state.autorSeleccionadoId,
        ejemplarSeleccionadoId: state.ejemplarSeleccionadoId,
        categoriaSeleccionadaId: state.categoriaSeleccionadaId,
        editorialSeleccionadaId: state.editorialSeleccionadaId,
        recursoDigitalSeleccionadoId: state.recursoDigitalSeleccionadoId,
        pagoSeleccionadoId: state.pagoSeleccionadoId,
        rolSeleccionadoId: state.rolSeleccionadoId,
        filtroCatalogo: state.filtroCatalogo,
        filtroPrestamos: state.filtroPrestamos,
      }),
    }
  )
);

@Injectable({ providedIn: 'root' })
export class NavigationService {
  readonly store = navigationStore;
}
