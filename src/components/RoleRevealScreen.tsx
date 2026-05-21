import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { Shield, Skull, User, EyeOff, Eye } from 'lucide-react';

export const RoleRevealScreen = () => {
  const players = useGameStore(state => state.players);
  const currentRevealIndex = useGameStore(state => state.currentRevealIndex);
  const nextReveal = useGameStore(state => state.nextReveal);
  
  const [isFlipped, setIsFlipped] = useState(false);
  const currentPlayer = players[currentRevealIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      nextReveal();
    }, 400);
  };

  if (!currentPlayer) return null;

  const roleStyles = {
    KILLER: { color: '#ff3b30', name: 'KATİL', bg: 'rgba(255, 59, 48, 0.15)', shadow: '0 0 40px rgba(255, 59, 48, 0.4)' },
    DOCTOR: { color: '#0a84ff', name: 'DOKTOR', bg: 'rgba(10, 132, 255, 0.15)', shadow: '0 0 40px rgba(10, 132, 255, 0.4)' },
    VILLAGER: { color: '#34c759', name: 'KÖYLÜ', bg: 'rgba(52, 199, 89, 0.15)', shadow: '0 0 40px rgba(52, 199, 89, 0.4)' }
  };
  const activeStyle = roleStyles[currentPlayer.role];

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full max-w-sm mx-auto flex flex-col items-center justify-center flex-1 h-full"
    >
      <div className="mb-8 text-center flex-shrink-0">
        <p className="text-sm font-medium tracking-widest text-white/50 mb-1 uppercase">Sıradaki Oyuncu</p>
        <h1 className="text-4xl font-bold tracking-tight text-white">{currentPlayer.name}</h1>
      </div>

      <div className="relative w-[280px] h-[400px] perspective-1000 mx-auto" onClick={() => !isFlipped && setIsFlipped(true)}>
        <motion.div
          className="w-full h-full preserve-3d cursor-pointer"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 25 }}
        >
          {/* FRONT OF CARD */}
          <div className="absolute inset-0 backface-hidden glass flex flex-col items-center justify-center border border-white/10"
               style={{ background: 'rgba(28, 28, 30, 0.8)', borderRadius: '24px' }}>
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
              <EyeOff size={36} className="text-white/40" />
            </div>
            <h2 className="text-xl font-medium text-white/50 text-center px-4">Rolünü Görmek İçin<br/>Karta Dokun</h2>
          </div>

          {/* BACK OF CARD */}
          <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center border border-white/10"
               style={{ 
                 background: `radial-gradient(circle at center, ${activeStyle.bg} 0%, rgba(28,28,30,0.9) 100%)`,
                 boxShadow: activeStyle.shadow,
                 borderRadius: '24px',
                 transform: 'rotateY(180deg)'
               }}>
            
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }} 
              animate={{ scale: isFlipped ? 1 : 0.5, opacity: isFlipped ? 1 : 0 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mb-8 p-6 rounded-full bg-white/5 border border-white/10"
            >
              {currentPlayer.role === 'KILLER' && <Skull size={80} color={activeStyle.color} />}
              {currentPlayer.role === 'DOCTOR' && <Shield size={80} color={activeStyle.color} />}
              {currentPlayer.role === 'VILLAGER' && <User size={80} color={activeStyle.color} />}
            </motion.div>
            
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isFlipped ? 0 : 20, opacity: isFlipped ? 1 : 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold tracking-widest"
              style={{ color: activeStyle.color, textShadow: `0 0 20px ${activeStyle.color}` }}
            >
              {activeStyle.name}
            </motion.h1>
          </div>
        </motion.div>
      </div>

      <div className="h-28 mt-8 w-full flex items-center justify-center flex-shrink-0">
        <AnimatePresence mode="wait">
          {isFlipped ? (
            <motion.button 
              key="understood"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="w-full max-w-[280px] py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-[1.1rem]"
              style={{ backgroundColor: 'white', color: 'black' }}
            >
              <Eye size={22} /> Anladım, Gizli Tutacağım
            </motion.button>
          ) : (
            <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-white/40 text-center max-w-[280px]">
              Telefonu <strong className="text-white">{currentPlayer.name}</strong> isimli oyuncuya verin. Sadece o ekrana bakmalıdır.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
