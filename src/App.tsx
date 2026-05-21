import { AnimatePresence } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import { SetupScreen } from './components/SetupScreen';
import { RoleRevealScreen } from './components/RoleRevealScreen';
import { NightScreen } from './components/NightScreen';
import { DayResultScreen } from './components/DayResultScreen';
import { DiscussionScreen } from './components/DiscussionScreen';
import { VotingScreen } from './components/VotingScreen';
import { GameOverScreen } from './components/GameOverScreen';

function App() {
  const phase = useGameStore(state => state.phase);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {phase === 'SETUP' && <SetupScreen key="SETUP" />}
        {phase === 'ROLE_REVEAL' && <RoleRevealScreen key="ROLE_REVEAL" />}
        {(phase === 'NIGHT_KILLER' || phase === 'NIGHT_DOCTOR') && <NightScreen key={phase} />}
        {phase === 'DAY_RESULT' && <DayResultScreen key="DAY_RESULT" />}
        {phase === 'DAY_DISCUSSION' && <DiscussionScreen key="DAY_DISCUSSION" />}
        {phase === 'DAY_VOTING' && <VotingScreen key="DAY_VOTING" />}
        {phase === 'GAME_OVER' && <GameOverScreen key="GAME_OVER" />}
      </AnimatePresence>
    </div>
  );
}

export default App;
