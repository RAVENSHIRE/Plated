import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Goal } from '../types';

const GOAL_LINE: Record<Goal, string> = {
  weight_loss: 'Biasing toward protein and vegetables…',
  muscle_gain: 'Loading up protein and calories…',
  maintenance: 'Balancing your macro split…',
};

// Mock generation delay: stages the "thinking" states the real
// AI-backed generator will surface in v2.
export default function GeneratingScreen({ goal, onDone }: { goal: Goal; onDone: () => void }) {
  const stages = ['Reading your kitchen…', GOAL_LINE[goal], 'Plating your meal…'];
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 700);
    const t2 = setTimeout(() => setStage(2), 1400);
    const t3 = setTimeout(onDone, 2100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center gap-8">
      <div className="relative h-28 w-28">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-lime-400/20"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-t-2 border-lime-400"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-4xl">🍳</div>
      </div>
      <motion.p
        key={stage}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm font-medium text-zinc-300"
      >
        {stages[stage]}
      </motion.p>
    </div>
  );
}
