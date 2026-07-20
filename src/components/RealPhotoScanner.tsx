import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Check, 
  Trash2, 
  RefreshCw, 
  Sparkles, 
  AlertCircle, 
  Camera, 
  User, 
  Weight, 
  Flame, 
  Activity, 
  UtensilsCrossed, 
  Clock, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { UserProfile, DetectedItemDetail } from '../types';

interface RealPhotoScannerProps {
  userProfile: UserProfile;
  onChangeProfile: (profile: UserProfile) => void;
  fridgeItems: DetectedItemDetail[];
  freezerItems: DetectedItemDetail[];
  cabinetItems: DetectedItemDetail[];
  onSetFridgeItems: (items: DetectedItemDetail[]) => void;
  onSetFreezerItems: (items: DetectedItemDetail[]) => void;
  onSetCabinetItems: (items: DetectedItemDetail[]) => void;
  onGenerateMeal: () => void;
  isGeneratingMeal: boolean;
  mealGenerationError: string | null;
}

export default function RealPhotoScanner({
  userProfile,
  onChangeProfile,
  fridgeItems,
  freezerItems,
  cabinetItems,
  onSetFridgeItems,
  onSetFreezerItems,
  onSetCabinetItems,
  onGenerateMeal,
  isGeneratingMeal,
  mealGenerationError,
}: RealPhotoScannerProps) {
  // Loading status for each compartment scan
  const [loadingCompartments, setLoadingCompartments] = useState<{ [key: string]: boolean }>({
    fridge: false,
    freezer: false,
    dry_cabinet: false,
  });

  const [scanErrors, setScanErrors] = useState<{ [key: string]: string | null }>({
    fridge: null,
    freezer: null,
    dry_cabinet: null,
  });

  // Manual input fields for quick additions
  const [manualInputs, setManualInputs] = useState<{ [key: string]: string }>({
    fridge: '',
    freezer: '',
    dry_cabinet: '',
  });

  // Convert uploaded image file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Trigger Gemini photo analysis via Express backend
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, compartment: 'fridge' | 'freezer' | 'dry_cabinet') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadingCompartments(prev => ({ ...prev, [compartment]: true }));
    setScanErrors(prev => ({ ...prev, [compartment]: null }));

    try {
      const base64Image = await fileToBase64(file);

      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Image,
          category: compartment,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      const detected: DetectedItemDetail[] = data.items || [];

      if (compartment === 'fridge') onSetFridgeItems(detected);
      else if (compartment === 'freezer') onSetFreezerItems(detected);
      else if (compartment === 'dry_cabinet') onSetCabinetItems(detected);

    } catch (error: any) {
      console.error(`Failed scanning ${compartment}:`, error);
      setScanErrors(prev => ({ ...prev, [compartment]: error.message || 'Verification failed. Try another photo.' }));
    } finally {
      setLoadingCompartments(prev => ({ ...prev, [compartment]: false }));
    }
  };

  // Add ingredient manually
  const handleAddManual = (compartment: 'fridge' | 'freezer' | 'dry_cabinet') => {
    const text = manualInputs[compartment]?.trim();
    if (!text) return;

    const newItem: DetectedItemDetail = {
      name: text,
      confidence: 1.0,
      quantity: '1 portion',
      category: compartment,
      shelf_life_days: 7,
      expiry_concern: 'low',
    };

    if (compartment === 'fridge') onSetFridgeItems([...fridgeItems, newItem]);
    else if (compartment === 'freezer') onSetFreezerItems([...freezerItems, newItem]);
    else if (compartment === 'dry_cabinet') onSetCabinetItems([...cabinetItems, newItem]);

    setManualInputs(prev => ({ ...prev, [compartment]: '' }));
  };

  // Delete individual ingredient from list
  const handleDeleteItem = (itemName: string, compartment: 'fridge' | 'freezer' | 'dry_cabinet') => {
    if (compartment === 'fridge') {
      onSetFridgeItems(fridgeItems.filter(i => i.name !== itemName));
    } else if (compartment === 'freezer') {
      onSetFreezerItems(freezerItems.filter(i => i.name !== itemName));
    } else if (compartment === 'dry_cabinet') {
      onSetCabinetItems(cabinetItems.filter(i => i.name !== itemName));
    }
  };

  const handleResetCompartment = (compartment: 'fridge' | 'freezer' | 'dry_cabinet') => {
    if (compartment === 'fridge') onSetFridgeItems([]);
    else if (compartment === 'freezer') onSetFreezerItems([]);
    else if (compartment === 'dry_cabinet') onSetCabinetItems([]);
    setScanErrors(prev => ({ ...prev, [compartment]: null }));
  };

  const totalDetections = fridgeItems.length + freezerItems.length + cabinetItems.length;

  return (
    <div className="space-y-6">
      
      {/* 1. NUTRI-PROFILE PANEL */}
      <div className="backdrop-blur-xl bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6">
        <div className="flex items-center gap-2.5 mb-4 border-b border-zinc-900 pb-3">
          <div className="p-2 bg-neon-cyan/10 border border-neon-cyan/20 rounded-xl">
            <User className="w-4 h-4 text-neon-cyan" />
          </div>
          <div>
            <h3 className="text-sm font-sans font-bold text-white tracking-tight">
              Aesthetic User Nutri-Profile
            </h3>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">
              Personal Goals & Metabolic Metrics
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          
          {/* Goal Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Goal Option</label>
            <select
              value={userProfile.goal}
              onChange={(e) => onChangeProfile({ ...userProfile, goal: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-neon-cyan font-sans"
            >
              <option value="Weight Loss">📉 Weight Loss</option>
              <option value="Muscle Gain">💪 Muscle Gain</option>
              <option value="Healthy Eating">🥗 Balanced / Health</option>
              <option value="Keto Energy">🥑 High Fat / Keto</option>
            </select>
          </div>

          {/* Activity Level Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Activity Coefficient</label>
            <select
              value={userProfile.activity_level}
              onChange={(e) => onChangeProfile({ ...userProfile, activity_level: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-neon-cyan font-sans"
            >
              <option value="Sedentary">🛋️ Sedentary</option>
              <option value="Moderate">🚶 Moderate Walk</option>
              <option value="Active">🏃 Highly Active</option>
              <option value="Athlete">🏋️ Metabolic Machine</option>
            </select>
          </div>

          {/* Meal Mode */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Optimization Mode</label>
            <select
              value={userProfile.meal_mode}
              onChange={(e) => onChangeProfile({ ...userProfile, meal_mode: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-neon-cyan font-sans"
            >
              <option value="Single Meal">🍽️ Gourmet Single Meal</option>
              <option value="Meal Prep Idea">🍱 Bulk Meal Prep Idea</option>
              <option value="Weekly Meal Plan">📅 Weekly Meal Calendar</option>
            </select>
          </div>

          {/* Age */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Age (Years)</label>
            <input
              type="number"
              value={userProfile.age}
              onChange={(e) => onChangeProfile({ ...userProfile, age: parseInt(e.target.value, 10) || 0 })}
              className="w-full px-3 py-2 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-neon-cyan font-sans"
            />
          </div>

          {/* Height */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Height</label>
            <input
              type="text"
              value={userProfile.height}
              onChange={(e) => onChangeProfile({ ...userProfile, height: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-neon-cyan font-sans"
              placeholder="e.g. 180cm"
            />
          </div>

          {/* Weight */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Weight</label>
            <input
              type="text"
              value={userProfile.weight}
              onChange={(e) => onChangeProfile({ ...userProfile, weight: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-neon-cyan font-sans"
              placeholder="e.g. 75kg"
            />
          </div>

        </div>
      </div>

      {/* 2. REAL PHOTO SCAN COMPARTMENTS */}
      <div className="space-y-4">
        
        {/* SECTION NAME */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_8px_#00f0ff]" />
            Direct Visual Reconnaissance
          </span>
          <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-md">
            {totalDetections} identified nodes
          </span>
        </div>

        {/* COMPARTMENTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* FRIDGE PHOTO DROPZONE */}
          <CompartmentCard
            title="Fridge Interior"
            compartment="fridge"
            emoji="🧊"
            items={fridgeItems}
            isLoading={loadingCompartments.fridge}
            error={scanErrors.fridge}
            manualVal={manualInputs.fridge}
            onManualChange={(v) => setManualInputs(prev => ({ ...prev, fridge: v }))}
            onAddManual={() => handleAddManual('fridge')}
            onUpload={(e) => handlePhotoUpload(e, 'fridge')}
            onDelete={(name) => handleDeleteItem(name, 'fridge')}
            onReset={() => handleResetCompartment('fridge')}
          />

          {/* FREEZER PHOTO DROPZONE */}
          <CompartmentCard
            title="Freezer Vault"
            compartment="freezer"
            emoji="❄️"
            items={freezerItems}
            isLoading={loadingCompartments.freezer}
            error={scanErrors.freezer}
            manualVal={manualInputs.freezer}
            onManualChange={(v) => setManualInputs(prev => ({ ...prev, freezer: v }))}
            onAddManual={() => handleAddManual('freezer')}
            onUpload={(e) => handlePhotoUpload(e, 'freezer')}
            onDelete={(name) => handleDeleteItem(name, 'freezer')}
            onReset={() => handleResetCompartment('freezer')}
          />

          {/* DRY CABINET / PANTRY PHOTO DROPZONE */}
          <CompartmentCard
            title="Cupboard & Dry Stocks"
            compartment="dry_cabinet"
            emoji="🥫"
            items={cabinetItems}
            isLoading={loadingCompartments.dry_cabinet}
            error={scanErrors.dry_cabinet}
            manualVal={manualInputs.dry_cabinet}
            onManualChange={(v) => setManualInputs(prev => ({ ...prev, dry_cabinet: v }))}
            onAddManual={() => handleAddManual('dry_cabinet')}
            onUpload={(e) => handlePhotoUpload(e, 'dry_cabinet')}
            onDelete={(name) => handleDeleteItem(name, 'dry_cabinet')}
            onReset={() => handleResetCompartment('dry_cabinet')}
          />

        </div>
      </div>

      {/* 3. GENERATION ACTION TRIGGER */}
      <div className="pt-2">
        <button
          onClick={onGenerateMeal}
          disabled={totalDetections === 0 || isGeneratingMeal}
          className={`w-full py-4 rounded-2xl font-sans font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2.5 shadow-xl ${
            totalDetections === 0
              ? 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-400 to-emerald-400 hover:brightness-110 text-black shadow-cyan-950/20 active:scale-[0.99] cursor-pointer'
          }`}
        >
          {isGeneratingMeal ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-black" />
              <span>Plating Matrix Formulation in Progress...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-black animate-pulse" />
              <span>Compile & Formulate Meal Solution ({totalDetections} ingredients)</span>
            </>
          )}
        </button>

        {mealGenerationError && (
          <div className="mt-3 p-3 bg-red-950/20 border border-red-500/30 text-red-400 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{mealGenerationError}</span>
          </div>
        )}

        {totalDetections === 0 && (
          <p className="text-center text-[10px] text-zinc-500 font-mono uppercase mt-2">
            ⚠️ Capture at least 1 food photo or inject manual items to engage synthesis.
          </p>
        )}
      </div>

    </div>
  );
}

// Sub-component for individual compartment card
interface CompartmentCardProps {
  title: string;
  compartment: 'fridge' | 'freezer' | 'dry_cabinet';
  emoji: string;
  items: DetectedItemDetail[];
  isLoading: boolean;
  error: string | null;
  manualVal: string;
  onManualChange: (val: string) => void;
  onAddManual: () => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: (name: string) => void;
  onReset: () => void;
}

function CompartmentCard({
  title,
  compartment,
  emoji,
  items,
  isLoading,
  error,
  manualVal,
  onManualChange,
  onAddManual,
  onUpload,
  onDelete,
  onReset,
}: CompartmentCardProps) {
  const [showManualInput, setShowManualInput] = useState(false);

  return (
    <div className="backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between min-h-[300px] hover:border-zinc-800 transition-all">
      
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-zinc-900/60 pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{emoji}</span>
            <h4 className="text-xs font-sans font-bold text-white tracking-wide">{title}</h4>
          </div>
          {items.length > 0 && (
            <button
              onClick={onReset}
              className="text-[9px] font-mono text-zinc-500 hover:text-white border border-zinc-800 bg-zinc-900/30 px-1.5 py-0.5 rounded"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="py-12 text-center space-y-3">
            <div className="relative inline-block">
              <RefreshCw className="w-8 h-8 text-neon-cyan animate-spin" />
              <div className="absolute top-0 left-0 w-8 h-8 border border-dashed border-neon-cyan rounded-full animate-ping" />
            </div>
            <p className="text-[10px] font-mono text-neon-cyan uppercase tracking-wider animate-pulse">
              Plated Vision analyzing...
            </p>
          </div>
        )}

        {/* ERROR STATE */}
        {!isLoading && error && (
          <div className="p-3 bg-red-950/15 border border-red-500/20 text-red-400 rounded-xl text-xs space-y-2 mb-3">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="font-semibold">Scanner Error</span>
            </div>
            <p className="text-[10px] text-zinc-400 font-sans leading-relaxed">{error}</p>
          </div>
        )}

        {/* EMPTY STATE / FILE UPLOAD */}
        {!isLoading && items.length === 0 && (
          <div className="relative border border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-900/10 hover:bg-zinc-900/20 rounded-xl p-6 text-center transition-all cursor-pointer group">
            <input
              type="file"
              accept="image/*"
              onChange={onUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-zinc-950/60 border border-zinc-800 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                <Upload className="w-4 h-4 text-zinc-500 group-hover:text-neon-cyan transition-colors" />
              </div>
              <div>
                <span className="text-[11px] font-medium text-white block">Upload Image</span>
                <span className="text-[9px] text-zinc-500 block mt-0.5">Drag & drop or tap file</span>
              </div>
            </div>
          </div>
        )}

        {/* DETECTED ITEMS LIST */}
        {!isLoading && items.length > 0 && (
          <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
            {items.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-2 bg-zinc-900/40 border border-zinc-900 rounded-xl hover:border-zinc-800 transition-colors"
              >
                <div className="truncate flex-1 pr-2">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-[11px] font-semibold text-zinc-100 truncate">{item.name}</span>
                    <span 
                      className={`text-[8px] font-mono px-1 rounded uppercase tracking-widest shrink-0 ${
                        item.expiry_concern === 'high' 
                          ? 'bg-red-950 text-red-400 border border-red-500/20' 
                          : item.expiry_concern === 'medium'
                          ? 'bg-amber-950 text-amber-400 border border-amber-500/20'
                          : 'bg-zinc-950 text-zinc-500'
                      }`}
                      title={`${item.shelf_life_days} days remaining`}
                    >
                      {item.shelf_life_days}d
                    </span>
                  </div>
                  <div className="text-[9px] font-mono text-zinc-500 truncate">
                    Qty: {item.quantity} • {Math.round(item.confidence * 100)}% conf
                  </div>
                </div>

                <button
                  onClick={() => onDelete(item.name)}
                  className="p-1 rounded bg-zinc-950 border border-zinc-900 hover:border-red-500/40 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer shrink-0"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Manual injector inline form */}
      {!isLoading && (
        <div className="mt-3 pt-3 border-t border-zinc-900/60">
          {!showManualInput ? (
            <button
              onClick={() => setShowManualInput(true)}
              className="text-[10px] font-mono text-zinc-500 hover:text-white flex items-center gap-1.5"
            >
              <span>+ Inject Ingredient Node</span>
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="e.g. Avocado, Butter..."
                  value={manualVal}
                  onChange={(e) => onManualChange(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onAddManual()}
                  className="flex-1 min-w-0 px-2.5 py-1.5 bg-zinc-950 border border-zinc-900 rounded-lg text-[10px] text-white focus:outline-none focus:border-neon-cyan font-sans"
                />
                <button
                  onClick={onAddManual}
                  className="px-2.5 bg-neon-cyan text-black rounded-lg text-[10px] font-semibold hover:brightness-110 active:scale-95 transition-all"
                >
                  Add
                </button>
              </div>
              <button
                onClick={() => setShowManualInput(false)}
                className="text-[9px] font-mono text-zinc-600 hover:text-zinc-400 block"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
