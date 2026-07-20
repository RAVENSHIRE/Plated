// ── Plated v1 data model ─────────────────────────────────────────────
// Shapes mirror the future database schema so meals, ingredients and
// user goals can be persisted later without remodeling.

export type Goal = 'weight_loss' | 'muscle_gain' | 'maintenance';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active';

export type DietaryPreference = 'none' | 'vegetarian' | 'pescatarian' | 'vegan';

export type CuisineType =
  | 'italian'
  | 'asian'
  | 'mexican'
  | 'mediterranean'
  | 'american'
  | 'indian';

export type CuisineChoice = CuisineType | 'surprise';

// Drives the plate color coding: protein = red, fish = blue,
// vegetable = green, carb = yellow. dairy/pantry are supporting items.
export type IngredientCategory =
  | 'protein'
  | 'fish'
  | 'vegetable'
  | 'carb'
  | 'dairy'
  | 'pantry';

export type PlanMode = 'single' | 'meal_prep' | 'week_plan';

export interface UserProfile {
  age: number;
  height_cm: number;
  weight_kg: number;
  goal: Goal;
  activity_level: ActivityLevel;
  dietary_preference: DietaryPreference;
}

export interface MealIngredient {
  name: string;
  amount: string;
  category: IngredientCategory;
}

// Maps 1:1 onto the planned `meals` table:
// meal_name, ingredients, preparation, health_score,
// calories, protein, carbs, fat, cuisine_type.
export interface Meal {
  id: string;
  meal_name: string;
  cuisine_type: CuisineType;
  ingredients: MealIngredient[];
  preparation: string[];
  health_score: number; // 0–100
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  prep_time_min: number;
  cook_time_min: number;
  // Which dietary preferences this meal satisfies (besides 'none').
  dietary: Exclude<DietaryPreference, 'none'>[];
}

// A pantry item the user entered. `source` keeps the model ready for
// the v2 photo-scan pipeline without changing the schema.
export interface PantryItem {
  name: string;
  source: 'manual' | 'photo';
}
