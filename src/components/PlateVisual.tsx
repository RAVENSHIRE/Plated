import { motion } from 'motion/react';
import { IngredientCategory, Meal } from '../types';
import { CATEGORY_HEX, CATEGORY_LABEL, PLATE_WEIGHT } from '../lib/plateColors';

interface PlateSegment {
  category: IngredientCategory;
  share: number; // 0..1
}

function plateSegments(meal: Meal): PlateSegment[] {
  const weights = new Map<IngredientCategory, number>();
  for (const ing of meal.ingredients) {
    const w = PLATE_WEIGHT[ing.category];
    if (w) weights.set(ing.category, (weights.get(ing.category) ?? 0) + w);
  }
  const total = [...weights.values()].reduce((a, b) => a + b, 0) || 1;
  const order: IngredientCategory[] = ['protein', 'fish', 'vegetable', 'carb'];
  return order
    .filter((c) => weights.has(c))
    .map((c) => ({ category: c, share: (weights.get(c) ?? 0) / total }));
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function annularSector(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  start: number,
  end: number,
): string {
  const sweep = Math.min(end - start, 359.9);
  end = start + sweep;
  const largeArc = sweep > 180 ? 1 : 0;
  const o1 = polar(cx, cy, rOuter, start);
  const o2 = polar(cx, cy, rOuter, end);
  const i1 = polar(cx, cy, rInner, end);
  const i2 = polar(cx, cy, rInner, start);
  return [
    `M ${o1.x} ${o1.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${o2.x} ${o2.y}`,
    `L ${i1.x} ${i1.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${i2.x} ${i2.y}`,
    'Z',
  ].join(' ');
}

// The signature "plate" render: a dinner plate seen from above, food
// zones drawn as color-coded ring segments, calories in the middle.
export default function PlateVisual({ meal, size = 240 }: { meal: Meal; size?: number }) {
  const segments = plateSegments(meal);
  const c = 130;
  const gap = segments.length > 1 ? 3 : 0; // degrees between segments

  let angle = 0;
  const paths = segments.map((seg) => {
    const span = seg.share * 360;
    const d = annularSector(c, c, 104, 58, angle + gap / 2, angle + span - gap / 2);
    angle += span;
    return { ...seg, d };
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.svg
        viewBox="0 0 260 260"
        width={size}
        height={size}
        initial={{ opacity: 0, scale: 0.85, rotate: -12 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 16 }}
      >
        {/* plate rim */}
        <circle cx={c} cy={c} r={126} fill="#101013" stroke="#2b2b31" strokeWidth={2} />
        <circle cx={c} cy={c} r={112} fill="none" stroke="#3a3a42" strokeWidth={1.5} />
        {/* food segments */}
        {paths.map((p, i) => (
          <motion.path
            key={p.category}
            d={p.d}
            fill={CATEGORY_HEX[p.category]}
            fillOpacity={0.88}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.12, type: 'spring', stiffness: 160, damping: 18 }}
            style={{ transformOrigin: '130px 130px' }}
          />
        ))}
        {/* center well */}
        <circle cx={c} cy={c} r={52} fill="#18181d" stroke="#2b2b31" strokeWidth={1.5} />
        <text x={c} y={c - 4} textAnchor="middle" fill="#fafafa" fontSize={30} fontWeight={600} fontFamily="Outfit, sans-serif">
          {meal.calories}
        </text>
        <text x={c} y={c + 20} textAnchor="middle" fill="#8a8a94" fontSize={12} letterSpacing={2} fontFamily="Outfit, sans-serif">
          KCAL
        </text>
      </motion.svg>

      {/* legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
        {paths.map((p) => (
          <span key={p.category} className="flex items-center gap-1.5 text-xs text-zinc-400">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CATEGORY_HEX[p.category] }} />
            {CATEGORY_LABEL[p.category]}
            <span className="text-zinc-600">{Math.round(p.share * 100)}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}
