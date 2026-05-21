import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { speak, playBell } from '../utils/audio';
import { MessageSquare, ArrowRight } from 'lucide-react';

export const DiscussionScreen = () => {
  const setPhase = useGameStore(state => state.setPhase);
  const [timeLeft, setTimeLeft] = useState(120);
  
  useEffect(() => {
    speak("Tartışma başlasın. İki dakikanız var.");
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      playBell();
      speak("Süre doldu. Oylama aşamasına geçiliyor.");
      setTimeout(() => setPhase('DAY_VOTING'), 3000);
      return;
    }
    
    if (timeLeft === 30) {
      speak("Son 30 saniye");
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, setPhase]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isWarning = timeLeft <= 30;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
      className="glass p-8 w-full max-w-sm mx-auto my-auto flex flex-col items-center justify-center text-center border-0"
      style={{ 
        minHeight: '65vh',
        background: 'rgba(28, 28, 30, 0.8)',
        boxShadow: isWarning ? '0 0 80px rgba(255, 59, 48, 0.2)' : '0 0 80px rgba(10, 132, 255, 0.1)'
      }}
    >
      <MessageSquare size={40} className="text-white/20 mb-8" />
      
      <h2 className="text-xl font-medium tracking-widest text-white/50 uppercase mb-2">Köy Meydanı</h2>
      <p className="text-sm text-white/30 mb-12">Aranızdaki katilleri bulmak için tartışın.</p>
      
      <div className="relative mb-16">
        <motion.div 
          animate={{ scale: isWarning ? [1, 1.05, 1] : 1 }}
          transition={{ repeat: isWarning ? Infinity : 0, duration: 1 }}
          className={`text-7xl font-bold font-mono tracking-tighter ${isWarning ? 'text-red-500' : 'text-white'}`}
          style={{ textShadow: isWarning ? '0 0 20px rgba(255, 59, 48, 0.5)' : 'none' }}
        >
          {formatTime(timeLeft)}
        </motion.div>
      </div>

      <motion.button 
        whileTap={{ scale: 0.95 }}
        onClick={() => setPhase('DAY_VOTING')}
        className="w-full bg-white/10 text-white border border-white/10 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
      >
        Tartışmayı Bitir <ArrowRight size={18} />
      </motion.button>
    </motion.div>
  );
};
