import { createStore } from 'zustand/vanilla';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Injectable } from '@angular/core';

export interface FavoritoState {
  favoritosIds: string[];
  setFavoritosIds: (ids: string[]) => void;
  agregarFavoritoId: (id: string) => void;
  eliminarFavoritoId: (id: string) => void;
  esFavorito: (id: string) => boolean;
  limpiarFavoritos: () => void;
}

export const favoritoStore = createStore<FavoritoState>()(
  persist(
    (set, get) => ({
      favoritosIds: [],

      setFavoritosIds: (ids) => set({ favoritosIds: ids }),

      agregarFavoritoId: (id) => {
        const actuales = get().favoritosIds;
        if (!actuales.includes(id)) {
          set({ favoritosIds: [...actuales, id] });
        }
      },

      eliminarFavoritoId: (id) => {
        set({ favoritosIds: get().favoritosIds.filter(fid => fid !== id) });
      },

      esFavorito: (id) => get().favoritosIds.includes(id),

      limpiarFavoritos: () => set({ favoritosIds: [] }),
    }),
    {
      name: 'favorito-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        favoritosIds: state.favoritosIds,
      }),
    }
  )
);

@Injectable({ providedIn: 'root' })
export class FavoritoStoreService {
  readonly store = favoritoStore;
}
