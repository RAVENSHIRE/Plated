import { Meal } from '../types';

const MACROS = [
  { key: 'protein', label: 'Protein', color: '#f43f5e', kcalPerG: 4 },
  { key: 'carbs', label: 'Carbs', color: '#facc15', kcalPerG: 4 },
  { key: 'fat', label: 'Fat', color: '#a78bfa', kcalPerG: 9 },
] as const;

export default function MacroSummary({ meal }: { meal: Meal }) {
  return (
    <div className="space-y-3">
      {MACROS.map((m) => {
        const grams = meal[m.key];
        const pct = Math.min(100, Math.round(((grams * m.kcalPerG) / meal.calories) * 100));
        return (
          <div key={m.key} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-zinc-300">{m.label}</span>
              <span className="text-zinc-500 tabular-nums">
                {grams} g · {pct}% kcal
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, backgroundColor: m.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
