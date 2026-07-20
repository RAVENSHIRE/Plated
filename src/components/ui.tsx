import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

// Small shared building blocks used across every screen.

export function PrimaryButton({
  children,
  onClick,
  disabled,
  variant = 'primary',
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'ghost';
}) {
  const base =
    'w-full rounded-2xl py-3.5 text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed';
  const styles =
    variant === 'primary'
      ? 'bg-lime-400 text-zinc-950 hover:bg-lime-300 shadow-[0_0_24px_rgba(163,230,53,0.25)] disabled:opacity-30 disabled:shadow-none'
      : 'bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-zinc-600 hover:text-white disabled:opacity-30';
  return (
    <button className={`${base} ${styles}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      Back
    </button>
  );
}

export function ScreenTitle({ kicker, title, subtitle }: { kicker: string; title: string; subtitle?: string }) {
  return (
    <div className="space-y-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-lime-400">{kicker}</span>
      <h2 className="text-2xl font-semibold tracking-tight text-white">{title}</h2>
      {subtitle && <p className="text-sm leading-relaxed text-zinc-400">{subtitle}</p>}
    </div>
  );
}

// Selectable card used for goals, activity levels, cuisines and plan modes.
export function OptionCard({
  selected,
  onClick,
  emoji,
  label,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  emoji: string;
  label: string;
  description?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
        selected
          ? 'border-lime-400 bg-lime-400/10 shadow-[0_0_20px_rgba(163,230,53,0.12)]'
          : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-600'
      }`}
    >
      <span className="text-xl">{emoji}</span>
      <div className={`mt-1.5 text-sm font-semibold ${selected ? 'text-lime-300' : 'text-white'}`}>{label}</div>
      {description && <div className="mt-0.5 text-xs leading-snug text-zinc-500">{description}</div>}
    </button>
  );
}

export function SliderField({
  label,
  value,
  unit,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-zinc-300">{label}</label>
        <span className="text-sm font-semibold text-lime-300 tabular-nums">
          {value} <span className="text-xs font-normal text-zinc-500">{unit}</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-lime-400"
      />
    </div>
  );
}

export function StepDots({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((label, i) => (
        <div key={label} className="flex flex-col items-center gap-1">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === current ? 'w-8 bg-lime-400' : i < current ? 'w-4 bg-lime-400/40' : 'w-4 bg-zinc-800'
            }`}
          />
        </div>
      ))}
    </div>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl border border-zinc-800/80 bg-zinc-900/50 p-5 backdrop-blur ${className}`}>
      {children}
    </div>
  );
}

export function FadeIn({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
