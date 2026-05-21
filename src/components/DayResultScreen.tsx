import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { speak, playBell } from '../utils/audio';
import { checkWinCondition } from '../utils/gameLogic';
import { Sun, HeartPulse, Skull, ArrowRight } from 'lucide-react';

export const DayResultScreen = () => {
  const players = useGameStore(state => state.players);
  const nightVictimId = useGameStore(state => state.nightVictimId);
  const nightProtectedId = useGameStore(state => state.nightProtectedId);
  const setPhase = useGameStore(state => state.setPhase);
  
  const victim = players.find(p => p.id === nightVictimId);
  const wasProtected = nightVictimId && nightVictimId === nightProtectedId;
  const nobodyDied = !nightVictimId || wasProtected;

  useEffect(() => {
    playBell();
    let message = "Herkes uyansın. ";
    if (nobodyDied) {
      message += "Bu gece kimse ölmedi!";
    } else if (victim) {
      message += `Bu gece ${victim.name} öldürüldü!`;
    }
    setTimeout(() => speak(message), 1000);
  }, [nobodyDied, victim]);

  const handleNext = () => {
    const winState = checkWinCondition(players);
    if (winState !== 'CONTINUE') {
      setPhase('GAME_OVER');
    } else {
      setPhase('DAY_DISCUSSION');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="glass p-8 w-full max-w-sm mx-auto my-auto flex flex-col items-center justify-center text-center border-0"
      style={{ 
        minHeight: '65vh',
        boxShadow: nobodyDied ? '0 0 60px rgba(52, 199, 89, 0.15)' : '0 0 60px rgba(255, 59, 48, 0.15)',
        background: 'rgba(28, 28, 30, 0.8)'
      }}
    >
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="mb-8"
      >
        <Sun size={64} className="text-yellow-500 drop-shadow-[0_0_15px_rgba(255,204,0,0.6)]" />
      </motion.div>
      
      <h2 className="text-xl font-medium mb-12 tracking-widest text-white/50 uppercase">Sabah Oldu</h2>

      <div className="mb-16 flex-1 flex items-center justify-center">
        {nobodyDied ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="flex flex-col items-center">
            <HeartPulse size={64} className="text-green-500 mb-6 drop-shadow-[0_0_20px_rgba(52,199,89,0.5)]" />
            <h3 className="text-3xl font-bold text-white mb-2">Kimse Ölmedi!</h3>
            <p className="text-white/50">Doktor başarılı bir kurtarma yaptı.</p>
          </motion.div>
        ) : (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="flex flex-col items-center">
            <Skull size={64} className="text-red-500 mb-6 drop-shadow-[0_0_20px_rgba(255,59,48,0.5)]" />
            <h3 className="text-3xl font-bold text-white mb-2">{victim?.name} Öldü!</h3>
            <p className="text-white/50">Kasaba meydanında cansız bedeni bulundu.</p>
          </motion.div>
        )}
      </div>

      <motion.button 
        whileTap={{ scale: 0.95 }}
        onClick={handleNext}
        className="w-full bg-white text-black py-4 rounded-2xl font-semibold flex items-center justify-center gap-2"
      >
        Devam Et <ArrowRight size={20} />
      </motion.button>
    </motion.div>
  );
};
