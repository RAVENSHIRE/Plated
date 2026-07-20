import { IngredientCategory } from '../types';

// Product color code: protein = red, fish = blue, vegetables = green,
// carbs = yellow. dairy/pantry are neutral supporting items.
export const CATEGORY_HEX: Record<IngredientCategory, string> = {
  protein: '#f43f5e',
  fish: '#38bdf8',
  vegetable: '#4ade80',
  carb: '#facc15',
  dairy: '#c4b5fd',
  pantry: '#a1a1aa',
};

export const CATEGORY_LABEL: Record<IngredientCategory, string> = {
  protein: 'Protein',
  fish: 'Fish',
  vegetable: 'Vegetables',
  carb: 'Carbs',
  dairy: 'Dairy',
  pantry: 'Pantry',
};

// Relative visual weight of one ingredient of each category on the
// plate graphic (mains read larger than sides).
export const PLATE_WEIGHT: Partial<Record<IngredientCategory, number>> = {
  protein: 2,
  fish: 2,
  vegetable: 1,
  carb: 1.5,
};
