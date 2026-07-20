import { Camera, ChefHat } from 'lucide-react';
import IngredientTagInput from '../components/IngredientTagInput';
import { BackButton, FadeIn, PrimaryButton, ScreenTitle } from '../components/ui';

export default function InventoryScreen({
  ingredients,
  onChange,
  onGenerate,
  onBack,
}: {
  ingredients: string[];
  onChange: (next: string[]) => void;
  onGenerate: () => void;
  onBack: () => void;
}) {
  return (
    <FadeIn>
      <div className="space-y-6">
        <BackButton onClick={onBack} />
        <ScreenTitle
          kicker="Step 3 · Your kitchen"
          title="What do you have in?"
          subtitle="Tap to add what's in your fridge and pantry. The closer the match, the less you'll need to buy."
        />

        <IngredientTagInput value={ingredients} onChange={onChange} />

        {/* Future photo-scan entry point — intentionally disabled in v1 */}
        <div className="flex items-center gap-3 rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-3.5 opacity-60">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-800 text-zinc-500">
            <Camera className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold text-zinc-400">Scan your fridge with a photo</div>
            <div className="text-[11px] text-zinc-600">Coming in v2 — auto-detect ingredients from a snapshot</div>
          </div>
          <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Soon
          </span>
        </div>

        <PrimaryButton onClick={onGenerate}>
          <ChefHat className="h-4 w-4" />
          {ingredients.length > 0 ? 'Generate my meal' : 'Skip — suggest something anyway'}
        </PrimaryButton>
      </div>
    </FadeIn>
  );
}
