import { ArrowRight, Check, Clock, RefreshCw, ShoppingBag, Sparkles } from 'lucide-react';
import HealthScoreRing from '../components/HealthScoreRing';
import MacroSummary from '../components/MacroSummary';
import PlateVisual from '../components/PlateVisual';
import { BackButton, Card, FadeIn, PrimaryButton } from '../components/ui';
import { GenerationResult } from '../lib/mealEngine';
import { CATEGORY_HEX } from '../lib/plateColors';
import { CuisineChoice } from '../types';

export default function MealResultScreen({
  result,
  cuisine,
  onRegenerate,
  onContinue,
  onBack,
}: {
  result: GenerationResult;
  cuisine: CuisineChoice;
  onRegenerate: () => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  const { meal } = result;
  const targetPct = Math.round((meal.calories / result.daily_calorie_target) * 100);

  return (
    <FadeIn>
      <div className="space-y-6">
        <BackButton onClick={onBack} />

        {/* title block */}
        <div className="space-y-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-300">
              {meal.cuisine_type}
            </span>
            {cuisine === 'surprise' && (
              <span className="flex items-center gap-1 rounded-full border border-fuchsia-400/40 bg-fuchsia-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-fuchsia-300">
                <Sparkles className="h-3 w-3" /> surprise
              </span>
            )}
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">{meal.meal_name}</h2>
          <p className="flex items-center justify-center gap-1.5 text-xs text-zinc-500">
            <Clock className="h-3.5 w-3.5" />
            {meal.prep_time_min} min prep · {meal.cook_time_min} min cook
          </p>
        </div>

        {/* the plate */}
        <PlateVisual meal={meal} />

        {/* why this meal */}
        <Card className="space-y-1.5">
          {result.reasons.map((r) => (
            <p key={r} className="flex items-start gap-2 text-xs leading-relaxed text-zinc-400">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lime-400" />
              {r}
            </p>
          ))}
        </Card>

        {/* score + macros */}
        <Card className="flex items-center gap-5">
          <HealthScoreRing score={meal.health_score} />
          <div className="min-w-0 flex-1">
            <MacroSummary meal={meal} />
          </div>
        </Card>
        <p className="text-center text-[11px] text-zinc-600">
          {meal.calories} kcal ≈ {targetPct}% of your ~{result.daily_calorie_target} kcal daily target
        </p>

        {/* ingredients */}
        <Card className="space-y-3">
          <h3 className="text-sm font-semibold text-white">Ingredients</h3>
          <ul className="space-y-2">
            {meal.ingredients.map((ing) => {
              const have = result.matched.includes(ing.name);
              return (
                <li key={ing.name} className="flex items-center gap-2.5 text-sm">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: CATEGORY_HEX[ing.category] }}
                  />
                  <span className="flex-1 text-zinc-200">{ing.name}</span>
                  <span className="text-xs text-zinc-500">{ing.amount}</span>
                  {have ? (
                    <span className="flex items-center gap-1 rounded-full bg-lime-400/10 px-2 py-0.5 text-[10px] font-semibold text-lime-300">
                      <Check className="h-2.5 w-2.5" /> have
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-zinc-400">
                      <ShoppingBag className="h-2.5 w-2.5" /> need
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>

        {/* preparation */}
        <Card className="space-y-3">
          <h3 className="text-sm font-semibold text-white">Preparation</h3>
          <ol className="space-y-3">
            {meal.preparation.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-zinc-300">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-lime-300">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </Card>

        {/* actions */}
        <div className="space-y-2.5">
          <PrimaryButton onClick={onContinue}>
            Choose plan mode <ArrowRight className="h-4 w-4" />
          </PrimaryButton>
          <PrimaryButton variant="ghost" onClick={onRegenerate}>
            <RefreshCw className="h-4 w-4" /> Try another meal
          </PrimaryButton>
        </div>
      </div>
    </FadeIn>
  );
}
