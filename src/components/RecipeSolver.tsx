import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShoppingCart, ChevronRight, Check, AlertTriangle, Clock, Activity, Cpu } from 'lucide-react';
import { CuisineType, Recipe } from '../types';
import { RECIPES_DATABASE } from '../recipesData';

interface RecipeSolverProps {
  currentStep: number;
  selectedCuisine: CuisineType | null;
  scannedFridgeItems: string[];
  scannedPantryItems: string[];
  shoppingCart: string[];
  onSelectRecipe: (recipe: Recipe) => void;
  onAddToCart: (itemName: string) => void;
  onAdvanceToHologram: () => void;
}

const ANALYZING_STEPS = [
  'Extracting active ingredient molecular nodes...',
  'Sifting culinary flavor database (12,500+ rules)...',
  'Analyzing macronutrient distribution maps...',
  'Compiling zero-waste matching matrices...',
  'Formatting 3D volumetric projections...'
];

export default function RecipeSolver({
  currentStep,
  selectedCuisine,
  scannedFridgeItems,
  scannedPantryItems,
  shoppingCart,
  onSelectRecipe,
  onAddToCart,
  onAdvanceToHologram,
}: RecipeSolverProps) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeLogIndex, setActiveLogIndex] = useState(0);

  // Automatically simulate analysis loading on step 4
  useEffect(() => {
    if (currentStep === 4) {
      setLoadingProgress(0);
      setActiveLogIndex(0);
      
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 150);

      const logInterval = setInterval(() => {
        setActiveLogIndex((prev) => (prev < ANALYZING_STEPS.length - 1 ? prev + 1 : prev));
      }, 600);

      return () => {
        clearInterval(interval);
        clearInterval(logInterval);
      };
    }
  }, [currentStep]);

  // Filter recipes based on cuisine & scanned items
  const allAvailableIngredients = [
    ...scannedFridgeItems,
    ...scannedPantryItems,
    ...shoppingCart
  ];

  const matchedCuisineRecipes = RECIPES_DATABASE.filter(
    (recipe) => recipe.cuisine === selectedCuisine
  );

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {loadingProgress < 100 ? (
          /* --- AI WHISPERING LOADING STATE --- */
          <motion.div
            key="ai-whisper-loading"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="p-8 rounded-3xl glass-cyan flex flex-col items-center justify-center text-center relative overflow-hidden"
          >
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.05),transparent)] pointer-events-none" />

            <div className="w-16 h-16 rounded-full bg-cyan-950/40 border border-neon-cyan/30 flex items-center justify-center mb-6 relative">
              <Cpu className="w-8 h-8 text-neon-cyan animate-pulse" />
              <div className="absolute -inset-2 rounded-full border border-neon-cyan/25 animate-ping" />
            </div>

            <h3 className="text-lg font-sans font-medium text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-neon-cyan animate-pulse shrink-0" />
              AI Whispering Solutions...
            </h3>
            
            <p className="text-xs text-zinc-400 mt-2 max-w-sm">
              Plated's neural core is sifting matches to optimize flavor, cook time, and eliminate food waste for <strong>{selectedCuisine}</strong> cuisine.
            </p>

            {/* Custom Terminal Console logs */}
            <div className="w-full bg-black/60 border border-zinc-800/80 rounded-xl p-4 mt-6 text-left font-mono text-[10px] space-y-2 h-28 flex flex-col justify-end">
              {ANALYZING_STEPS.slice(0, activeLogIndex + 1).map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-zinc-400 animate-fade-in">
                  <span className="text-neon-cyan select-none shrink-0">&gt;&gt;</span>
                  <span className={idx === activeLogIndex ? 'text-neon-cyan font-bold' : ''}>
                    {step}
                  </span>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden mt-6 border border-zinc-800">
              <motion.div
                className="bg-neon-cyan h-full rounded-full shadow-[0_0_12px_rgba(0,240,255,1)]"
                initial={{ width: '0%' }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <div className="text-[10px] font-mono text-neon-cyan mt-2">
              COMPUTING MATRICES: {loadingProgress}%
            </div>
          </motion.div>
        ) : (
          /* --- RECIPE RESULTS PANEL --- */
          <motion.div
            key="recipes-grid"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-neon-cyan" />
                <h2 className="text-base font-sans font-bold text-white tracking-tight">
                  Matched AR Projections
                </h2>
              </div>
              <span className="text-[10px] font-mono text-neon-green border border-neon-green/30 bg-neon-green/10 px-2 py-0.5 rounded-full">
                OPTIMIZED FOR WASTE
              </span>
            </div>

            <div className="space-y-4">
              {matchedCuisineRecipes.map((recipe) => {
                // Determine missing items and lock states
                const missingItem = recipe.missingIngredient;
                const hasMissingItem = missingItem ? !allAvailableIngredients.includes(missingItem) : false;
                const isPremiumUpgrade = recipe.type === 'upgrade';
                
                return (
                  <motion.div
                    key={recipe.id}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden relative ${
                      hasMissingItem 
                        ? 'bg-zinc-950/20 border-zinc-800/80 hover:border-zinc-700/80' 
                        : 'bg-zinc-900/60 border-zinc-800 hover:border-neon-cyan/40 hover:bg-zinc-900/80'
                    }`}
                  >
                    {/* Visual header indicator */}
                    <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/40 border-b border-zinc-800/80">
                      <span className={`text-[10px] font-mono uppercase tracking-widest ${
                        isPremiumUpgrade ? 'text-neon-pink' : 'text-neon-green'
                      }`}>
                        {isPremiumUpgrade ? '✨ Premium Upgrade Choice' : '✅ 100% Zero-Waste Match'}
                      </span>
                      
                      {isPremiumUpgrade && hasMissingItem && (
                        <span className="flex items-center gap-1 text-[10px] text-amber-500 font-mono">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>1 MISSING ITEM</span>
                        </span>
                      )}
                    </div>

                    <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: Recipe Details */}
                      <div className="space-y-2 flex-1">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2 font-sans">
                          {recipe.title}
                        </h3>

                        {/* Cooking specs & nutrition */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-zinc-400 font-mono">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                            <span>Prep: {recipe.prepTime} // Cook: {recipe.cookTime}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                            <span className="text-zinc-300 font-bold">{recipe.calories} kcal</span>
                          </span>
                        </div>

                        {/* Macro details */}
                        <div className="flex gap-2.5 text-[10px] font-mono">
                          <span className="px-2 py-0.5 rounded bg-zinc-950 text-zinc-400">
                            P: <span className="text-white font-bold">{recipe.macros.protein}</span>
                          </span>
                          <span className="px-2 py-0.5 rounded bg-zinc-950 text-zinc-400">
                            C: <span className="text-white font-bold">{recipe.macros.carbs}</span>
                          </span>
                          <span className="px-2 py-0.5 rounded bg-zinc-950 text-zinc-400">
                            F: <span className="text-white font-bold">{recipe.macros.fat}</span>
                          </span>
                        </div>

                        {/* Ingredients Tag */}
                        <div className="text-[10px] text-zinc-500">
                          Requires:{' '}
                          <span className="text-zinc-300 font-medium">
                            {recipe.ingredientsNeeded.map((ing) => {
                              const isScanned = allAvailableIngredients.includes(ing);
                              return (
                                <span
                                  key={ing}
                                  className={`mr-2.5 inline-flex items-center gap-0.5 ${
                                    isScanned ? 'text-zinc-300' : 'text-amber-500 font-bold decoration-dashed underline'
                                  }`}
                                >
                                  {isScanned ? '✓' : '⚠️'} {ing}
                                </span>
                              );
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="shrink-0 flex items-center justify-end">
                        {isPremiumUpgrade && hasMissingItem && missingItem ? (
                          /* Cart Trigger for Premium missing items */
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => onAddToCart(missingItem)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-black text-xs font-sans font-semibold hover:brightness-110 shadow-lg shadow-amber-900/10 transition-all"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Add missing {missingItem}</span>
                          </motion.button>
                        ) : (
                          /* Projection launch button */
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
                              onSelectRecipe(recipe);
                              onAdvanceToHologram();
                            }}
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-neon-cyan text-black text-xs font-sans font-semibold hover:brightness-110 shadow-[0_0_15px_rgba(0,240,255,0.25)] transition-all"
                          >
                            <span>Launch AR Projection</span>
                            <ChevronRight className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
