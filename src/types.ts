export type Role = 'KILLER' | 'DOCTOR' | 'VILLAGER';

export type GamePhase = 
  | 'SETUP'           // Entering players, roles
  | 'ROLE_REVEAL'     // Passing phone, showing cards
  | 'NIGHT_KILLER'    // Killer selecting victim
  | 'NIGHT_DOCTOR'    // Doctor selecting person to protect
  | 'DAY_RESULT'      // Showing who died
  | 'DAY_DISCUSSION'  // Timer for talking
  | 'DAY_VOTING'      // Voting to hang
  | 'GAME_OVER';      // End screen

export interface Player {
  id: string;
  name: string;
  role: Role;
  isAlive: boolean;
}

export interface GameState {
  // Config
  players: Player[];
  phase: GamePhase;
  
  // Turn State
  currentRevealIndex: number; // For role reveal phase
  nightVictimId: string | null;
  nightProtectedId: string | null;
  dayHangedId: string | null;
  
  // Actions (to be used by Zustand)
  setPlayers: (players: Player[]) => void;
  setPhase: (phase: GamePhase) => void;
  nextReveal: () => void;
  setNightVictim: (playerId: string) => void;
  setNightProtected: (playerId: string) => void;
  processNightResult: () => void;
  setDayHanged: (playerId: string | null) => void;
  resetGame: () => void;
}
