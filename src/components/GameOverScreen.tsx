import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { checkWinCondition } from '../utils/gameLogic';
import { speak } from '../utils/audio';
import { Trophy, Skull, Shield, User, RotateCcw } from 'lucide-react';

export const GameOverScreen = () => {
  const players = useGameStore(state => state.players);
  const resetGame = useGameStore(state => state.resetGame);
  
  const winState = checkWinCondition(players);
  const isVillagerWin = winState === 'VILLAGERS_WIN';

  useEffect(() => {
    if (isVillagerWin) {
      speak("Oyun bitti. Bütün katiller öldürüldü. Köylüler kazandı!");
    } else {
      speak("Oyun bitti. Katiller köyü ele geçirdi. Katiller kazandı!");
    }
  }, [isVillagerWin]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      className="w-full h-[100dvh] fixed inset-0 flex flex-col p-6 z-10"
      style={{ 
        background: `radial-gradient(circle at top, ${isVillagerWin ? 'rgba(52, 199, 89, 0.2)' : 'rgba(255, 59, 48, 0.2)'} 0%, #000000 80%)` 
      }}
    >
      <div className="glass p-8 w-full max-w-md mx-auto my-auto flex flex-col items-center justify-center text-center border-0"
           style={{ boxShadow: `0 30px 60px rgba(0,0,0,0.5)` }}>
        
        <motion.div 
          initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, type: "spring" }}
        >
          {isVillagerWin ? (
            <Trophy size={80} className="text-green-500 mb-6 drop-shadow-[0_0_20px_rgba(52,199,89,0.6)]" />
          ) : (
            <Skull size={80} className="text-red-500 mb-6 drop-shadow-[0_0_20px_rgba(255,59,48,0.6)]" />
          )}
        </motion.div>
        
        <h1 className="text-xl font-medium tracking-widest text-white/50 uppercase mb-2">Oyun Bitti</h1>
        <h2 className="text-4xl font-bold tracking-tight mb-10" style={{ color: isVillagerWin ? 'var(--tertiary)' : 'var(--primary)' }}>
          {isVillagerWin ? 'KÖYLÜLER' : 'KATİLLER'} KAZANDI
        </h2>

        <div className="w-full text-left bg-white/5 border border-white/10 rounded-2xl p-5 mb-10 overflow-y-auto max-h-60">
          <h3 className="font-semibold mb-4 text-white/70 text-sm tracking-wider uppercase flex items-center gap-2">
            Son Durum Özeti
          </h3>
          
          <div className="flex flex-col gap-3">
            {players.map(p => (
              <div key={p.id} className="flex justify-between items-center">
                <span className={`font-medium text-lg ${!p.isAlive ? 'line-through text-white/30' : 'text-white'}`}>
                  {p.name}
                </span>
                <span className="flex items-center gap-2 text-sm font-medium bg-black/40 px-3 py-1 rounded-full">
                  {p.role === 'KILLER' && <><Skull size={14} className="text-red-500"/> Katil</>}
                  {p.role === 'DOCTOR' && <><Shield size={14} className="text-blue-500"/> Doktor</>}
                  {p.role === 'VILLAGER' && <><User size={14} className="text-green-500"/> Köylü</>}
                </span>
              </div>
            ))}
          </div>
        </div>

        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={resetGame}
          className="w-full bg-white text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
        >
          <RotateCcw size={20} /> Yeni Oyun Oyna
        </motion.button>
      </div>
    </motion.div>
  );
};
