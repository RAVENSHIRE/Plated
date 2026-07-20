import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ActivityLevel, DietaryPreference, Goal, UserProfile } from '../types';
import { FadeIn, OptionCard, PrimaryButton, ScreenTitle, SliderField } from '../components/ui';

const GOALS: { value: Goal; emoji: string; label: string; description: string }[] = [
  { value: 'weight_loss', emoji: '🔥', label: 'Lose weight', description: 'More protein & veg, fewer calories' },
  { value: 'muscle_gain', emoji: '💪', label: 'Build muscle', description: 'High protein, calorie surplus' },
  { value: 'maintenance', emoji: '⚖️', label: 'Maintain', description: 'Balanced macros, steady energy' },
];

const ACTIVITY: { value: ActivityLevel; label: string }[] = [
  { value: 'sedentary', label: 'Sedentary' },
  { value: 'light', label: 'Light' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'very_active', label: 'Very active' },
];

const DIETS: { value: DietaryPreference; emoji: string; label: string }[] = [
  { value: 'none', emoji: '🍽️', label: 'No restrictions' },
  { value: 'vegetarian', emoji: '🥕', label: 'Vegetarian' },
  { value: 'pescatarian', emoji: '🐟', label: 'Pescatarian' },
  { value: 'vegan', emoji: '🌱', label: 'Vegan' },
];

export default function OnboardingScreen({
  profile,
  onComplete,
}: {
  profile: UserProfile;
  onComplete: (profile: UserProfile) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState<UserProfile>(profile);

  if (!showForm) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 14 }}
          className="space-y-4"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-lime-400 to-emerald-500 text-4xl shadow-[0_0_60px_rgba(163,230,53,0.35)]">
            🍽️
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Plated</h1>
          <p className="mx-auto max-w-[280px] text-sm leading-relaxed text-zinc-400">
            Personalized meals from what's already in your kitchen — tuned to your goals, in seconds.
          </p>
        </motion.div>
        <FadeIn delay={0.3}>
          <div className="w-72 space-y-3">
            <PrimaryButton onClick={() => setShowForm(true)}>
              Get started <ArrowRight className="h-4 w-4" />
            </PrimaryButton>
            <p className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-600">
              <Sparkles className="h-3 w-3" /> v1 prototype · photo scanning arrives in v2
            </p>
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <FadeIn>
      <div className="space-y-7">
        <ScreenTitle
          kicker="Step 1 · About you"
          title="Let's tune your plate"
          subtitle="We use this to size portions and bias every recommendation toward your goal."
        />

        <div className="space-y-5 rounded-3xl border border-zinc-800/80 bg-zinc-900/50 p-5">
          <SliderField label="Age" value={draft.age} unit="yrs" min={16} max={80} onChange={(age) => setDraft({ ...draft, age })} />
          <SliderField label="Height" value={draft.height_cm} unit="cm" min={140} max={210} onChange={(height_cm) => setDraft({ ...draft, height_cm })} />
          <SliderField label="Weight" value={draft.weight_kg} unit="kg" min={40} max={160} onChange={(weight_kg) => setDraft({ ...draft, weight_kg })} />
        </div>

        <div className="space-y-2.5">
          <span className="text-sm font-medium text-zinc-300">Your goal</span>
          <div className="grid grid-cols-3 gap-2">
            {GOALS.map((g) => (
              <OptionCard
                key={g.value}
                selected={draft.goal === g.value}
                onClick={() => setDraft({ ...draft, goal: g.value })}
                emoji={g.emoji}
                label={g.label}
                description={g.description}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          <span className="text-sm font-medium text-zinc-300">Activity level</span>
          <div className="grid grid-cols-4 gap-1.5 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-1.5">
            {ACTIVITY.map((a) => (
              <button
                key={a.value}
                onClick={() => setDraft({ ...draft, activity_level: a.value })}
                className={`rounded-xl px-1 py-2 text-[11px] font-medium transition-all cursor-pointer ${
                  draft.activity_level === a.value
                    ? 'bg-lime-400 text-zinc-950'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          <span className="text-sm font-medium text-zinc-300">Dietary preference</span>
          <div className="flex flex-wrap gap-2">
            {DIETS.map((d) => (
              <button
                key={d.value}
                onClick={() => setDraft({ ...draft, dietary_preference: d.value })}
                className={`rounded-full border px-3.5 py-2 text-xs font-medium transition-all cursor-pointer ${
                  draft.dietary_preference === d.value
                    ? 'border-lime-400/50 bg-lime-400/15 text-lime-200'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-600'
                }`}
              >
                {d.emoji} {d.label}
              </button>
            ))}
          </div>
        </div>

        <PrimaryButton onClick={() => onComplete(draft)}>
          Continue <ArrowRight className="h-4 w-4" />
        </PrimaryButton>
      </div>
    </FadeIn>
  );
}
