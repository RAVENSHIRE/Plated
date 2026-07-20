import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChefHat, 
  Compass, 
  Camera, 
  Cpu, 
  Layers, 
  Sparkles, 
  RefreshCw, 
  Check, 
  ArrowRight, 
  HelpCircle,
  ShoppingBag,
  ListChecks,
  BookmarkCheck,
  AlertCircle
} from 'lucide-react';

import { CuisineType, Recipe, UserProfile, DetectedItemDetail } from './types';
import CameraFeed from './components/CameraFeed';
import CuisineSelector from './components/CuisineSelector';
import ScanInventory from './components/ScanInventory';
import RecipeSolver from './components/RecipeSolver';
import RecipeProgressCard from './components/RecipeProgressCard';
import RealPhotoScanner from './components/RealPhotoScanner';

export default function App() {
  // Input mode: simulated sandbox vs actual file scan
  const [inputMode, setInputMode] = useState<'simulated' | 'real_upload'>('simulated');

  // User Nutrition & Profile state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    goal: 'Weight Loss',
    age: 28,
    height: '180cm',
    weight: '75kg',
    activity_level: 'Moderate',
    cuisine_preference: 'Italian',
    meal_mode: 'Single Meal',
  });

  // State Initialization for classic simulation
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineType | null>(null);
  const [fridgeScanned, setFridgeScanned] = useState<boolean>(false);
  const [cabinetScanned, setCabinetScanned] = useState<boolean>(false);
  
  // Scanned item tracking
  const [scannedFridgeItems, setScannedFridgeItems] = useState<string[]>([]);
  const [scannedPantryItems, setScannedPantryItems] = useState<string[]>([]);
  const [shoppingCart, setShoppingCart] = useState<string[]>([]);
  
  // Real Photo Vision state arrays
  const [realFridgeItems, setRealFridgeItems] = useState<DetectedItemDetail[]>([]);
  const [realFreezerItems, setRealFreezerItems] = useState<DetectedItemDetail[]>([]);
  const [realCabinetItems, setRealCabinetItems] = useState<DetectedItemDetail[]>([]);
  const [isGeneratingMeal, setIsGeneratingMeal] = useState(false);
  const [mealGenerationError, setMealGenerationError] = useState<string | null>(null);

  // Selected recipe state
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [activeRecipeStep, setActiveRecipeStep] = useState<number>(0);
  const [voiceGuided, setVoiceGuided] = useState<boolean>(true);

  // Triggered when scans are fired from Camera Component
  const handleTriggerScan = () => {
    if (currentStep === 2) {
      setFridgeScanned(true);
      setScannedFridgeItems(['Eggs', 'Spinach', 'Chicken Breast', 'Salmon', 'Tomato']);
    } else if (currentStep === 3) {
      setCabinetScanned(true);
      setScannedPantryItems(['Pasta', 'Rice', 'Soy Sauce', 'Olive Oil', 'Garlic']);
    }
  };

  // Cuisine Selected
  const handleSelectCuisine = (cuisine: CuisineType) => {
    setSelectedCuisine(cuisine);
    setCurrentStep(2); // Auto-advance to fridge scan
  };

  // Manual toggle items
  const handleToggleFridgeItem = (name: string) => {
    setScannedFridgeItems((prev) => 
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const handleTogglePantryItem = (name: string) => {
    setScannedPantryItems((prev) => 
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const handleAddCustomItem = (name: string, category: 'fridge' | 'pantry') => {
    if (category === 'fridge') {
      setScannedFridgeItems((prev) => [...prev, name]);
    } else {
      setScannedPantryItems((prev) => [...prev, name]);
    }
  };

  // Shopping cart simulator
  const handleAddToCart = (item: string) => {
    setShoppingCart((prev) => [...prev, item]);
  };

  // Reset helper
  const handleReset = () => {
    setCurrentStep(1);
    setSelectedCuisine(null);
    setFridgeScanned(false);
    setCabinetScanned(false);
    setScannedFridgeItems([]);
    setScannedPantryItems([]);
    setShoppingCart([]);
    setRealFridgeItems([]);
    setRealFreezerItems([]);
    setRealCabinetItems([]);
    setMealGenerationError(null);
    setSelectedRecipe(null);
    setActiveRecipeStep(0);
  };

  // Real-world custom recipe generator via server-side Gemini 3.5 Flash proxy
  const handleGenerateMeal = async () => {
    setIsGeneratingMeal(true);
    setMealGenerationError(null);

    try {
      const inventory = {
        fridge: realFridgeItems.map(i => i.name),
        freezer: realFreezerItems.map(i => i.name),
        dry_cabinet: realCabinetItems.map(i => i.name),
      };

      const response = await fetch('/api/generate-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile,
          inventory,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Meal generation failed with status ${response.status}`);
      }

      const customMeal = await response.json();
      
      // Transform custom Gemini 3.5 structured output to standard Recipe interface
      const formattedRecipe: Recipe = {
        id: 'custom-real-meal',
        title: customMeal.meal?.meal_name || 'AI Personalized Plated Meal',
        cuisine: (customMeal.meal?.cuisine_type || userProfile.cuisine_preference) as CuisineType,
        type: 'zero-waste',
        prepTime: '12 min',
        cookTime: '18 min',
        calories: customMeal.meal?.calories || 480,
        macros: {
          protein: `${customMeal.meal?.protein_g || 32}g`,
          carbs: `${customMeal.meal?.carbs_g || 45}g`,
          fat: `${customMeal.meal?.fat_g || 16}g`,
        },
        ingredientsNeeded: (customMeal.meal?.ingredients || []).map(
          (ing: any) => `${ing.name} (${ing.amount}) - ${ing.use_reason}`
        ),
        steps: (customMeal.meal?.preparation || []).map((stepText: string, index: number) => ({
          text: stepText,
          duration: `${3 + (index % 3)} mins`,
          temp: index === 0 ? 'Medium-High' : 'Medium Heat',
        })),
        hologramColor: '#39ff14', // High-tech Neon Green
        hologramDesign: 'nodes',
      };

      setSelectedRecipe(formattedRecipe);
      setActiveRecipeStep(0);
      setCurrentStep(5); // Unlock step 5: AR Hologram projection guide

    } catch (error: any) {
      console.error('Failed generating custom meal:', error);
      setMealGenerationError(error.message || 'Error formulating customized solution.');
    } finally {
      setIsGeneratingMeal(false);
    }
  };

  // Nav Step descriptors
  const NARRATIVE_STEPS = [
    { id: 1, name: 'Plate Focus', icon: Compass },
    { id: 2, name: 'Fridge Scan', icon: Camera },
    { id: 3, name: 'Pantry Scan', icon: ListChecks },
    { id: 4, name: 'AI Solver', icon: Cpu },
    { id: 5, name: 'AR Projection', icon: Layers }
  ];

  const canNavigateToStep = (stepId: number) => {
    if (inputMode === 'real_upload') {
      if (stepId === 1) return true;
      if (stepId === 5) return selectedRecipe !== null;
      return false; // Intermediary scanning steps are consolidated in dashboard
    }
    if (stepId === 1) return true;
    if (stepId === 2) return selectedCuisine !== null;
    if (stepId === 3) return selectedCuisine !== null && fridgeScanned;
    if (stepId === 4) return selectedCuisine !== null && fridgeScanned && cabinetScanned;
    if (stepId === 5) return selectedRecipe !== null;
    return false;
  };

  const handleStepClick = (stepId: number) => {
    if (canNavigateToStep(stepId)) {
      setCurrentStep(stepId);
    }
  };

  return (
    <div id="plated_app_root" className="min-h-screen bg-black text-white selection:bg-neon-cyan selection:text-black font-sans relative overflow-x-hidden">
      {/* Background ambient lighting blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-rose-950/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER BAR */}
      <header id="app_header" className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse mt-2 shrink-0" />
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tighter text-white font-sans">
                  PLATED <span className="text-cyan-400 font-light italic">OS v.1.04</span>
                </h1>
                <span className="text-[9px] font-mono border border-neon-cyan/20 bg-neon-cyan/10 text-neon-cyan px-1.5 py-0.5 rounded uppercase tracking-wider">
                  HOLO INTERCONNECT
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-semibold font-mono">
                Scanning Environment • Calibration: 99.8%
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 px-4 py-1.5 rounded-lg text-right hidden sm:block">
              <div className="text-[9px] uppercase text-zinc-500 font-mono">Active Cuisine</div>
              <div className="text-cyan-400 font-medium tracking-wide uppercase text-xs">
                {selectedCuisine ? selectedCuisine : 'Not Selected'}
              </div>
            </div>
            
            <div className="backdrop-blur-md bg-white/5 border border-white/10 px-4 py-1.5 rounded-lg text-right hidden sm:block">
              <div className="text-[9px] uppercase text-zinc-500 font-mono">Network</div>
              <div className="text-white font-medium text-xs font-mono">PLATED-NET-5G</div>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 text-xs font-semibold text-zinc-400 hover:text-white transition-all font-sans cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Assistant</span>
            </button>
          </div>
        </div>
      </header>

      {/* CORE WORKFLOW PROGRESS STEP BAR */}
      <nav id="app_nav" className="bg-zinc-950 border-b border-zinc-900 px-4 py-3.5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Step badges */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              {NARRATIVE_STEPS.map((step) => {
                const isActive = currentStep === step.id;
                const isPassed = currentStep > step.id;
                const isClickable = canNavigateToStep(step.id);
                const StepIcon = step.icon;

                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(step.id)}
                    disabled={!isClickable}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-sans text-xs transition-all duration-300 ${
                      isActive
                        ? 'bg-zinc-900 border-neon-cyan text-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                        : isPassed
                        ? 'bg-zinc-900/60 border-neon-green/40 text-neon-green'
                        : 'bg-zinc-950 border-zinc-900 text-zinc-500 opacity-60 cursor-not-allowed'
                    } ${isClickable && !isActive ? 'hover:bg-zinc-900 hover:border-zinc-700 cursor-pointer' : ''}`}
                  >
                    <span className="w-4.5 h-4.5 rounded-lg bg-black/40 flex items-center justify-center font-mono text-[10px]">
                      {isPassed ? <Check className="w-3 h-3 text-neon-green" /> : step.id}
                    </span>
                    <StepIcon className="w-3.5 h-3.5" />
                    <span className="font-medium">{step.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Helper Badge */}
            <div className="hidden lg:flex items-center gap-2 text-zinc-500 text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
              <span>ACTIVE VIEWPORT FEED: LIVE STACK</span>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTAINER GRID */}
      <main id="app_main_grid" className="max-w-7xl mx-auto px-4 py-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: CAMERA FEED STAGE (7 COLS) */}
        <section className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <h2 className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
                AR Smartphone Camera Feed
              </h2>
            </div>
            
            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900/60 px-2 py-0.5 rounded border border-zinc-800">
              ISO 400 // F1.8 // STABILIZED
            </span>
          </div>

          <CameraFeed
            currentStep={currentStep}
            selectedCuisine={selectedCuisine}
            fridgeScanned={fridgeScanned}
            cabinetScanned={cabinetScanned}
            scannedFridgeItems={scannedFridgeItems}
            scannedPantryItems={scannedPantryItems}
            selectedRecipe={selectedRecipe}
            activeRecipeStep={activeRecipeStep}
            shoppingCart={shoppingCart}
            onTriggerScan={handleTriggerScan}
            inputMode={inputMode}
            realFridgeItems={realFridgeItems}
            realFreezerItems={realFreezerItems}
            realCabinetItems={realCabinetItems}
          />

          {/* Quick HUD guide tip under camera */}
          <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-4 flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white font-sans">
                {currentStep === 1 && 'Step 1: Focus Ceramic Plate'}
                {currentStep === 2 && 'Step 2: Refrigerator Alignment Scan'}
                {currentStep === 3 && 'Step 3: Dry Stock Cabinet Analysis'}
                {currentStep === 4 && 'Step 4: AI Formulation & Buy-Suggestion Match'}
                {currentStep === 5 && 'Step 5: 3D Holographic Projector Engaged'}
              </h4>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                {currentStep === 1 && 'Aim your camera at an empty clean circular dinner plate on your counter. Use the glass panel to input your cuisine parameters.'}
                {currentStep === 2 && 'Align the camera grid markers with your open refrigerator door. Trigger the shutter to scan current fresh proteins and vegetables.'}
                {currentStep === 3 && 'Align the screen with your dry cupboard. Swipe or scan to analyze pasta starch quantities, oils, and savory soy bases.'}
                {currentStep === 4 && 'Plated’s AI solver is synthesizing. Choose between the 100% Zero-Waste recipes or simulate buying a missing premium enhancer to unlock high-tier recipes.'}
                {currentStep === 5 && 'The recipe is compiling! The interactive recipe card controls cooking steps and timers, while a simulated 3D model is projected on the plate.'}
              </p>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: INTERACTIVE GLASS PANEL (5 COLS) */}
        <section className="lg:col-span-5 space-y-4">
          
          {/* HIGH-TECH OPERATING MODE SWITCHER */}
          <div className="backdrop-blur-xl bg-zinc-950/80 border border-zinc-900 rounded-2xl p-1.5 flex gap-1.5">
            <button
              onClick={() => {
                setInputMode('simulated');
                handleReset();
              }}
              className={`flex-1 py-2 text-[10px] font-mono uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                inputMode === 'simulated'
                  ? 'bg-zinc-900 border border-zinc-800 text-neon-cyan shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                  : 'text-zinc-500 hover:text-white hover:bg-zinc-900/30'
              }`}
            >
              🖥️ Sandbox Simulation
            </button>
            <button
              onClick={() => {
                setInputMode('real_upload');
                handleReset();
              }}
              className={`flex-1 py-2 text-[10px] font-mono uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                inputMode === 'real_upload'
                  ? 'bg-zinc-900 border border-zinc-800 text-neon-cyan shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                  : 'text-zinc-500 hover:text-white hover:bg-zinc-900/30'
              }`}
            >
              📸 Real Vision Scanner
            </button>
          </div>

          <div className="relative">
            {inputMode === 'real_upload' ? (
              <AnimatePresence mode="wait">
                {currentStep === 1 ? (
                  <motion.div
                    key="real-scan-dashboard"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <RealPhotoScanner
                      userProfile={userProfile}
                      onChangeProfile={setUserProfile}
                      fridgeItems={realFridgeItems}
                      freezerItems={realFreezerItems}
                      cabinetItems={realCabinetItems}
                      onSetFridgeItems={setRealFridgeItems}
                      onSetFreezerItems={setRealFreezerItems}
                      onSetCabinetItems={setRealCabinetItems}
                      onGenerateMeal={handleGenerateMeal}
                      isGeneratingMeal={isGeneratingMeal}
                      mealGenerationError={mealGenerationError}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="real-hologram-projection"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {selectedRecipe && (
                      <RecipeProgressCard
                        recipe={selectedRecipe}
                        activeStep={activeRecipeStep}
                        voiceGuided={voiceGuided}
                        onSetStep={(step) => setActiveRecipeStep(step)}
                        onToggleVoice={() => setVoiceGuided(!voiceGuided)}
                        onReset={handleReset}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            ) : (
              <AnimatePresence mode="wait">
                
                {/* STEP 1: CUISINE SELECTOR */}
                {currentStep === 1 && (
                  <motion.div
                    key="step-1-cuisine"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="backdrop-blur-xl bg-zinc-950/80 border border-cyan-900/50 rounded-3xl p-6 relative overflow-hidden"
                  >
                    <CuisineSelector
                      onSelect={handleSelectCuisine}
                      selectedCuisine={selectedCuisine}
                    />
                  </motion.div>
                )}

                {/* STEP 2: FRIDGE SCAN PROGRESS */}
                {currentStep === 2 && (
                  <motion.div
                    key="step-2-fridge"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="backdrop-blur-xl bg-zinc-950/80 border border-cyan-900/50 rounded-3xl p-6 relative overflow-hidden space-y-6"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-neon-cyan uppercase tracking-widest">
                        PHASE 2 OF 5 // ENVIRONMENT DISCOVERY
                      </span>
                      <h2 className="text-lg font-sans font-medium text-white tracking-tight mt-1">
                        Scan Fridge Inventory
                      </h2>
                      <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed font-sans">
                        Click the <strong className="text-neon-cyan">Scan Fridge Interior</strong> camera button inside the live HUD overlay on the left to activate computer vision mapping.
                      </p>
                    </div>

                    {fridgeScanned ? (
                      <div className="p-4 rounded-2xl bg-neon-green/10 border border-neon-green/30 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-neon-green shadow-[0_0_8px_#39ff14] animate-pulse" />
                          <h4 className="text-xs font-bold text-white font-sans">Refrigerator Mapped</h4>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                          Ingredients identified: <strong>Eggs, Spinach, Chicken, Salmon, Tomato</strong>. Proceed to cupboard stock mapping.
                        </p>
                        
                        <button
                          onClick={() => setCurrentStep(3)}
                          className="w-full mt-2 py-2.5 bg-neon-green text-black font-sans text-xs font-semibold rounded-xl hover:brightness-110 flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(57,255,20,0.15)] transition-all"
                        >
                          <span>Scan Dry Stock Cabinet</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-zinc-950/40 border border-zinc-800 text-center py-8">
                        <span className="text-3xl block mb-2 animate-bounce">🧊</span>
                        <p className="text-xs text-zinc-400 font-sans">
                          Align the camera with your open fridge. Hit the blue scanning shutter to begin matrix identification.
                        </p>
                      </div>
                    )}

                    <ScanInventory
                      currentStep={currentStep}
                      fridgeScanned={fridgeScanned}
                      cabinetScanned={cabinetScanned}
                      scannedFridgeItems={scannedFridgeItems}
                      scannedPantryItems={scannedPantryItems}
                      shoppingCart={shoppingCart}
                      onToggleFridgeItem={handleToggleFridgeItem}
                      onTogglePantryItem={handleTogglePantryItem}
                      onAddCustomItem={handleAddCustomItem}
                      onResetScan={handleReset}
                    />
                  </motion.div>
                )}

                {/* STEP 3: CABINET SCAN PROGRESS */}
                {currentStep === 3 && (
                  <motion.div
                    key="step-3-pantry"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="backdrop-blur-xl bg-zinc-950/80 border border-cyan-900/50 rounded-3xl p-6 relative overflow-hidden space-y-6"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-neon-cyan uppercase tracking-widest">
                        PHASE 3 OF 5 // ENVIRONMENT DISCOVERY
                      </span>
                      <h2 className="text-lg font-sans font-medium text-white tracking-tight mt-1">
                        Scan Pantry Stock
                      </h2>
                      <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed font-sans">
                        Now let's map dry pantry items. Click the <strong className="text-neon-cyan">Scan Dry Stock Cabinet</strong> button in the left feed HUD to activate scanning.
                      </p>
                    </div>

                    {cabinetScanned ? (
                      <div className="p-4 rounded-2xl bg-neon-green/10 border border-neon-green/30 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-neon-green shadow-[0_0_8px_#39ff14] animate-pulse" />
                          <h4 className="text-xs font-bold text-white font-sans">Pantry Stock Mapped</h4>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                          Pantry staples identified: <strong>Pasta, Rice, Soy Sauce, Olive Oil, Garlic</strong>. We are ready to run AI solver.
                        </p>
                        
                        <button
                          onClick={() => setCurrentStep(4)}
                          className="w-full mt-2 py-2.5 bg-neon-cyan text-black font-sans text-xs font-semibold rounded-xl hover:brightness-110 flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.25)] transition-all"
                        >
                          <span>Formulate AI Recipes</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-zinc-950/40 border border-zinc-800 text-center py-8">
                        <span className="text-3xl block mb-2 animate-bounce">🥫</span>
                        <p className="text-xs text-zinc-400 font-sans">
                          Open your dry cabinet shelf. Tap the camera scanning trigger inside the live camera frame on the left.
                        </p>
                      </div>
                    )}

                    <ScanInventory
                      currentStep={currentStep}
                      fridgeScanned={fridgeScanned}
                      cabinetScanned={cabinetScanned}
                      scannedFridgeItems={scannedFridgeItems}
                      scannedPantryItems={scannedPantryItems}
                      shoppingCart={shoppingCart}
                      onToggleFridgeItem={handleToggleFridgeItem}
                      onTogglePantryItem={handleTogglePantryItem}
                      onAddCustomItem={handleAddCustomItem}
                      onResetScan={handleReset}
                    />
                  </motion.div>
                )}

                {/* STEP 4: RECIPE SOLVER */}
                {currentStep === 4 && (
                  <motion.div
                    key="step-4-solver"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="backdrop-blur-xl bg-zinc-950/80 border border-cyan-900/50 rounded-3xl p-6 relative overflow-hidden">
                      <span className="text-[10px] font-mono text-neon-cyan uppercase tracking-widest block mb-1">
                        PHASE 4 OF 5 // NEURAL COMBINATOR
                      </span>
                      <h2 className="text-lg font-sans font-bold text-white tracking-tight mb-2">
                        Zero-Waste Recipe Matrix
                      </h2>
                      <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                        Cuisine context: <strong className="text-white">{selectedCuisine}</strong>. Sift through zero-waste recipes matched to your exact scanned ingredients. Turn the "Upgrade Twist" on by adding the missing premium item.
                      </p>
                    </div>

                    <RecipeSolver
                      currentStep={currentStep}
                      selectedCuisine={selectedCuisine}
                      scannedFridgeItems={scannedFridgeItems}
                      scannedPantryItems={scannedPantryItems}
                      shoppingCart={shoppingCart}
                      onSelectRecipe={(recipe) => {
                        setSelectedRecipe(recipe);
                        setActiveRecipeStep(0);
                      }}
                      onAddToCart={handleAddToCart}
                      onAdvanceToHologram={() => setCurrentStep(5)}
                    />

                    {/* Secondary display to inspect scanned items during selection */}
                    <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-5">
                      <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-3 flex items-center justify-between">
                        <span>Available inventory nodes</span>
                        <span className="text-zinc-500 font-normal">({scannedFridgeItems.length + scannedPantryItems.length + shoppingCart.length} total)</span>
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {scannedFridgeItems.map((i) => (
                          <span key={i} className="text-[10px] bg-zinc-950 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                            <span>{i}</span>
                          </span>
                        ))}
                        {scannedPantryItems.map((i) => (
                          <span key={i} className="text-[10px] bg-zinc-950 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span>{i}</span>
                          </span>
                        ))}
                        {shoppingCart.map((i) => (
                          <span key={i} className="text-[10px] bg-cyan-950 border border-neon-cyan/40 text-neon-cyan px-2 py-0.5 rounded-md flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                            <span>{i} (Bought)</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 5: AR HOLOGRAM STEP-BY-STEP RECIPE GUIDE */}
                {currentStep === 5 && selectedRecipe && (
                  <motion.div
                    key="step-5-hologram"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <RecipeProgressCard
                      recipe={selectedRecipe}
                      activeStep={activeRecipeStep}
                      voiceGuided={voiceGuided}
                      onSetStep={(step) => setActiveRecipeStep(step)}
                      onToggleVoice={() => setVoiceGuided(!voiceGuided)}
                      onReset={handleReset}
                    />
                  </motion.div>
                )}

              </AnimatePresence>
            )}
          </div>
        </section>

      </main>

      {/* FOOTER METRICS INFO */}
      <footer id="app_footer" className="max-w-7xl mx-auto px-4 md:px-8 py-10 mt-12 border-t border-zinc-900 text-zinc-500 text-xs text-center font-mono space-y-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-neon-cyan animate-pulse shrink-0" />
            <span>AR HOLOGRAPHIC PROJECTION NETWORK: COGNITIVE CATERING SYSTEMS INC.</span>
          </div>
          <div>
            PLATFORM: CLIENT-SIDE VIRTUAL STAGE PROTOTYPE
          </div>
        </div>
        <div className="text-[10px] text-zinc-600 mt-2">
          This system conforms to smart room coordinate grids. No camera telemetry or food scanning diagnostics are stored in remote cloud logs. All calculations execute locally.
        </div>
      </footer>
    </div>
  );
}
