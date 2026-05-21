import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { checkWinCondition } from '../utils/gameLogic';
import { speak } from '../utils/audio';
import { Gavel, Skull } from 'lucide-react';

export const VotingScreen = () => {
  const players = useGameStore(state => state.players);
  const setDayHanged = useGameStore(state => state.setDayHanged);
  const setPhase = useGameStore(state => state.setPhase);
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const alivePlayers = players.filter(p => p.isAlive);

  const handleConfirm = () => {
    setIsTransitioning(true);
    
    if (selectedId === 'nobody') {
      speak("Bugün kimse asılmadı. Herkes uyusun.");
      setTimeout(() => {
        setDayHanged(null);
      }, 3000);
      return;
    }

    const victim = players.find(p => p.id === selectedId);
    if (!victim) return;

    speak(`${victim.name} asılarak öldürüldü. Onun rolü: ${victim.role === 'KILLER' ? 'Katil' : victim.role === 'DOCTOR' ? 'Doktor' : 'Köylü'} idi.`);
    
    setTimeout(() => {
      const tempPlayers = players.map(p => p.id === selectedId ? { ...p, isAlive: false } : p);
      const winState = checkWinCondition(tempPlayers);
      
      setDayHanged(selectedId);
      
      if (winState !== 'CONTINUE') {
        setPhase('GAME_OVER');
      } else {
        speak("Herkes uyusun.");
      }
    }, 5000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="w-full h-[100dvh] fixed inset-0 flex flex-col items-center justify-center p-4 z-10"
      style={{ background: `radial-gradient(circle at center, rgba(94, 92, 230, 0.15) 0%, #000000 70%)` }}
    >
      <div className="glass p-6 w-full max-w-sm flex flex-col h-[75vh] border border-white/10"
           style={{ boxShadow: `0 0 60px rgba(94, 92, 230, 0.1)` }}>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <Gavel size={32} className="text-[var(--accent)]" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Halk Oylaması</h2>
          <p className="text-white/40 mt-1 text-sm font-medium">Köyün kararıyla kim asılacak?</p>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-2 mb-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedId('nobody')}
            disabled={isTransitioning}
            className="text-left w-full relative overflow-hidden flex items-center justify-between"
            style={{ 
              padding: '16px 20px',
              backgroundColor: selectedId === 'nobody' ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${selectedId === 'nobody' ? 'var(--accent)' : 'rgba(255,255,255,0.05)'}`,
              borderRadius: '16px',
              transition: 'all 0.2s'
            }}
          >
            <span className="font-medium text-lg">Kimse Asılmasın</span>
            {selectedId === 'nobody' && <div className="w-3 h-3 rounded-full bg-white" />}
          </motion.button>

          <AnimatePresence>
            {alivePlayers.map(player => (
              <motion.button
                key={player.id}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedId(player.id)}
                disabled={isTransitioning}
                className="text-left w-full relative overflow-hidden flex items-center justify-between"
                style={{ 
                  padding: '16px 20px',
                  backgroundColor: selectedId === player.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${selectedId === player.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)'}`,
                  borderRadius: '16px',
                  transition: 'all 0.2s'
                }}
              >
                <span className="font-medium text-lg">{player.name}</span>
                {selectedId === player.id && <Skull size={18} className="text-white" />}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleConfirm}
          disabled={!selectedId || isTransitioning}
          style={{ padding: '18px', backgroundColor: selectedId ? 'var(--accent)' : 'rgba(255,255,255,0.1)' }}
          className={`rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 ${isTransitioning ? 'opacity-50' : ''}`}
        >
          {isTransitioning ? 'İnfaz Ediliyor...' : 'Kararı Onayla'}
        </motion.button>
      </div>
    </motion.div>
  );
};
