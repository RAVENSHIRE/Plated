import {
  ActivityLevel,
  CuisineChoice,
  Goal,
  Meal,
  UserProfile,
} from '../types';
import { MEALS_DB } from '../data/mealsDb';

// Rules-based recommendation engine for v1. The scoring below is the
// mock stand-in for a future server-side generator — the interface
// (profile + cuisine + pantry in, scored meal out) stays the same.

export interface GenerationResult {
  meal: Meal;
  matched: string[]; // meal ingredients covered by the user's kitchen
  missing: string[]; // meal ingredients the user still needs
  reasons: string[]; // human-readable "why this meal"
  daily_calorie_target: number;
  meal_calorie_target: number;
}

const ACTIVITY_FACTOR: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very_active: 1.725,
};

const GOAL_CALORIE_ADJUST: Record<Goal, number> = {
  weight_loss: 0.8,
  muscle_gain: 1.12,
  maintenance: 1.0,
};

export function dailyCalorieTarget(profile: UserProfile): number {
  // Mifflin-St Jeor, sex-neutral midpoint constant.
  const bmr =
    10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age - 78;
  return Math.round(
    bmr * ACTIVITY_FACTOR[profile.activity_level] * GOAL_CALORIE_ADJUST[profile.goal],
  );
}

function dietOk(meal: Meal, pref: UserProfile['dietary_preference']): boolean {
  if (pref === 'none') return true;
  return meal.dietary.includes(pref);
}

function normalize(s: string): string {
  return s.toLowerCase().trim();
}

function matchIngredients(pantry: string[], meal: Meal) {
  const matched: string[] = [];
  const missing: string[] = [];
  for (const ing of meal.ingredients) {
    const b = normalize(ing.name);
    const hit = pantry.some((u) => {
      const a = normalize(u);
      return a.length > 2 && (b.includes(a) || a.includes(b));
    });
    (hit ? matched : missing).push(ing.name);
  }
  return { matched, missing };
}

function vegShare(meal: Meal): number {
  const veg = meal.ingredients.filter((i) => i.category === 'vegetable').length;
  return veg / meal.ingredients.length;
}

// Goal biasing:
//  - weight_loss   → reward protein density and vegetables, punish calories/carbs
//  - muscle_gain   → reward absolute protein and calories
//  - maintenance   → reward proximity to a balanced 30/40/30 macro split
function goalScore(meal: Meal, goal: Goal): number {
  const proteinRatio = (meal.protein * 4) / meal.calories;
  const carbRatio = (meal.carbs * 4) / meal.calories;
  switch (goal) {
    case 'weight_loss':
      return (
        proteinRatio * 90 +
        vegShare(meal) * 40 -
        Math.max(0, meal.calories - 520) * 0.06 -
        carbRatio * 25
      );
    case 'muscle_gain':
      return meal.protein * 1.4 + meal.calories * 0.045;
    case 'maintenance': {
      const fatRatio = (meal.fat * 9) / meal.calories;
      const drift =
        Math.abs(proteinRatio - 0.3) +
        Math.abs(carbRatio - 0.4) +
        Math.abs(fatRatio - 0.3);
      return 50 - drift * 60;
    }
  }
}

function goalReason(goal: Goal): string {
  switch (goal) {
    case 'weight_loss':
      return 'Biased for weight loss: high protein, veg-forward, controlled calories.';
    case 'muscle_gain':
      return 'Biased for muscle gain: protein-dense with a calorie surplus in mind.';
    case 'maintenance':
      return 'Balanced macro split to keep you right where you are.';
  }
}

export function generateMeal(
  profile: UserProfile,
  cuisine: CuisineChoice,
  pantry: string[],
  excludeIds: string[] = [],
): GenerationResult {
  let pool = MEALS_DB.filter((m) => dietOk(m, profile.dietary_preference));
  if (pool.length === 0) pool = MEALS_DB;

  let cuisineRelaxed = false;
  if (cuisine !== 'surprise') {
    const inCuisine = pool.filter((m) => m.cuisine_type === cuisine);
    if (inCuisine.length > 0) {
      pool = inCuisine;
    } else {
      cuisineRelaxed = true; // e.g. vegan + a cuisine with no vegan meals yet
    }
  }

  let candidates = pool.filter((m) => !excludeIds.includes(m.id));
  if (candidates.length === 0) candidates = pool;

  const scored = candidates
    .map((meal) => {
      const { matched, missing } = matchIngredients(pantry, meal);
      const matchScore =
        pantry.length > 0 ? (matched.length / meal.ingredients.length) * 55 : 0;
      const jitter = cuisine === 'surprise' ? Math.random() * 30 : Math.random() * 6;
      const score =
        goalScore(meal, profile.goal) +
        matchScore +
        meal.health_score * 0.15 +
        jitter;
      return { meal, matched, missing, score };
    })
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  const daily = dailyCalorieTarget(profile);

  const reasons: string[] = [goalReason(profile.goal)];
  if (best.matched.length > 0) {
    reasons.push(
      `Uses ${best.matched.length} ingredient${best.matched.length > 1 ? 's' : ''} already in your kitchen.`,
    );
  } else if (pantry.length === 0) {
    reasons.push('Picked from pantry staples — add ingredients for tighter matches.');
  }
  if (cuisine === 'surprise') {
    reasons.push(`Surprise pick from our ${best.meal.cuisine_type} shelf.`);
  }
  if (cuisineRelaxed) {
    reasons.push(
      `No ${profile.dietary_preference} match in that cuisine yet — closest fit chosen instead.`,
    );
  }

  return {
    meal: best.meal,
    matched: best.matched,
    missing: best.missing,
    reasons,
    daily_calorie_target: daily,
    meal_calorie_target: Math.round(daily / 3),
  };
}

export function generateWeekPlan(
  profile: UserProfile,
  cuisine: CuisineChoice,
  pantry: string[],
): GenerationResult[] {
  const plan: GenerationResult[] = [];
  const used: string[] = [];
  for (let day = 0; day < 7; day++) {
    const result = generateMeal(profile, cuisine, pantry, used);
    plan.push(result);
    // A repeat means the eligible pool is exhausted — start a fresh
    // rotation so small pools cycle instead of pinning one meal.
    if (used.includes(result.meal.id)) used.length = 0;
    used.push(result.meal.id);
  }
  return plan;
}
