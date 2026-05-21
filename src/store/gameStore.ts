import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, Player, GamePhase } from '../types';

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      players: [],
      phase: 'SETUP',
      currentRevealIndex: 0,
      nightVictimId: null,
      nightProtectedId: null,
      dayHangedId: null,

      setPlayers: (players: Player[]) => set({ players }),
      
      setPhase: (phase: GamePhase) => set({ phase }),
      
      nextReveal: () => {
        const { currentRevealIndex, players } = get();
        if (currentRevealIndex < players.length - 1) {
          set({ currentRevealIndex: currentRevealIndex + 1 });
        } else {
          set({ phase: 'NIGHT_KILLER' });
        }
      },
      
      setNightVictim: (playerId: string) => set({ nightVictimId: playerId }),
      
      setNightProtected: (playerId: string) => set({ nightProtectedId: playerId }),
      
      processNightResult: () => {
        const { players, nightVictimId, nightProtectedId } = get();
        
        let newPlayers = [...players];
        
        // If victim was chosen and not protected
        if (nightVictimId && nightVictimId !== nightProtectedId) {
          newPlayers = newPlayers.map(p => 
            p.id === nightVictimId ? { ...p, isAlive: false } : p
          );
        }
        
        // Transition to Day Result
        set({
          players: newPlayers,
          phase: 'DAY_RESULT',
          // Keep victim/protected data for the UI to show what happened, 
          // we'll clear it when moving to discussion
        });
      },
      
      setDayHanged: (playerId: string | null) => {
        const { players } = get();
        if (!playerId) {
          // No one was hanged
          set({ dayHangedId: null, phase: 'NIGHT_KILLER', nightVictimId: null, nightProtectedId: null });
          return;
        }

        const newPlayers = players.map(p => 
          p.id === playerId ? { ...p, isAlive: false } : p
        );

        set({ 
          players: newPlayers, 
          dayHangedId: playerId, 
          phase: 'NIGHT_KILLER', // Or checking win condition first
          nightVictimId: null, 
          nightProtectedId: null 
        });
      },
      
      resetGame: () => set({
        players: [],
        phase: 'SETUP',
        currentRevealIndex: 0,
        nightVictimId: null,
        nightProtectedId: null,
        dayHangedId: null,
      })
    }),
    {
      name: 'katilkim-storage', // saves to localstorage to recover from accidental close
    }
  )
);
