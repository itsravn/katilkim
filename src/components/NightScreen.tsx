import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { speak, playBell } from '../utils/audio';
import { Skull, Shield, Moon } from 'lucide-react';

export const NightScreen = () => {
  const phase = useGameStore(state => state.phase);
  const players = useGameStore(state => state.players);
  const setNightVictim = useGameStore(state => state.setNightVictim);
  const setNightProtected = useGameStore(state => state.setNightProtected);
  const processNightResult = useGameStore(state => state.processNightResult);
  const setPhase = useGameStore(state => state.setPhase);
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const alivePlayers = players.filter(p => p.isAlive);
  const killersAlive = alivePlayers.filter(p => p.role === 'KILLER').length;
  const doctorsAlive = alivePlayers.filter(p => p.role === 'DOCTOR').length;

  useEffect(() => {
    setSelectedId(null);
    setIsTransitioning(false);

    if (phase === 'NIGHT_KILLER') {
      if (killersAlive > 0) {
        playBell();
        setTimeout(() => speak("Katiller uyansın. Kimi öldüreceğinizi seçin."), 1000);
      } else {
        setPhase('NIGHT_DOCTOR');
      }
    } else if (phase === 'NIGHT_DOCTOR') {
      if (doctorsAlive > 0) {
        playBell();
        setTimeout(() => speak("Doktor uyansın. Kimi koruyacağınızı seçin."), 1000);
      } else {
        processNightResult();
      }
    }
  }, [phase, killersAlive, doctorsAlive, setPhase, processNightResult]);

  const handleConfirm = () => {
    if (!selectedId) return;
    setIsTransitioning(true);
    
    if (phase === 'NIGHT_KILLER') {
      setNightVictim(selectedId);
      speak("Katiller uyusun.");
      setTimeout(() => setPhase('NIGHT_DOCTOR'), 3000);
    } else {
      setNightProtected(selectedId);
      speak("Doktor uyusun.");
      setTimeout(() => processNightResult(), 3000);
    }
  };

  const isKillerPhase = phase === 'NIGHT_KILLER';
  const accentColor = isKillerPhase ? 'var(--primary)' : 'var(--secondary)';
  const glowColor = isKillerPhase ? 'rgba(255,59,48,0.2)' : 'rgba(10,132,255,0.2)';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[100dvh] fixed inset-0 flex flex-col items-center justify-center p-4 z-10"
      style={{ 
        background: `radial-gradient(circle at center, ${glowColor} 0%, #000000 70%)` 
      }}
    >
      <div className="glass p-6 w-full max-w-sm flex flex-col h-[75vh] border border-white/10"
           style={{ boxShadow: `0 0 80px ${glowColor}` }}>
        
        <div className="text-center mb-8 flex flex-col items-center">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }} 
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="mb-4"
          >
            {isKillerPhase ? (
              <Skull size={48} className="text-red-500 drop-shadow-[0_0_15px_rgba(255,59,48,0.8)]" />
            ) : (
              <Shield size={48} className="text-blue-500 drop-shadow-[0_0_15px_rgba(10,132,255,0.8)]" />
            )}
          </motion.div>
          
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: accentColor }}>
            {isKillerPhase ? 'Katillerin Seçimi' : 'Doktorun Seçimi'}
          </h2>
          <p className="text-white/40 mt-1 text-sm font-medium">
            {isKillerPhase ? 'Sessizce kurbanı işaretleyin' : 'Korunacak kişiyi seçin'}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-2 mb-6">
          <AnimatePresence>
            {alivePlayers.map(player => (
              <motion.button
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedId(player.id)}
                disabled={isTransitioning}
                className="text-left w-full relative overflow-hidden flex items-center justify-between"
                style={{ 
                  padding: '16px 20px',
                  backgroundColor: selectedId === player.id ? `${accentColor}33` : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${selectedId === player.id ? accentColor : 'rgba(255,255,255,0.05)'}`,
                  borderRadius: '16px',
                  transition: 'background-color 0.2s, border-color 0.2s'
                }}
              >
                <span className="font-medium text-lg relative z-10">{player.name}</span>
                {selectedId === player.id && (
                  <motion.div layoutId="selection-indicator" className="w-3 h-3 rounded-full" style={{ backgroundColor: accentColor }} />
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleConfirm}
          disabled={!selectedId || isTransitioning}
          style={{ padding: '18px', backgroundColor: selectedId ? accentColor : 'rgba(255,255,255,0.1)' }}
          className={`rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 ${isTransitioning ? 'opacity-50' : ''}`}
        >
          {isTransitioning ? <Moon className="animate-spin" size={20}/> : <Moon size={20}/>}
          {isTransitioning ? 'Uyuluyor...' : 'Onayla ve Uyu'}
        </motion.button>
      </div>
    </motion.div>
  );
};
