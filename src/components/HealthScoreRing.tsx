import { motion } from 'motion/react';

export default function HealthScoreRing({ score, size = 72 }: { score: number; size?: number }) {
  const r = 30;
  const circumference = 2 * Math.PI * r;
  const color = score >= 85 ? '#4ade80' : score >= 70 ? '#facc15' : '#f43f5e';
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 72 72" width={size} height={size} className="-rotate-90">
        <circle cx={36} cy={36} r={r} fill="none" stroke="#27272a" strokeWidth={6} />
        <motion.circle
          cx={36}
          cy={36}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - score / 100) }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold leading-none text-white tabular-nums">{score}</span>
        <span className="text-[9px] uppercase tracking-wider text-zinc-500">health</span>
      </div>
    </div>
  );
}
