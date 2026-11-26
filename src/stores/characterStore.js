import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getCharacter } from '../data/characters';
import { useProgressStore } from './progressStore';

// Usa sessionStorage como o progressStore atual do RE:brota.
// Isso mantém compras e saldo no mesmo ciclo de persistência.
export const useCharacterStore = create(
  persist(
    (set, get) => ({
      equippedId: 'pesquisador',
      unlockedIds: ['pesquisador'],

      equipCharacter: (id) => {
        if (!get().unlockedIds.includes(id)) return false;
        set({ equippedId: id });
        return true;
      },

      purchaseCharacter: (id) => {
        const character = getCharacter(id);
        if (character.id !== id) return { ok: false, reason: 'invalid' };
        if (get().unlockedIds.includes(id)) return { ok: false, reason: 'owned' };

        const cost = character.price;
        const balance = useProgressStore.getState().leaves ?? 0;
        if (balance < cost) return { ok: false, reason: 'funds' };

        useProgressStore.setState((state) => ({
          leaves: (state.leaves ?? 0) - cost,
        }));
        set((state) => ({
          unlockedIds: [...state.unlockedIds, id],
          equippedId: id,
        }));
        return { ok: true };
      },
    }),
    {
      name: 'rebrota-characters',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        equippedId: state.equippedId,
        unlockedIds: state.unlockedIds,
      }),
    }
  )
);
