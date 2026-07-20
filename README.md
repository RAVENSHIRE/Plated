# Plated — v1 Prototype

Fast, personalized meal suggestions from your goals, cuisine preference, and
whatever is already in your kitchen. This v1 proves the core flow with mock
data and manual ingredient entry — **no camera, photo parsing, or object
detection** — while keeping the structure ready for photo-based scanning in v2.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint       # typecheck
npm run build      # production bundle (vite + esbuild server)
```

## The flow

1. **Onboarding** — age, height, weight, goal, activity level, dietary preference.
2. **Cuisine** — six cuisines plus a "Surprise me" option.
3. **Kitchen** — manual ingredient entry: free-text tags + color-coded quick-add
   chips. A disabled "Scan your fridge with a photo" tile marks the v2 entry point.
4. **Meal result** — generated meal on a color-coded plate
   (protein = red, fish = blue, vegetables = green, carbs = yellow) with health
   score, macro summary, have/need ingredient list, and preparation steps.
5. **Plan mode** — 1 meal, meal prep (4 portions), or a 7-day week plan.

## Product logic

`src/lib/mealEngine.ts` is a rules-based stand-in for the future AI generator
(same interface: profile + cuisine + pantry in → scored meal out):

- **Weight loss** → rewards protein density and vegetables, penalizes calories/carbs.
- **Muscle gain** → rewards absolute protein and calories.
- **Maintenance** → rewards proximity to a balanced 30/40/30 macro split.
- Ingredient overlap with the user's kitchen boosts a meal's score; matched vs
  missing ingredients drive the "have / need" labels.
- Daily calorie target via Mifflin-St Jeor × activity factor, adjusted per goal.
- Dietary preference filters the pool; if a cuisine has no compliant meal, the
  engine relaxes the cuisine filter and says so in the "why this meal" card.

## Database-friendly structure

`src/types.ts` mirrors the future schema. `Meal` maps 1:1 onto the planned
`meals` table: `meal_name`, `ingredients`, `preparation`, `health_score`,
`calories`, `protein`, `carbs`, `fat`, `cuisine_type`. The mock library lives
in `src/data/mealsDb.ts` (18 meals across 6 cuisines). `PantryItem.source`
(`'manual' | 'photo'`) keeps the inventory model ready for v2 scanning.

## Layout

```
src/
  App.tsx               flow state machine + app shell
  types.ts              DB-shaped data model
  data/mealsDb.ts       mock meal library + quick-add suggestions
  lib/mealEngine.ts     scoring, goal biasing, week-plan generation
  lib/plateColors.ts    the plate color code
  components/           PlateVisual, MacroSummary, HealthScoreRing,
                        IngredientTagInput, shared ui primitives
  screens/              Onboarding, Cuisine, Inventory, Generating,
                        MealResult, PlanMode
server.ts               serves the SPA (v2 AI endpoints live in git history)
```
