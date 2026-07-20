import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { BackButton, Card, FadeIn, OptionCard, PrimaryButton, ScreenTitle } from '../components/ui';
import { GenerationResult, generateWeekPlan } from '../lib/mealEngine';
import { CATEGORY_HEX } from '../lib/plateColors';
import { CuisineChoice, PlanMode, UserProfile } from '../types';

const MODES: { value: PlanMode; emoji: string; label: string; description: string }[] = [
  { value: 'single', emoji: '🍽️', label: '1 meal', description: 'Just tonight' },
  { value: 'meal_prep', emoji: '🥡', label: 'Meal prep', description: '4 portions, one cook' },
  { value: 'week_plan', emoji: '🗓️', label: 'Week plan', description: '7 dinners, planned' },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function MiniDots({ result }: { result: GenerationResult }) {
  const cats = [...new Set(result.meal.ingredients.map((i) => i.category))].filter((c) =>
    ['protein', 'fish', 'vegetable', 'carb'].includes(c),
  );
  return (
    <span className="flex gap-1">
      {cats.map((c) => (
        <span key={c} className="h-2 w-2 rounded-full" style={{ backgroundColor: CATEGORY_HEX[c] }} />
      ))}
    </span>
  );
}

export default function PlanModeScreen({
  profile,
  cuisine,
  pantry,
  baseResult,
  onRestart,
  onBack,
}: {
  profile: UserProfile;
  cuisine: CuisineChoice;
  pantry: string[];
  baseResult: GenerationResult;
  onRestart: () => void;
  onBack: () => void;
}) {
  const [mode, setMode] = useState<PlanMode>('single');

  const week = useMemo(
    () => (mode === 'week_plan' ? generateWeekPlan(profile, cuisine, pantry) : []),
    [mode, profile, cuisine, pantry],
  );

  const meal = baseResult.meal;

  return (
    <FadeIn>
      <div className="space-y-6">
        <BackButton onClick={onBack} />
        <ScreenTitle
          kicker="Step 5 · Plan mode"
          title="How far ahead are we cooking?"
          subtitle="Turn tonight's pick into a prep batch or a full week."
        />

        <div className="grid grid-cols-3 gap-2">
          {MODES.map((m) => (
            <OptionCard
              key={m.value}
              selected={mode === m.value}
              onClick={() => setMode(m.value)}
              emoji={m.emoji}
              label={m.label}
              description={m.description}
            />
          ))}
        </div>

        {mode === 'single' && (
          <Card className="space-y-2 text-center">
            <span className="text-3xl">✅</span>
            <h3 className="text-sm font-semibold text-white">You're set for tonight</h3>
            <p className="text-xs leading-relaxed text-zinc-400">
              <span className="text-zinc-200">{meal.meal_name}</span> · {meal.calories} kcal ·{' '}
              {meal.protein} g protein. Everything you need is on the previous screen.
            </p>
          </Card>
        )}

        {mode === 'meal_prep' && (
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Prep batch · {meal.meal_name}</h3>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="flex flex-col items-center gap-1 rounded-2xl border border-zinc-800 bg-zinc-950/60 py-3"
                >
                  <span className="text-xl">🥡</span>
                  <span className="text-[10px] font-semibold text-zinc-400">Portion {n}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: 'Total kcal', value: meal.calories * 4 },
                { label: 'Protein', value: `${meal.protein * 4} g` },
                { label: 'Cooks', value: '1×' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-zinc-950/60 py-2.5">
                  <div className="text-sm font-bold text-lime-300 tabular-nums">{s.value}</div>
                  <div className="text-[10px] uppercase tracking-wider text-zinc-500">{s.label}</div>
                </div>
              ))}
            </div>
            <p className="text-xs leading-relaxed text-zinc-500">
              Multiply every ingredient by 4, cook once, and refrigerate in sealed containers for up
              to 4 days.
            </p>
          </Card>
        )}

        {mode === 'week_plan' && (
          <Card className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Your week of dinners</h3>
            <ul className="space-y-2">
              {week.map((r, i) => (
                <li
                  key={DAYS[i]}
                  className="flex items-center gap-3 rounded-xl border border-zinc-800/70 bg-zinc-950/50 px-3 py-2.5"
                >
                  <span className="w-8 text-[11px] font-bold uppercase text-zinc-500">{DAYS[i]}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium text-zinc-200">{r.meal.meal_name}</div>
                    <div className="text-[10px] text-zinc-500">
                      {r.meal.calories} kcal · {r.meal.protein} g protein
                    </div>
                  </div>
                  <MiniDots result={r} />
                </li>
              ))}
            </ul>
            <div className="flex justify-between rounded-xl bg-zinc-950/60 px-4 py-2.5 text-xs">
              <span className="text-zinc-500">Weekly average</span>
              <span className="font-semibold text-lime-300 tabular-nums">
                {Math.round(week.reduce((a, r) => a + r.meal.calories, 0) / 7)} kcal ·{' '}
                {Math.round(week.reduce((a, r) => a + r.meal.protein, 0) / 7)} g protein / day
              </span>
            </div>
          </Card>
        )}

        <PrimaryButton variant="ghost" onClick={onRestart}>
          <RotateCcw className="h-4 w-4" /> Start over
        </PrimaryButton>
      </div>
    </FadeIn>
  );
}
