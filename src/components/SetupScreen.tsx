import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import type { Role, Player } from '../types';
import { shuffleArray } from '../utils/gameLogic';
import { Plus, Trash2, Shield, Skull, User, ChevronRight } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  in: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" as const } },
  out: { opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.3, ease: "easeIn" as const } }
};

export const SetupScreen = () => {
  const setPlayers = useGameStore(state => state.setPlayers);
  const setPhase = useGameStore(state => state.setPhase);
  
  const [names, setNames] = useState<string[]>(['', '', '', '', '']);
  const [counts, setCounts] = useState({
    KILLER: 1,
    DOCTOR: 1,
    VILLAGER: 3
  });

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const addPlayer = () => setNames([...names, '']);
  const removePlayer = (index: number) => {
    if (names.length <= 3) return;
    const newNames = names.filter((_, i) => i !== index);
    setNames(newNames);
  };

  const updateCount = (role: Role, delta: number) => {
    setCounts(prev => ({
      ...prev,
      [role]: Math.max(0, prev[role as keyof typeof prev] + delta)
    }));
  };

  const totalRoles = counts.KILLER + counts.DOCTOR + counts.VILLAGER;
  const validPlayers = names.filter(n => n.trim() !== '');
  
  const isReady = totalRoles === validPlayers.length && validPlayers.length >= 3;

  const startGame = () => {
    if (!isReady) return;

    let rolePool: Role[] = [];
    for(let i=0; i<counts.KILLER; i++) rolePool.push('KILLER');
    for(let i=0; i<counts.DOCTOR; i++) rolePool.push('DOCTOR');
    for(let i=0; i<counts.VILLAGER; i++) rolePool.push('VILLAGER');
    
    rolePool = shuffleArray(rolePool);

    const players: Player[] = validPlayers.map((name, i) => ({
      id: `p_${i}_${Date.now()}`,
      name: name.trim(),
      role: rolePool[i],
      isAlive: true
    }));

    setPlayers(players);
    setPhase('ROLE_REVEAL');
  };

  return (
    <motion.div 
      initial="initial" animate="in" exit="out" variants={pageVariants}
      className="glass p-6 w-full max-w-md mx-auto my-auto flex flex-col"
      style={{ padding: '24px' }}
    >
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
          <Skull size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Katil Kim?</h1>
        <p className="text-sm opacity-50 mt-1">Moderatörsüz Deneyim</p>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold opacity-90">Oyuncular</h2>
          <span className="text-xs bg-white/10 px-2 py-1 rounded-full">{validPlayers.length} Kişi</span>
        </div>
        
        <div className="flex flex-col gap-3 max-h-56 overflow-y-auto">
          <AnimatePresence initial={false}>
            {names.map((name, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="flex gap-2"
              >
                <input 
                  type="text" 
                  placeholder={`${i+1}. Oyuncu Adı`}
                  value={name}
                  onChange={(e) => handleNameChange(i, e.target.value)}
                  className="flex-1 bg-white/5"
                />
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removePlayer(i)}
                  style={{ padding: '0.75rem', backgroundColor: 'transparent' }}
                  className="text-white/40 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={20} />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={addPlayer}
          style={{ width: '100%', marginTop: '12px', backgroundColor: 'rgba(255,255,255,0.05)' }}
          className="flex items-center justify-center gap-2 text-sm font-medium py-3 rounded-xl border border-white/5"
        >
          <Plus size={18} /> Yeni Oyuncu
        </motion.button>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold opacity-90">Dağılım</h2>
          <span className={`text-xs px-2 py-1 rounded-full ${totalRoles === validPlayers.length ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {totalRoles} Rol Seçili
          </span>
        </div>
        
        <div className="flex flex-col gap-3">
          {[
            { id: 'KILLER', label: 'Katil', count: counts.KILLER, icon: <Skull size={18}/>, color: 'text-red-500' },
            { id: 'DOCTOR', label: 'Doktor', count: counts.DOCTOR, icon: <Shield size={18}/>, color: 'text-blue-500' },
            { id: 'VILLAGER', label: 'Köylü', count: counts.VILLAGER, icon: <User size={18}/>, color: 'text-green-500' },
          ].map(role => (
            <div key={role.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <span className={`flex items-center gap-3 font-medium ${role.color}`}>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  {role.icon}
                </div>
                {role.label}
              </span>
              <div className="flex items-center gap-4">
                <motion.button whileTap={{ scale: 0.8 }} onClick={() => updateCount(role.id as Role, -1)} className="w-8 h-8 p-0 flex items-center justify-center bg-transparent border border-white/10 text-xl">-</motion.button>
                <span className="w-4 text-center font-semibold">{role.count}</span>
                <motion.button whileTap={{ scale: 0.8 }} onClick={() => updateCount(role.id as Role, 1)} className="w-8 h-8 p-0 flex items-center justify-center bg-transparent border border-white/10 text-xl">+</motion.button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <motion.button 
        whileTap={{ scale: isReady ? 0.98 : 1 }}
        disabled={!isReady} 
        onClick={startGame}
        style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
        className={`flex items-center justify-center gap-2 ${isReady ? 'bg-white text-black' : 'bg-white/10 text-white/50'}`}
      >
        Oyunu Başlat <ChevronRight size={20} />
      </motion.button>
    </motion.div>
  );
};
