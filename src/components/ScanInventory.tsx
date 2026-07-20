import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Check, Trash2, Sliders, ChevronDown, RefreshCw, ShoppingCart, Info, Sparkles } from 'lucide-react';
import { Ingredient } from '../types';
import { FRIDGE_PREPOPULATED, PANTRY_PREPOPULATED } from '../recipesData';

interface ScanInventoryProps {
  currentStep: number;
  fridgeScanned: boolean;
  cabinetScanned: boolean;
  scannedFridgeItems: string[];
  scannedPantryItems: string[];
  shoppingCart: string[];
  onToggleFridgeItem: (itemName: string) => void;
  onTogglePantryItem: (itemName: string) => void;
  onAddCustomItem: (name: string, category: 'fridge' | 'pantry') => void;
  onResetScan: () => void;
}

export default function ScanInventory({
  currentStep,
  fridgeScanned,
  cabinetScanned,
  scannedFridgeItems,
  scannedPantryItems,
  shoppingCart,
  onToggleFridgeItem,
  onTogglePantryItem,
  onAddCustomItem,
  onResetScan,
}: ScanInventoryProps) {
  const [customName, setCustomName] = useState('');
  const [activeCategory, setActiveCategory] = useState<'fridge' | 'pantry'>('fridge');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    onAddCustomItem(customName.trim(), activeCategory);
    setCustomName('');
    setShowAddForm(false);
  };

  const isFridgeActive = currentStep === 2 || (currentStep > 2 && fridgeScanned);
  const isPantryActive = currentStep === 3 || (currentStep > 3 && cabinetScanned);

  return (
    <div className="w-full">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-neon-cyan animate-pulse" />
          <h2 className="text-lg font-sans font-medium text-white tracking-tight">
            Inventory Core Analysis
          </h2>
        </div>
        
        {(fridgeScanned || cabinetScanned) && (
          <button
            onClick={onResetScan}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 text-[10px] font-mono text-zinc-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>RESET ALL SCANS</span>
          </button>
        )}
      </div>

      <p className="text-xs text-zinc-400 mb-6 font-sans">
        Review ingredients identified by Plated's computer vision. Toggle items to simulate pantry depletion, or add custom items.
      </p>

      {/* FRIDGE SCAN DISPLAY */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${fridgeScanned ? 'bg-neon-green shadow-[0_0_8px_#39ff14]' : 'bg-zinc-700'}`} />
            FRIDGE INTERIOR
          </span>
          <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-md">
            {scannedFridgeItems.length} active detections
          </span>
        </div>

        {!fridgeScanned ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/20 p-6 text-center">
            <span className="text-2xl block mb-2 opacity-30">🧊</span>
            <span className="text-xs font-mono text-zinc-500">
              Awaiting camera trigger: "Scan Fridge Interior"
            </span>
            {currentStep < 2 && (
              <span className="text-[10px] text-zinc-600 block mt-1">
                Select cuisine first to unlock this section.
              </span>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {FRIDGE_PREPOPULATED.map((item) => {
              const isScanned = scannedFridgeItems.includes(item.name);
              return (
                <motion.button
                  key={item.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onToggleFridgeItem(item.name)}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all duration-300 ${
                    isScanned
                      ? 'bg-zinc-900/90 border-neon-cyan/30 text-white'
                      : 'bg-zinc-950/20 border-zinc-800/60 text-zinc-500 line-through opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="text-xl shrink-0">{item.icon}</span>
                    <div className="truncate">
                      <div className="text-xs font-semibold truncate">{item.name}</div>
                      <div className="text-[9px] font-mono text-zinc-500 truncate">{item.quantity}</div>
                    </div>
                  </div>
                  {isScanned && (
                    <div className="w-4 h-4 rounded-full bg-neon-cyan/20 border border-neon-cyan/40 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-neon-cyan" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* PANTRY SCAN DISPLAY */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${cabinetScanned ? 'bg-neon-green shadow-[0_0_8px_#39ff14]' : 'bg-zinc-700'}`} />
            DRY STOCK STAPLES
          </span>
          <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-md">
            {scannedPantryItems.length} active detections
          </span>
        </div>

        {!cabinetScanned ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/20 p-6 text-center">
            <span className="text-2xl block mb-2 opacity-30">🪵</span>
            <span className="text-xs font-mono text-zinc-500">
              Awaiting camera trigger: "Scan Dry Stock Cabinet"
            </span>
            {currentStep < 3 && (
              <span className="text-[10px] text-zinc-600 block mt-1">
                Scan your refrigerator first to unlock pantry scanning.
              </span>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {PANTRY_PREPOPULATED.map((item) => {
              const isScanned = scannedPantryItems.includes(item.name);
              return (
                <motion.button
                  key={item.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onTogglePantryItem(item.name)}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all duration-300 ${
                    isScanned
                      ? 'bg-zinc-900/90 border-neon-cyan/30 text-white'
                      : 'bg-zinc-950/20 border-zinc-800/60 text-zinc-500 line-through opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="text-xl shrink-0">{item.icon}</span>
                    <div className="truncate">
                      <div className="text-xs font-semibold truncate">{item.name}</div>
                      <div className="text-[9px] font-mono text-zinc-500 truncate">{item.quantity}</div>
                    </div>
                  </div>
                  {isScanned && (
                    <div className="w-4 h-4 rounded-full bg-neon-cyan/20 border border-neon-cyan/40 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-neon-cyan" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* SHOPPING CART / UPGRADE ITEMS SIMULATOR */}
      {shoppingCart.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-2xl bg-cyan-950/15 border border-neon-cyan/30 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20">
              <ShoppingCart className="w-4 h-4 text-neon-cyan animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white font-sans">Simulated Cart Active</h4>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                Purchased: <span className="text-neon-cyan font-bold">{shoppingCart.join(', ')}</span> (Injected to Inventory)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-[9px] font-mono uppercase px-2 py-1 rounded-md">
            <span>DELIVERED</span>
          </div>
        </motion.div>
      )}

      {/* CUSTOM INGREDIENT INJECTOR */}
      {(fridgeScanned || cabinetScanned) && (
        <div className="mt-4">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-2 border border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-900/20 hover:bg-zinc-900/40 rounded-xl flex items-center justify-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Inject Custom Ingredient Item</span>
            </button>
          ) : (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onSubmit={handleSubmitCustom}
              className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">INJECT INGREDIENT</span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-zinc-500 hover:text-white text-xs"
                >
                  Cancel
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., Avocado, Beef, Butter"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-neon-cyan font-sans"
                  required
                />

                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value as 'fridge' | 'pantry')}
                  className="px-2 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-neon-cyan font-mono"
                >
                  <option value="fridge">Fridge</option>
                  <option value="pantry">Cabinet</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-neon-cyan text-black font-sans text-xs font-semibold rounded-lg hover:bg-cyan-400 transition-colors"
              >
                Inject Node into Scan Map
              </button>
            </motion.form>
          )}
        </div>
      )}
    </div>
  );
}
