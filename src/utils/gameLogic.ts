export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

import type { Player } from '../types';

export const checkWinCondition = (players: Player[]): 'KILLERS_WIN' | 'VILLAGERS_WIN' | 'CONTINUE' => {
  const alivePlayers = players.filter(p => p.isAlive);
  const killers = alivePlayers.filter(p => p.role === 'KILLER').length;
  const others = alivePlayers.length - killers;

  // Villagers win if no killers are left
  if (killers === 0) {
    return 'VILLAGERS_WIN';
  }
  
  // Killers win if they equal or outnumber the others
  // Or as user requested: minimum 1 killer vs 1 villager/doctor ends the game
  if (killers >= others) {
    return 'KILLERS_WIN';
  }

  return 'CONTINUE';
};
