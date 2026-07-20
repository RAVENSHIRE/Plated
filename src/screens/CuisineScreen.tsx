import { ArrowRight, Dices } from 'lucide-react';
import { CuisineChoice, CuisineType } from '../types';
import { BackButton, FadeIn, OptionCard, PrimaryButton, ScreenTitle } from '../components/ui';

const CUISINES: { value: CuisineType; emoji: string; label: string; description: string }[] = [
  { value: 'italian', emoji: '🍝', label: 'Italian', description: 'Pasta, herbs, olive oil' },
  { value: 'asian', emoji: '🥢', label: 'Asian', description: 'Stir-fries, rice, umami' },
  { value: 'mexican', emoji: '🌮', label: 'Mexican', description: 'Bold spice, beans, lime' },
  { value: 'mediterranean', emoji: '🫒', label: 'Mediterranean', description: 'Fresh, light, sunny' },
  { value: 'american', emoji: '🍔', label: 'American', description: 'Comfort, grills, bowls' },
  { value: 'indian', emoji: '🍛', label: 'Indian', description: 'Layered spice, curries' },
];

export default function CuisineScreen({
  choice,
  onChoose,
  onContinue,
  onBack,
}: {
  choice: CuisineChoice | null;
  onChoose: (c: CuisineChoice) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  return (
    <FadeIn>
      <div className="space-y-6">
        <BackButton onClick={onBack} />
        <ScreenTitle
          kicker="Step 2 · Taste"
          title="What are you craving?"
          subtitle="Pick a cuisine, or let Plated roll the dice for you."
        />

        <div className="grid grid-cols-2 gap-2.5">
          {CUISINES.map((c) => (
            <OptionCard
              key={c.value}
              selected={choice === c.value}
              onClick={() => onChoose(c.value)}
              emoji={c.emoji}
              label={c.label}
              description={c.description}
            />
          ))}
        </div>

        {/* Surprise me */}
        <button
          onClick={() => onChoose('surprise')}
          className={`w-full rounded-2xl border p-4 text-left transition-all cursor-pointer ${
            choice === 'surprise'
              ? 'border-fuchsia-400 bg-fuchsia-400/10 shadow-[0_0_20px_rgba(232,121,249,0.15)]'
              : 'border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-900/40 hover:border-fuchsia-400/40'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-400/15 text-fuchsia-300">
              <Dices className="h-5 w-5" />
            </div>
            <div>
              <div className={`text-sm font-semibold ${choice === 'surprise' ? 'text-fuchsia-300' : 'text-white'}`}>
                Surprise me
              </div>
              <div className="text-xs text-zinc-500">Chef's choice across every cuisine</div>
            </div>
          </div>
        </button>

        <PrimaryButton onClick={onContinue} disabled={!choice}>
          Continue <ArrowRight className="h-4 w-4" />
        </PrimaryButton>
      </div>
    </FadeIn>
  );
}
