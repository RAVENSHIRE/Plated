import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { SUGGESTED_INGREDIENTS } from '../data/mealsDb';
import { CATEGORY_HEX } from '../lib/plateColors';
import { IngredientCategory } from '../types';

// Manual inventory entry: free-text tags plus color-coded quick-add
// chips. This screen is the v1 stand-in for the future photo scanner —
// both produce the same list of ingredient names.
export default function IngredientTagInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState('');

  const has = (name: string) => value.some((v) => v.toLowerCase() === name.toLowerCase());

  const add = (name: string) => {
    const clean = name.trim();
    if (clean && !has(clean)) onChange([...value, clean]);
  };

  const remove = (name: string) => onChange(value.filter((v) => v !== name));

  const toggle = (name: string) => (has(name) ? remove(name) : add(name));

  const submitDraft = () => {
    add(draft);
    setDraft('');
  };

  return (
    <div className="space-y-5">
      {/* free text entry */}
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submitDraft()}
          placeholder="Type an ingredient, e.g. salmon…"
          className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-lime-400/60"
        />
        <button
          onClick={submitDraft}
          disabled={!draft.trim()}
          className="rounded-2xl bg-zinc-800 px-4 text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          aria-label="Add ingredient"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* current kitchen */}
      {value.length > 0 ? (
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-3.5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Your kitchen · {value.length}
            </span>
            <button
              onClick={() => onChange([])}
              className="text-[11px] text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {value.map((name) => (
              <span
                key={name}
                className="flex items-center gap-1 rounded-full border border-lime-400/30 bg-lime-400/10 py-1 pl-3 pr-1.5 text-xs font-medium text-lime-200"
              >
                {name}
                <button
                  onClick={() => remove(name)}
                  className="rounded-full p-0.5 text-lime-300/60 hover:bg-lime-400/20 hover:text-white transition-colors cursor-pointer"
                  aria-label={`Remove ${name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-800 p-5 text-center">
          <span className="text-2xl">🧺</span>
          <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
            Your kitchen is empty. Add what you have — or skip ahead and we'll assume the basics.
          </p>
        </div>
      )}

      {/* quick add, color coded by plate category */}
      <div className="space-y-3">
        {SUGGESTED_INGREDIENTS.map((group) => (
          <div key={group.category}>
            <div className="mb-1.5 flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: CATEGORY_HEX[group.category as IngredientCategory] }}
              />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                {group.label}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {group.items.map((item) => {
                const active = has(item);
                return (
                  <button
                    key={item}
                    onClick={() => toggle(item)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                      active
                        ? 'border-lime-400/50 bg-lime-400/15 text-lime-200'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
