import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CuisineChoice, UserProfile } from './types';
import { GenerationResult, generateMeal } from './lib/mealEngine';
import { StepDots } from './components/ui';
import OnboardingScreen from './screens/OnboardingScreen';
import CuisineScreen from './screens/CuisineScreen';
import InventoryScreen from './screens/InventoryScreen';
import GeneratingScreen from './screens/GeneratingScreen';
import MealResultScreen from './screens/MealResultScreen';
import PlanModeScreen from './screens/PlanModeScreen';

type Screen = 'onboarding' | 'cuisine' | 'inventory' | 'generating' | 'result' | 'plan';

const STEP_INDEX: Record<Screen, number> = {
  onboarding: 0,
  cuisine: 1,
  inventory: 2,
  generating: 3,
  result: 3,
  plan: 4,
};

const DEFAULT_PROFILE: UserProfile = {
  age: 28,
  height_cm: 175,
  weight_kg: 75,
  goal: 'weight_loss',
  activity_level: 'moderate',
  dietary_preference: 'none',
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('onboarding');
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [cuisine, setCuisine] = useState<CuisineChoice | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [seenMealIds, setSeenMealIds] = useState<string[]>([]);

  const runGeneration = (exclude: string[]) => {
    const r = generateMeal(profile, cuisine ?? 'surprise', ingredients, exclude);
    setResult(r);
    setSeenMealIds([...exclude, r.meal.id]);
    setScreen('generating');
  };

  const handleRestart = () => {
    setScreen('onboarding');
    setCuisine(null);
    setIngredients([]);
    setResult(null);
    setSeenMealIds([]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-white">
      {/* ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-lime-500/8 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-500/6 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-md px-5 pb-16 pt-6">
        {/* top bar */}
        <header className="mb-8 flex items-center justify-between">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 cursor-pointer"
            aria-label="Plated home"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-lime-400 to-emerald-500 text-base">
              🍽️
            </span>
            <span className="text-base font-bold tracking-tight">Plated</span>
          </button>
          <StepDots
            steps={['Profile', 'Cuisine', 'Kitchen', 'Meal', 'Plan']}
            current={STEP_INDEX[screen]}
          />
        </header>

        <AnimatePresence mode="wait">
          <motion.main
            key={screen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {screen === 'onboarding' && (
              <OnboardingScreen
                profile={profile}
                onComplete={(p) => {
                  setProfile(p);
                  setScreen('cuisine');
                }}
              />
            )}

            {screen === 'cuisine' && (
              <CuisineScreen
                choice={cuisine}
                onChoose={setCuisine}
                onContinue={() => setScreen('inventory')}
                onBack={() => setScreen('onboarding')}
              />
            )}

            {screen === 'inventory' && (
              <InventoryScreen
                ingredients={ingredients}
                onChange={setIngredients}
                onGenerate={() => runGeneration([])}
                onBack={() => setScreen('cuisine')}
              />
            )}

            {screen === 'generating' && (
              <GeneratingScreen goal={profile.goal} onDone={() => setScreen('result')} />
            )}

            {screen === 'result' && result && (
              <MealResultScreen
                result={result}
                cuisine={cuisine ?? 'surprise'}
                onRegenerate={() => runGeneration(seenMealIds)}
                onContinue={() => setScreen('plan')}
                onBack={() => setScreen('inventory')}
              />
            )}

            {screen === 'plan' && result && (
              <PlanModeScreen
                profile={profile}
                cuisine={cuisine ?? 'surprise'}
                pantry={ingredients}
                baseResult={result}
                onRestart={handleRestart}
                onBack={() => setScreen('result')}
              />
            )}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
