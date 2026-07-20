export type CuisineType =
  | 'Italian'
  | 'Vietnamese'
  | 'Asian'
  | 'US'
  | 'Fast Food'
  | 'Healthy'
  | 'Breakfast'
  | 'Light Snack';

export interface Ingredient {
  id: string;
  name: string;
  category: 'fridge' | 'pantry';
  icon: string;
  scanned: boolean;
  quantity?: string;
}

export interface RecipeStep {
  text: string;
  duration?: string; // e.g. "5 mins"
  temp?: string;     // e.g. "Medium Heat"
}

export interface Recipe {
  id: string;
  title: string;
  cuisine: CuisineType;
  type: 'zero-waste' | 'upgrade';
  missingIngredient?: string;
  prepTime: string;
  cookTime: string;
  calories: number;
  macros: {
    protein: string;
    carbs: string;
    fat: string;
  };
  ingredientsNeeded: string[];
  steps: RecipeStep[];
  hologramColor: string;
  hologramDesign: string; // Used to customize the holographic visual render
}

export interface UserProfile {
  goal: string;
  age: number;
  height: string;
  weight: string;
  activity_level: string;
  cuisine_preference: string;
  meal_mode: string;
}

export interface DetectedItemDetail {
  name: string;
  confidence: number;
  quantity: string;
  category: string;
  shelf_life_days: number;
  expiry_concern: string;
}

export interface AppState {
  currentStep: number; // 1 to 5
  selectedCuisine: CuisineType | null;
  fridgeScanned: boolean;
  cabinetScanned: boolean;
  scannedFridgeItems: string[];
  scannedPantryItems: string[];
  selectedRecipe: Recipe | null;
  shoppingCart: string[]; // Items bought as upgrades
  activeRecipeStep: number;
  voiceGuided: boolean;
}
