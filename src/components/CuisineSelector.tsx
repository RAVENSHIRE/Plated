import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { CuisineType } from '../types';

interface CuisineOption {
  type: CuisineType;
  label: string;
  emoji: string;
  description: string;
  color: string;
}

const CUISINE_OPTIONS: CuisineOption[] = [
  { type: 'Italian', label: 'Italian', emoji: '🇮🇹', description: 'Fresh pasta, olive oil, and herbs', color: 'from-emerald-500/20 to-red-500/20' },
  { type: 'Vietnamese', label: 'Vietnamese', emoji: '🇻🇳', description: 'Light, citrusy, and aromatic', color: 'from-amber-500/20 to-rose-500/20' },
  { type: 'Asian', label: 'Asian Fusion', emoji: '🥢', description: 'Umami, soy glaze, and woks', color: 'from-red-500/20 to-yellow-500/20' },
  { type: 'Healthy', label: 'Healthy & Lean', emoji: '🥗', description: 'High protein, low-carb greens', color: 'from-green-500/20 to-cyan-500/20' },
  { type: 'Breakfast', label: 'Morning Fuel', emoji: '🍳', description: 'Eggs, quick crisps, and energy', color: 'from-yellow-400/20 to-amber-600/20' },
  { type: 'Light Snack', label: 'Light Bites', emoji: '🥑', description: 'Sautéed snacks and warm salads', color: 'from-emerald-400/20 to-teal-600/20' },
  { type: 'US', label: 'US Classic', emoji: '🇺🇸', description: 'Skillet sears, cutlets, and butter', color: 'from-blue-500/20 to-red-500/20' },
  { type: 'Fast Food', label: 'Quick Comfort', emoji: '🍕', description: 'Rapid melts, fast bakes, comfort', color: 'from-orange-500/20 to-yellow-500/20' }
];

interface CuisineSelectorProps {
  onSelect: (cuisine: CuisineType) => void;
  selectedCuisine: CuisineType | null;
}

export default function CuisineSelector({ onSelect, selectedCuisine }: CuisineSelectorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-neon-cyan animate-pulse" />
        <h2 className="text-lg font-sans font-medium text-white tracking-tight">
          Select Culinary Vector
        </h2>
      </div>

      <p className="text-xs text-zinc-400 mb-6 font-sans">
        Choose a cuisine direction. Plated's AI will restrict inventory recipes to your choice while optimizing your available ingredients.
      </p>

      <div className="grid grid-cols-2 gap-3.5">
        {CUISINE_OPTIONS.map((opt) => {
          const isSelected = selectedCuisine === opt.type;
          return (
            <motion.button
              key={opt.type}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(opt.type)}
              className={`text-left p-4 rounded-2xl transition-all duration-300 relative overflow-hidden group ${
                isSelected
                  ? 'bg-zinc-900 border-neon-cyan/80 shadow-[0_0_20px_rgba(0,240,255,0.15)] border-2'
                  : 'bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {/* Corner radial ambient color block on hover */}
              <div className={`absolute -right-6 -bottom-6 w-20 h-20 bg-gradient-to-br ${opt.color} rounded-full blur-xl group-hover:opacity-100 opacity-60 transition-opacity duration-500`} />

              <div className="flex items-center justify-between mb-2.5 relative z-10">
                <span className="text-2xl filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                  {opt.emoji}
                </span>
                <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${
                  isSelected ? 'text-neon-cyan translate-x-0.5' : 'text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5'
                }`} />
              </div>

              <div className="relative z-10">
                <h3 className={`text-sm font-semibold tracking-wide ${isSelected ? 'text-neon-cyan' : 'text-white'}`}>
                  {opt.label}
                </h3>
                <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                  {opt.description}
                </p>
              </div>

              {isSelected && (
                <div className="absolute top-2 right-2 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-ping absolute" />
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan relative" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
