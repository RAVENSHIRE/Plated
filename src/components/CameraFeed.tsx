import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, RefreshCw, Cpu, Layers, Disc, Database, Sparkles, Check, ShoppingCart, Info } from 'lucide-react';
import { CuisineType, Recipe } from '../types';

interface CameraFeedProps {
  currentStep: number;
  selectedCuisine: CuisineType | null;
  fridgeScanned: boolean;
  cabinetScanned: boolean;
  scannedFridgeItems: string[];
  scannedPantryItems: string[];
  selectedRecipe: Recipe | null;
  activeRecipeStep: number;
  shoppingCart: string[];
  onTriggerScan: () => void;
  inputMode?: 'simulated' | 'real_upload';
  realFridgeItems?: any[];
  realFreezerItems?: any[];
  realCabinetItems?: any[];
}

export default function CameraFeed({
  currentStep,
  selectedCuisine,
  fridgeScanned,
  cabinetScanned,
  scannedFridgeItems,
  scannedPantryItems,
  selectedRecipe,
  activeRecipeStep,
  shoppingCart,
  onTriggerScan,
  inputMode = 'simulated',
  realFridgeItems = [],
  realFreezerItems = [],
  realCabinetItems = [],
}: CameraFeedProps) {
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [timestamp, setTimestamp] = useState('');

  // View source feed (Simulator vs Live Sketchfab 3D Kitchen)
  const [viewSource, setViewSource] = useState<'simulator' | 'sketchfab'>('simulator');

  // Interactive Blender Viewport & Onboarding States
  const [shadingMode, setShadingMode] = useState<'wireframe' | 'solid' | 'rendered'>('rendered');
  const [focalLength, setFocalLength] = useState<number>(50); // 24, 50, 85
  const [onboardingStep, setOnboardingStep] = useState<number>(0); // 0: Welcome, 1: Shading, 2: Plate Focus, 3: Completed
  const [plateAligned, setPlateAligned] = useState<boolean>(false);
  const [watsonDetail, setWatsonDetail] = useState<string | null>(null);

  // Update time for the live HUD overlay
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimestamp(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle scan simulation progress safely outside functional state updater
  useEffect(() => {
    if (isScanning) {
      const timer = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + 4;
        });
      }, 80);
      return () => clearInterval(timer);
    }
  }, [isScanning]);

  // Trigger completion effect safely
  useEffect(() => {
    if (isScanning && scanProgress >= 100) {
      setIsScanning(false);
      setScanProgress(0);
      onTriggerScan();
    }
  }, [scanProgress, isScanning, onTriggerScan]);

  const startScanAnimation = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
  };

  // Adjust camera scale & depth blur dynamically based on Blender Focal Length (mm)
  const getFocalStyle = () => {
    switch (focalLength) {
      case 24:
        return { scale: 0.88, filter: 'blur(0px)', transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)' };
      case 85:
        return { scale: 1.12, filter: 'blur(0.8px)', transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)' };
      default:
        return { scale: 1.0, filter: 'blur(0px)', transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)' };
    }
  };

  // Coordinates mapping depending on step to simulate camera pans
  const getPanClass = () => {
    switch (currentStep) {
      case 1:
        return 'origin-center translate-x-0 translate-y-0';
      case 2:
        return 'origin-left -translate-x-12 translate-y-4';
      case 3:
        return 'origin-right translate-x-12 -translate-y-4';
      case 4:
        return 'origin-center scale-95 blur-[2px] opacity-40';
      case 5:
        return 'origin-center scale-105 translate-x-0 translate-y-0';
      default:
        return '';
    }
  };

  const handleWatsonPartClick = (part: string) => {
    if (part === 'monitor') {
      setWatsonDetail('CRT_MONITOR: 9" Curved green phosphorus display showing counter alignment parameters.');
    } else if (part === 'floppy') {
      setWatsonDetail('DISKETTE_SLOT: Plated OS physical 3.5" system disc inserted. Operating kernel online.');
    } else if (part === 'stickers') {
      setWatsonDetail('DECALS_OK: Verified authentic retro computer stickers, including HIC, Scotland flag, and hololive logos.');
    } else {
      setWatsonDetail('WATSON HIC-9801: 1989 workstation co-processor executing smart kitchen AR projections.');
    }
    // Auto-clear message after 4s
    setTimeout(() => {
      setWatsonDetail(null);
    }, 4000);
  };

  return (
    <div className="relative w-full aspect-video md:aspect-[16/10] rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl">
      {/* 1. PHYSICAL WORLD GRAPHICS / BACKGROUND SIMULATOR */}
      <div 
        style={getFocalStyle()}
        className={`absolute inset-0 transition-all duration-1000 ease-out ${getPanClass()}`}
      >
        {viewSource === 'sketchfab' ? (
          <div className="absolute inset-0 w-full h-full bg-zinc-950 pointer-events-auto">
            {/* Embedded Sketchfab Interactive 3D Model */}
            <iframe
              src="https://sketchfab.com/models/a13c1325f5314a9d9c36ae3c0fc9c92a/embed?autostart=1&internal=1&tracking=0&ui_ar=0&ui_infos=0&ui_theme=dark&ui_watermark=0&ui_controls=1"
              title="Sketchfab Kitchen Model"
              className="w-full h-full border-0 rounded-3xl pointer-events-auto"
              allow="autoplay; fullscreen; xr-spatial-tracking"
              allowFullScreen
            />
            {/* Subtle high tech scanning tint/grid on top of iframe */}
            <div className="absolute inset-0 bg-cyan-950/10 pointer-events-none mix-blend-color" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none z-10" />
          </div>
        ) : (
          <>
            {/* Abstract Kitchen Environment Background Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(15,23,42,0.6),rgba(4,4,5,1))]" />
            
            {/* Futuristic Floor/Wall lines to simulate 3D space */}
            <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="grid-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0" />
                  <stop offset="50%" stopColor="#00f0ff" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Perspective grid representing kitchen countertop */}
              <path d="M 0 350 L 1000 350 M 0 450 L 1000 450 M 0 550 L 1000 550" stroke="url(#grid-grad)" strokeWidth="1" />
              <path d="M 200 300 L -100 600 M 400 300 L 250 600 M 600 300 L 600 600 M 800 300 L 950 600" stroke="url(#grid-grad)" strokeWidth="1" />
            </svg>
          </>
        )}

        {/* Dynamic Scene Content per Step */}
        <AnimatePresence mode="wait">
          {/* Step 1: Plate Focus (Blended Room with Watson computer & countertop calibration) */}
          {currentStep === 1 && (
            <motion.div
              key="step-1-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-between px-8 md:px-12"
            >
              {viewSource === 'sketchfab' ? (
                /* Translucent floating AR target overlay on top of Sketchfab */
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="relative pointer-events-auto">
                    {onboardingStep === 2 && !plateAligned && (
                      <div className="absolute -inset-12 border-2 border-cyan-400/40 rounded-full animate-ping pointer-events-none" />
                    )}

                    {/* HUD scope tracking rings */}
                    <div className="absolute -inset-8 rounded-full border border-cyan-400/30 animate-[spin_40s_linear_infinite]" />
                    <div className="absolute -inset-4 rounded-full border border-cyan-400/20 animate-[spin_20s_linear_infinite_reverse]" />

                    {/* Interactive central alignment lock */}
                    <motion.div
                      whileHover={{ scale: onboardingStep === 2 ? 1.05 : 1, backgroundColor: 'rgba(6, 182, 212, 0.15)' }}
                      whileTap={{ scale: onboardingStep === 2 ? 0.95 : 1 }}
                      onClick={() => {
                        if (onboardingStep === 2) {
                          setPlateAligned(true);
                          setOnboardingStep(3);
                        }
                      }}
                      className={`w-44 h-44 rounded-full border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 backdrop-blur-xs cursor-pointer shadow-[0_0_30px_rgba(6,182,212,0.15)] ${
                        plateAligned
                          ? 'border-emerald-500 bg-emerald-950/20 shadow-[0_0_40px_rgba(16,185,129,0.3)]'
                          : onboardingStep === 2
                          ? 'border-cyan-400 bg-cyan-950/10 hover:border-cyan-300'
                          : 'border-zinc-700 bg-zinc-950/20'
                      }`}
                    >
                      {plateAligned ? (
                        <>
                          <Check className="w-6 h-6 text-emerald-400 mb-1 animate-pulse" />
                          <span className="text-emerald-400 font-mono text-[9px] font-bold tracking-widest uppercase">ALIGN_LOCKED</span>
                          <span className="text-zinc-400 text-[7px] mt-0.5">DEPTH LOCK SUCCESS</span>
                        </>
                      ) : onboardingStep === 2 ? (
                        <>
                          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping mb-2" />
                          <span className="text-cyan-400 font-mono text-[10px] font-bold tracking-widest uppercase animate-pulse">LOCK_PLATE</span>
                          <span className="text-zinc-400 text-[7px] mt-0.5 font-sans">TAP TO CALIBRATE</span>
                        </>
                      ) : (
                        <>
                          <span className="text-zinc-500 font-mono text-[9px] tracking-wider uppercase">CALIBRATING</span>
                          <span className="text-zinc-600 text-[7px] mt-0.5">AWAITING SHADING</span>
                        </>
                      )}
                    </motion.div>

                    {/* Coordinate helper axes lines */}
                    <div className="absolute top-1/2 -left-8 -translate-y-1/2 w-4 h-0.5 bg-cyan-400 opacity-50" />
                    <div className="absolute top-1/2 -right-8 -translate-y-1/2 w-4 h-0.5 bg-cyan-400 opacity-50" />
                    <div className="absolute left-1/2 -top-8 -translate-x-1/2 w-0.5 h-4 bg-cyan-400 opacity-50" />
                    <div className="absolute left-1/2 -bottom-8 -translate-x-1/2 w-0.5 h-4 bg-cyan-400 opacity-50" />
                  </div>
                </div>
              ) : (
                <>
                  {/* Grayscale Background Overlay */}
                  <div className="absolute inset-0 bg-black/50 backdrop-grayscale backdrop-brightness-75" />

                  {/* Countertop layout divided into left (Watson computer) and right (glowing plate grid) */}
                  <div className="relative w-full h-full flex items-center justify-between z-10 pt-8">
                    
                    {/* LEFT: RETRO WATSON HIC 9801 COMPUTER (Matches uploaded asset textures) */}
                    <div className="flex flex-col items-center relative select-none">
                  <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: onboardingStep >= 1 ? 1 : 0.4 }}
                    transition={{ duration: 0.8 }}
                  >
                    {shadingMode === 'wireframe' ? (
                      <div 
                        onClick={() => handleWatsonPartClick('terminal')}
                        className="relative w-44 h-36 border border-cyan-400/80 bg-transparent rounded-lg flex flex-col justify-between p-2 font-mono text-[9px] text-cyan-400 cursor-pointer group hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all"
                      >
                        <div className="absolute inset-0 border border-dashed border-cyan-400/20 m-1 rounded" />
                        <div className="flex justify-between items-center border-b border-cyan-400/50 pb-1">
                          <span className="font-bold text-[8px]">WATSON HIC 9801</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center items-center gap-1">
                          <div className="w-10 h-1 bg-cyan-400/40" />
                          <div className="w-16 h-1 bg-cyan-400/40" />
                          <div className="text-[7px] text-cyan-400/80">WIREFRAME_READY</div>
                        </div>
                        <div className="flex justify-between text-[7px] opacity-80 pt-1 border-t border-cyan-400/20">
                          <span>MEM: 640KB</span>
                          <span>FDD: SYSTEM</span>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className={`relative w-44 h-36 rounded-xl flex flex-col border transition-all duration-300 cursor-pointer shadow-lg group ${
                          shadingMode === 'solid'
                            ? 'bg-zinc-800 border-zinc-700 hover:border-zinc-500'
                            : 'bg-gradient-to-b from-[#e8dec9] to-[#cabfa3] border-[#bdae96] hover:shadow-2xl hover:border-cyan-300'
                        }`}
                      >
                        {/* Monitor Bezel */}
                        <div 
                          onClick={() => handleWatsonPartClick('monitor')}
                          className={`p-1.5 rounded-t-xl flex flex-col h-[70%] relative ${shadingMode === 'solid' ? 'bg-zinc-800' : 'bg-[#e2d8c3]'}`}
                        >
                          {/* CRT curved screen simulation */}
                          <div className={`flex-1 rounded-md p-1.5 flex flex-col justify-between font-mono text-[8px] transition-all relative overflow-hidden ${
                            shadingMode === 'solid'
                              ? 'bg-zinc-900 border border-zinc-700 text-zinc-500'
                              : 'bg-neutral-900 border border-neutral-950 text-cyan-400 shadow-inner'
                          }`}>
                            {shadingMode === 'rendered' && (
                              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] pointer-events-none" />
                            )}

                            <div className="flex justify-between items-start relative z-10">
                              <span className={shadingMode === 'solid' ? 'text-zinc-600' : 'text-cyan-400 font-bold animate-pulse text-[7px]'}>
                                {shadingMode === 'solid' ? 'STABLE' : 'HIC-9801 v1.0'}
                              </span>
                              <span className={`w-1 h-1 rounded-full ${shadingMode === 'solid' ? 'bg-zinc-700' : 'bg-emerald-500 animate-pulse'}`} />
                            </div>

                            <div className="text-center font-mono my-auto relative z-10 leading-tight">
                              {shadingMode === 'solid' ? (
                                <span className="text-zinc-600 font-bold uppercase text-[7px]">SOLID_SHADING</span>
                              ) : (
                                <div className="space-y-0.5">
                                  <div className="text-[7px] text-cyan-400 font-bold uppercase tracking-wider">WATSON ONLINE</div>
                                  <div className="text-[6px] text-cyan-500/80 uppercase">
                                    {onboardingStep === 0 ? 'READY TO INIT' : 'AWAITING ALIGN'}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex justify-between text-[6px] opacity-70 relative z-10">
                              <span>MEM: 640KB</span>
                              <span>SYSTEM_OK</span>
                            </div>
                          </div>

                          {/* Brand label */}
                          <div className="text-center font-sans font-bold text-[7px] tracking-widest mt-1 text-zinc-500">
                            W A T S O N
                          </div>
                        </div>

                        {/* Floppy Drive Unit */}
                        <div 
                          onClick={() => handleWatsonPartClick('floppy')}
                          className={`flex-1 rounded-b-xl border-t p-1 flex justify-between items-center ${
                            shadingMode === 'solid'
                              ? 'bg-zinc-800 border-zinc-700 text-zinc-500'
                              : 'bg-[#c2b59b] border-[#ad9f85] text-neutral-800'
                          }`}
                        >
                          <div className="flex flex-col gap-0.5 justify-center flex-1 pl-1">
                            <div className={`h-1 w-14 rounded ${shadingMode === 'solid' ? 'bg-zinc-950' : 'bg-neutral-950 border-b border-neutral-700'}`} />
                            <span className="text-[5px] font-bold font-mono tracking-tighter opacity-60">FDD 1 // BOOT DISK</span>
                          </div>

                          {/* Decals Area (Rendered mode only!) */}
                          {shadingMode === 'rendered' && (
                            <div 
                              onClick={(e) => { e.stopPropagation(); handleWatsonPartClick('stickers'); }}
                              className="flex gap-0.5 items-center bg-black/10 px-1 py-0.5 rounded border border-black/10 scale-90 origin-right mr-1 cursor-pointer hover:bg-black/20 transition-all"
                            >
                              {/* Mom sticker */}
                              <div className="w-3.5 h-3.5 bg-rose-500 text-white rounded-full flex items-center justify-center font-sans text-[5px] font-bold hover:scale-125 transition-transform" title="mom sticker">
                                ❤️
                              </div>
                              {/* Scotland flag */}
                              <div className="w-3.5 h-2 bg-blue-600 border border-white/40 flex items-center justify-center relative overflow-hidden hover:scale-125 transition-transform" title="Scotland flag">
                                <div className="absolute w-full h-0.5 bg-white rotate-12" />
                                <div className="absolute w-full h-0.5 bg-white -rotate-12" />
                              </div>
                              {/* hololive sticker */}
                              <div className="px-0.5 h-2 bg-cyan-400 text-white font-mono text-[4px] font-bold rounded flex items-center justify-center hover:scale-125 transition-transform" title="hololive sticker">
                                holo
                              </div>
                              {/* HIC sticker */}
                              <div className="px-0.5 h-2 bg-amber-400 text-neutral-900 font-mono text-[4px] font-extrabold rounded flex items-center justify-center hover:scale-125 transition-transform" title="HIC sticker">
                                HIC
                              </div>
                            </div>
                          )}
                        </div>

                        {/* External keyboard on table */}
                        <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-3 rounded-t border-t flex justify-around px-1 ${
                          shadingMode === 'solid'
                            ? 'bg-zinc-700 border-zinc-600'
                            : 'bg-[#cabda5] border-[#bdae96] shadow'
                        }`}>
                          <div className="w-full h-0.5 bg-black/15 mt-1 rounded-sm flex gap-0.5">
                            <div className="w-2.5 bg-black/20" />
                            <div className="w-2 bg-black/20" />
                            <div className="w-3.5 bg-black/20" />
                            <div className="w-2 bg-black/20" />
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Watson details tooltip popup */}
                  <AnimatePresence>
                    {watsonDetail && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-full mt-6 bg-cyan-950/90 border border-cyan-400/50 rounded-xl p-2 text-[8px] font-mono text-cyan-300 w-44 shadow-[0_5px_15px_rgba(0,240,255,0.15)] z-20 backdrop-blur-md"
                      >
                        {watsonDetail}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* RIGHT: THE DINNER PLATE SURFACE & AR ALIGNMENT CIRCLE */}
                <div className="flex-1 flex flex-col items-center justify-center relative">
                  <div className="relative">
                    {/* Pulsing focal laser brackets when onboarding is active */}
                    {onboardingStep === 2 && !plateAligned && (
                      <div className="absolute -inset-10 border border-cyan-400/40 rounded-full animate-ping pointer-events-none" />
                    )}

                    {/* Outer mechanical scope target rings */}
                    <div className="absolute -inset-6 rounded-full border-2 border-dashed border-cyan-400/30 animate-[spin_60s_linear_infinite]" />
                    <div className="absolute -inset-3 rounded-full border border-cyan-400/20 animate-[spin_35s_linear_infinite_reverse]" />

                    {/* Interactive Target Ceramic Plate */}
                    <motion.div
                      whileHover={{ scale: onboardingStep === 2 ? 1.03 : 1 }}
                      whileTap={{ scale: onboardingStep === 2 ? 0.98 : 1 }}
                      onClick={() => {
                        if (onboardingStep === 2) {
                          setPlateAligned(true);
                          setOnboardingStep(3);
                        }
                      }}
                      className={`w-52 h-52 rounded-full flex items-center justify-center overflow-hidden relative z-10 transition-all duration-500 cursor-pointer shadow-xl ${
                        shadingMode === 'wireframe'
                          ? 'bg-transparent border border-cyan-400/80 border-dashed hover:border-cyan-300'
                          : shadingMode === 'solid'
                          ? 'bg-zinc-800 border-b-4 border-zinc-700 hover:border-zinc-500 shadow-[0_0_20px_rgba(255,255,255,0.02)]'
                          : plateAligned
                          ? 'bg-white border-b-8 border-slate-300 shadow-[0_0_50px_rgba(34,211,238,0.25)]'
                          : 'bg-white border-b-8 border-slate-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(34,211,238,0.15)]'
                      }`}
                    >
                      {/* Realistic plate interior layers for Rendered mode */}
                      {shadingMode === 'rendered' && (
                        <>
                          <div className="absolute inset-2 rounded-full border border-slate-200 bg-[radial-gradient(circle_at_30%_30%,#ffffff,#f8fafc)]" />
                          <div className="absolute inset-8 rounded-full border border-slate-100" />
                          <div className="absolute inset-16 rounded-full border border-slate-200/50" />
                          <div className="absolute top-4 left-1/3 w-12 h-1 bg-white/40 blur-xs rounded-full transform -rotate-12" />
                        </>
                      )}

                      {/* Align status text label */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center font-mono text-[9px] pointer-events-none select-none">
                        {plateAligned ? (
                          <>
                            <Check className="w-5 h-5 text-emerald-500 mb-1" />
                            <span className="text-emerald-500 font-extrabold tracking-widest">PLATE_LOCKED</span>
                          </>
                        ) : onboardingStep === 2 ? (
                          <>
                            <span className="text-cyan-400 animate-pulse font-bold tracking-widest">CLICK_TO_ALIGN</span>
                            <span className="text-zinc-400 text-[7px] mt-0.5 uppercase">DEPTH_LOCK</span>
                          </>
                        ) : (
                          <span className="text-zinc-500 opacity-60 font-bold tracking-wider">AWAITING_INIT</span>
                        )}
                      </div>
                    </motion.div>

                    {/* Coordinate helper axes lines */}
                    <div className="absolute top-1/2 -left-6 -translate-y-1/2 w-3 h-0.5 bg-cyan-400 opacity-60" />
                    <div className="absolute top-1/2 -right-6 -translate-y-1/2 w-3 h-0.5 bg-cyan-400 opacity-60" />
                    <div className="absolute left-1/2 -top-6 -translate-x-1/2 w-0.5 h-3 bg-cyan-400 opacity-60" />
                    <div className="absolute left-1/2 -bottom-6 -translate-x-1/2 w-0.5 h-3 bg-cyan-400 opacity-60" />
                  </div>
                </div>

              </div>
            </>
          )}
        </motion.div>
      )}

          {/* Step 2: Fridge Shot */}
          {currentStep === 2 && (
            <motion.div
              key="step-2-bg"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: -100 }}
              className="absolute inset-0 flex items-center justify-center p-8"
            >
              <div className="relative w-80 h-96 bg-zinc-900/90 rounded-2xl border border-zinc-800 shadow-[0_0_40px_rgba(255,255,255,0.02)] flex flex-col overflow-hidden">
                {/* Refrigerator Frame */}
                <div className="h-6 bg-zinc-800 border-b border-zinc-700 px-4 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500/80" />
                    <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
                    <span className="w-2 h-2 rounded-full bg-neon-cyan/80" />
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500 tracking-wider">REF_CORE_02 // TEMP: 3.4°C</span>
                </div>

                {/* Fridge Interior Simulator */}
                <div className="flex-1 bg-zinc-950 p-4 relative flex flex-col justify-around">
                  {/* Shelves */}
                  <div className="absolute inset-x-0 top-1/3 border-b border-zinc-800/80 pointer-events-none" />
                  <div className="absolute inset-x-0 top-2/3 border-b border-zinc-800/80 pointer-events-none" />

                  {/* Cooling vapor overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/10 to-transparent pointer-events-none" />

                  {/* Animated cooling stream */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-cyan-500/5 to-transparent animate-pulse pointer-events-none" />

                  {/* Visual Fridge Items */}
                  <div className="grid grid-cols-3 gap-3 relative z-10">
                    <div className={`p-2 rounded-lg border transition-all duration-500 flex flex-col items-center justify-center ${fridgeScanned ? 'bg-zinc-900/90 border-neon-cyan/40 text-white scale-100' : 'bg-zinc-950/40 border-dashed border-zinc-800 text-zinc-600 scale-95'}`}>
                      <span className="text-2xl">🥚</span>
                      <span className="text-[10px] font-medium mt-1">Eggs</span>
                      {fridgeScanned && <span className="text-[8px] text-neon-cyan font-mono mt-0.5">Scanned</span>}
                    </div>
                    <div className={`p-2 rounded-lg border transition-all duration-500 flex flex-col items-center justify-center ${fridgeScanned ? 'bg-zinc-900/90 border-neon-cyan/40 text-white scale-100' : 'bg-zinc-950/40 border-dashed border-zinc-800 text-zinc-600 scale-95'}`}>
                      <span className="text-2xl">🥬</span>
                      <span className="text-[10px] font-medium mt-1">Spinach</span>
                      {fridgeScanned && <span className="text-[8px] text-neon-cyan font-mono mt-0.5">Scanned</span>}
                    </div>
                    <div className={`p-2 rounded-lg border transition-all duration-500 flex flex-col items-center justify-center ${fridgeScanned ? 'bg-zinc-900/90 border-neon-cyan/40 text-white scale-100' : 'bg-zinc-950/40 border-dashed border-zinc-800 text-zinc-600 scale-95'}`}>
                      <span className="text-2xl">🍗</span>
                      <span className="text-[10px] font-medium mt-1">Chicken</span>
                      {fridgeScanned && <span className="text-[8px] text-neon-cyan font-mono mt-0.5">Scanned</span>}
                    </div>
                    <div className={`p-2 rounded-lg border transition-all duration-500 flex flex-col items-center justify-center ${fridgeScanned ? 'bg-zinc-900/90 border-neon-cyan/40 text-white scale-100' : 'bg-zinc-950/40 border-dashed border-zinc-800 text-zinc-600 scale-95'}`}>
                      <span className="text-2xl">🐟</span>
                      <span className="text-[10px] font-medium mt-1">Salmon</span>
                      {fridgeScanned && <span className="text-[8px] text-neon-cyan font-mono mt-0.5">Scanned</span>}
                    </div>
                    <div className={`p-2 rounded-lg border transition-all duration-500 flex flex-col items-center justify-center ${fridgeScanned ? 'bg-zinc-900/90 border-neon-cyan/40 text-white scale-100' : 'bg-zinc-950/40 border-dashed border-zinc-800 text-zinc-600 scale-95'}`}>
                      <span className="text-2xl">🍅</span>
                      <span className="text-[10px] font-medium mt-1">Tomato</span>
                      {fridgeScanned && <span className="text-[8px] text-neon-cyan font-mono mt-0.5">Scanned</span>}
                    </div>
                    {/* Add Premium Ingredient warning visualizer */}
                    <div className="p-2 rounded-lg border border-dashed border-zinc-800 text-zinc-700 bg-zinc-950/10 flex flex-col items-center justify-center">
                      <span className="text-xl opacity-20">🧀</span>
                      <span className="text-[9px] mt-1 text-zinc-600">Parmesan</span>
                      <span className="text-[8px] text-amber-500 font-mono mt-0.5">Missing</span>
                    </div>
                  </div>

                  {/* AR Scanning Laser line (only active when scanning) */}
                  {isScanning && (
                    <motion.div
                      className="absolute left-0 right-0 h-1 bg-neon-cyan shadow-[0_0_15px_rgba(0,240,255,1)] z-20"
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Cabinet Stock */}
          {currentStep === 3 && (
            <motion.div
              key="step-3-bg"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 100 }}
              className="absolute inset-0 flex items-center justify-center p-8"
            >
              <div className="relative w-80 h-96 bg-zinc-900/90 rounded-2xl border border-zinc-800 shadow-[0_0_40px_rgba(255,255,255,0.02)] flex flex-col overflow-hidden">
                {/* Pantry Frame */}
                <div className="h-6 bg-zinc-800 border-b border-zinc-700 px-4 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-zinc-500 tracking-wider">PANTRY_SYSTEM_01 // DRY STORAGE</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  </div>
                </div>

                {/* Cabinet Interior Simulator */}
                <div className="flex-1 bg-zinc-950 p-4 relative flex flex-col justify-around">
                  {/* Pantry Shelves */}
                  <div className="absolute inset-x-0 top-1/2 border-b-2 border-zinc-800 pointer-events-none" />

                  {/* Dry Stock Items */}
                  <div className="grid grid-cols-3 gap-3 relative z-10">
                    <div className={`p-2 rounded-lg border transition-all duration-500 flex flex-col items-center justify-center ${cabinetScanned ? 'bg-zinc-900/90 border-neon-cyan/40 text-white scale-100' : 'bg-zinc-950/40 border-dashed border-zinc-800 text-zinc-600 scale-95'}`}>
                      <span className="text-2xl">🍝</span>
                      <span className="text-[10px] font-medium mt-1">Pasta</span>
                      {cabinetScanned && <span className="text-[8px] text-neon-cyan font-mono mt-0.5">Scanned</span>}
                    </div>
                    <div className={`p-2 rounded-lg border transition-all duration-500 flex flex-col items-center justify-center ${cabinetScanned ? 'bg-zinc-900/90 border-neon-cyan/40 text-white scale-100' : 'bg-zinc-950/40 border-dashed border-zinc-800 text-zinc-600 scale-95'}`}>
                      <span className="text-2xl">🌾</span>
                      <span className="text-[10px] font-medium mt-1">Rice</span>
                      {cabinetScanned && <span className="text-[8px] text-neon-cyan font-mono mt-0.5">Scanned</span>}
                    </div>
                    <div className={`p-2 rounded-lg border transition-all duration-500 flex flex-col items-center justify-center ${cabinetScanned ? 'bg-zinc-900/90 border-neon-cyan/40 text-white scale-100' : 'bg-zinc-950/40 border-dashed border-zinc-800 text-zinc-600 scale-95'}`}>
                      <span className="text-2xl">🫒</span>
                      <span className="text-[10px] font-medium mt-1">Olive Oil</span>
                      {cabinetScanned && <span className="text-[8px] text-neon-cyan font-mono mt-0.5">Scanned</span>}
                    </div>
                    <div className={`p-2 rounded-lg border transition-all duration-500 flex flex-col items-center justify-center ${cabinetScanned ? 'bg-zinc-900/90 border-neon-cyan/40 text-white scale-100' : 'bg-zinc-950/40 border-dashed border-zinc-800 text-zinc-600 scale-95'}`}>
                      <span className="text-2xl">🍾</span>
                      <span className="text-[10px] font-medium mt-1">Soy Sauce</span>
                      {cabinetScanned && <span className="text-[8px] text-neon-cyan font-mono mt-0.5">Scanned</span>}
                    </div>
                    <div className={`p-2 rounded-lg border transition-all duration-500 flex flex-col items-center justify-center ${cabinetScanned ? 'bg-zinc-900/90 border-neon-cyan/40 text-white scale-100' : 'bg-zinc-950/40 border-dashed border-zinc-800 text-zinc-600 scale-95'}`}>
                      <span className="text-2xl">🧄</span>
                      <span className="text-[10px] font-medium mt-1">Garlic</span>
                      {cabinetScanned && <span className="text-[8px] text-neon-cyan font-mono mt-0.5">Scanned</span>}
                    </div>
                    {/* Upgrade items warning visualizer */}
                    <div className="p-2 rounded-lg border border-dashed border-zinc-800 text-zinc-700 bg-zinc-950/10 flex flex-col items-center justify-center">
                      <span className="text-xl opacity-20">🌶️</span>
                      <span className="text-[9px] mt-1 text-zinc-600">Gochujang</span>
                      <span className="text-[8px] text-amber-500 font-mono mt-0.5">Missing</span>
                    </div>
                  </div>

                  {/* AR Scanning Laser line */}
                  {isScanning && (
                    <motion.div
                      className="absolute left-0 right-0 h-1 bg-neon-cyan shadow-[0_0_15px_rgba(0,240,255,1)] z-20"
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Hybrid Recipe Solver (AI Core Analyzing) */}
          {currentStep === 4 && (
            <motion.div
              key="step-4-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* Spinning AI Core Visual */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-full border border-neon-cyan/30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-4 rounded-full border-2 border-dashed border-neon-pink/40"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-10 rounded-full border border-neon-green/30"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div className="z-10 flex flex-col items-center">
                  <Cpu className="w-12 h-12 text-neon-cyan animate-pulse" />
                  <span className="text-xs font-mono text-neon-cyan mt-3 tracking-widest uppercase">AI_SOLVING_CORE</span>
                  <span className="text-[9px] font-mono text-zinc-500 mt-1">DESIRED: {selectedCuisine}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: AR Hologram Plate Display */}
          {currentStep === 5 && selectedRecipe && (
            <motion.div
              key="step-5-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* Back to original counter with rich plate setup */}
              <div className="absolute inset-0 bg-black/60 backdrop-brightness-90 transition-all duration-1000" />

              <div className="relative flex flex-col items-center justify-center">
                {/* Simulated Plate base (Immersive UI Ceramic Plate) */}
                <div className="w-72 h-72 rounded-full bg-white shadow-[0_0_60px_rgba(255,255,255,0.35)] border-b-8 border-slate-300 flex items-center justify-center relative">
                  {/* Plate interior */}
                  <div className="absolute inset-2 rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffffff,#f8fafc)] border border-slate-200" />
                  <div className="absolute inset-12 rounded-full border border-dashed border-slate-300/40" />

                  {/* 3D HOLOGRAM OVERLAY */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    {/* Simulated 3D Rotating Mesh Projection */}
                    <div className="relative w-48 h-48 flex items-center justify-center transform-gpu">
                      {/* Interactive Hologram Ring base */}
                      <div 
                        className="absolute inset-0 rounded-full border-2 border-dashed holo-ring opacity-70"
                        style={{ borderColor: selectedRecipe.hologramColor, transform: 'rotateX(65deg)' }}
                      />
                      <div 
                        className="absolute inset-4 rounded-full border border-double animate-[spin_8s_linear_infinite] opacity-40"
                        style={{ borderColor: selectedRecipe.hologramColor, transform: 'rotateX(65deg)' }}
                      />

                      {/* Moving light nodes on ring */}
                      <div className="absolute inset-0 holo-ring">
                        <div 
                          className="w-3 h-3 rounded-full absolute top-0 left-1/2 -translate-x-1/2 blur-xs animate-ping"
                          style={{ backgroundColor: selectedRecipe.hologramColor }}
                        />
                        <div 
                          className="w-2 h-2 rounded-full absolute bottom-0 left-1/2 -translate-x-1/2 blur-xs"
                          style={{ backgroundColor: selectedRecipe.hologramColor }}
                        />
                      </div>

                      {/* Holographic Slices / Wireframe of Food representation */}
                      <motion.div
                        className="absolute w-40 h-40 flex items-center justify-center"
                        animate={{ rotateY: 360 }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                      >
                        {/* Food mesh simulation using SVG */}
                        <svg className="w-32 h-32 overflow-visible" viewBox="0 0 100 100">
                          <defs>
                            <linearGradient id="holo-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor={selectedRecipe.hologramColor} stopOpacity="0.8" />
                              <stop offset="50%" stopColor={selectedRecipe.hologramColor} stopOpacity="0.3" />
                              <stop offset="100%" stopColor={selectedRecipe.hologramColor} stopOpacity="0.1" />
                            </linearGradient>
                          </defs>

                          {/* Orbit paths representing layers */}
                          <ellipse cx="50" cy="50" rx="35" ry="15" fill="none" stroke="url(#holo-glow)" strokeWidth="1.5" strokeDasharray="4,2" />
                          <ellipse cx="50" cy="50" rx="42" ry="22" fill="none" stroke="url(#holo-glow)" strokeWidth="1" />
                          <ellipse cx="50" cy="40" rx="28" ry="10" fill="none" stroke="url(#holo-glow)" strokeWidth="1.5" />
                          
                          {/* Sauté particles */}
                          <circle cx="35" cy="48" r="3" fill="none" stroke={selectedRecipe.hologramColor} strokeWidth="1.5" />
                          <circle cx="65" cy="52" r="2.5" fill={selectedRecipe.hologramColor} className="animate-pulse" />
                          <circle cx="48" cy="38" r="4" fill="none" stroke={selectedRecipe.hologramColor} strokeWidth="1.5" />
                          <circle cx="58" cy="42" r="2" fill={selectedRecipe.hologramColor} />

                          {/* Dynamic 3D spikes to emulate complex food models */}
                          {selectedRecipe.hologramDesign === 'layers' && (
                            <>
                              <path d="M 50 15 L 35 48 L 50 50 Z" fill="url(#holo-glow)" stroke={selectedRecipe.hologramColor} strokeWidth="0.5" opacity="0.6" />
                              <path d="M 50 15 L 65 52 L 50 50 Z" fill="url(#holo-glow)" stroke={selectedRecipe.hologramColor} strokeWidth="0.5" opacity="0.6" />
                              <path d="M 50 15 L 50 40 L 48 38 Z" fill="url(#holo-glow)" stroke={selectedRecipe.hologramColor} strokeWidth="0.5" opacity="0.6" />
                            </>
                          )}

                          {selectedRecipe.hologramDesign === 'concentric' && (
                            <>
                              <circle cx="50" cy="50" r="20" fill="none" stroke={selectedRecipe.hologramColor} strokeWidth="1" strokeDasharray="8,4" />
                              <circle cx="50" cy="50" r="10" fill="none" stroke={selectedRecipe.hologramColor} strokeWidth="2" />
                              <path d="M 50 10 L 50 90 M 10 50 L 90 50" stroke={selectedRecipe.hologramColor} strokeWidth="0.5" strokeDasharray="2,4" />
                            </>
                          )}

                          {selectedRecipe.hologramDesign === 'spiral' && (
                            <path
                              d="M 50 50 A 10 10 0 0 0 40 50 A 20 20 0 0 0 60 50 A 30 30 0 0 0 20 50"
                              fill="none"
                              stroke={selectedRecipe.hologramColor}
                              strokeWidth="1.5"
                              strokeDasharray="4,1"
                            />
                          )}

                          {selectedRecipe.hologramDesign === 'nodes' && (
                            <>
                              <line x1="30" y1="50" x2="50" y2="35" stroke={selectedRecipe.hologramColor} strokeWidth="1" />
                              <line x1="50" y1="35" x2="70" y2="50" stroke={selectedRecipe.hologramColor} strokeWidth="1" />
                              <line x1="70" y1="50" x2="50" y2="65" stroke={selectedRecipe.hologramColor} strokeWidth="1" />
                              <line x1="50" y1="65" x2="30" y2="50" stroke={selectedRecipe.hologramColor} strokeWidth="1" />
                              <line x1="30" y1="50" x2="70" y2="50" stroke={selectedRecipe.hologramColor} strokeWidth="0.5" strokeDasharray="2,2" />
                              <circle cx="30" cy="50" r="4" fill={selectedRecipe.hologramColor} />
                              <circle cx="50" cy="35" r="4" fill={selectedRecipe.hologramColor} />
                              <circle cx="70" cy="50" r="4" fill={selectedRecipe.hologramColor} />
                              <circle cx="50" cy="65" r="4" fill={selectedRecipe.hologramColor} />
                            </>
                          )}
                        </svg>
                      </motion.div>

                      {/* Thermal Steam heatwaves */}
                      <div className="absolute top-0 flex flex-col items-center gap-1.5 opacity-60">
                        <motion.div
                          className="w-1 h-8 rounded-full blur-[3px]"
                          style={{ backgroundColor: selectedRecipe.hologramColor }}
                          animate={{ y: [-10, -40], opacity: [0, 0.8, 0], scale: [1, 1.4] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                        />
                        <motion.div
                          className="w-1 h-6 rounded-full blur-[3px]"
                          style={{ backgroundColor: selectedRecipe.hologramColor }}
                          animate={{ y: [-5, -30], opacity: [0, 0.6, 0], scale: [1, 1.2] }}
                          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Telemetry coordinate readout projected over plate */}
                  <div className="absolute top-4 left-4 z-20 font-mono text-[9px]" style={{ color: selectedRecipe.hologramColor }}>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                      <span>HOLOGRAM_PROJ_OK</span>
                    </div>
                    <div>FREQ: 5.8 GHz</div>
                    <div>WAVELENGTH: {selectedRecipe.id.toUpperCase()}</div>
                  </div>

                  {/* Total Calorie telemetry display */}
                  <div className="absolute bottom-4 right-4 z-20 font-mono text-[9px] text-right" style={{ color: selectedRecipe.hologramColor }}>
                    <div className="font-bold">{selectedRecipe.title}</div>
                    <div>KCAL: {selectedRecipe.calories}</div>
                    <div>STEP {activeRecipeStep + 1}/{selectedRecipe.steps.length}</div>
                  </div>
                </div>

                {/* Simulated table support structure */}
                <div className="h-6 w-3/4 bg-zinc-800/20 backdrop-blur-xl border border-zinc-700/30 rounded-full mt-4 flex items-center justify-between px-6 font-mono text-[8px] text-zinc-500">
                  <span>COUNTERTOP SURFACE DETECTED</span>
                  <span>ALTITUDE: 90.5cm</span>
                  <span>ORIENTATION: HORIZONTAL</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Viewfinder Corners (Immersive UI) */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-cyan-400 opacity-40 pointer-events-none z-30" />
      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-cyan-400 opacity-40 pointer-events-none z-30" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-cyan-400 opacity-40 pointer-events-none z-30" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-cyan-400 opacity-40 pointer-events-none z-30" />

      {/* Scanning Scanline (Immersive UI) */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400/20 shadow-[0_0_15px_cyan] opacity-30 animate-scanline pointer-events-none z-30" />

      {/* 2. AR TELEMETRY / GLASS HUD OVERLAYS */}
      <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 font-mono text-[10px] text-neon-cyan select-none">
        
        {/* HUD: Top Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-black/85 backdrop-blur-md border border-zinc-800/80 rounded-full p-1 text-white pointer-events-auto shadow-lg">
            <div className="flex items-center gap-1 px-2.5 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              <span className="font-bold tracking-wider text-[8px] text-zinc-400">FEED_SOURCE:</span>
            </div>
            <button
              onClick={() => setViewSource('simulator')}
              className={`px-3 py-1 rounded-full text-[8px] font-extrabold tracking-wider transition-all duration-200 ${
                viewSource === 'simulator'
                  ? 'bg-zinc-800 text-cyan-400 border border-zinc-700/80 shadow-[0_0_8px_rgba(34,211,238,0.2)]'
                  : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
              }`}
            >
              SIMULATOR
            </button>
            <button
              onClick={() => setViewSource('sketchfab')}
              className={`px-3 py-1 rounded-full text-[8px] font-extrabold tracking-wider transition-all duration-200 ${
                viewSource === 'sketchfab'
                  ? 'bg-zinc-800 text-cyan-400 border border-zinc-700/80 shadow-[0_0_8px_rgba(34,211,238,0.2)]'
                  : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
              }`}
            >
              SKETCHFAB 3D
            </button>
          </div>

          {/* Step 1 Blender Workspace Controls (Only visible in calibration onboarding Step 1) */}
          {currentStep === 1 && (
            <div className="hidden md:flex items-center gap-3 bg-black/80 backdrop-blur-md border border-zinc-800/80 rounded-full px-4 py-1 pointer-events-auto shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              {/* Shading modes */}
              <div className="flex items-center gap-1 border-r border-zinc-800 pr-3 mr-1">
                <span className="text-[8px] text-zinc-500 mr-1.5 uppercase font-bold tracking-wider">shading:</span>
                {(['wireframe', 'solid', 'rendered'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setShadingMode(mode);
                      if (onboardingStep === 1) {
                        setOnboardingStep(2);
                      }
                    }}
                    className={`px-2 py-1 rounded text-[8px] font-bold tracking-wide uppercase transition-all duration-200 ${
                      shadingMode === mode
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_8px_rgba(34,211,238,0.25)]'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40 border border-transparent'
                    }`}
                  >
                    {mode === 'wireframe' ? 'Wire' : mode === 'solid' ? 'Solid' : 'Render'}
                  </button>
                ))}
              </div>

              {/* Focal Length Selector */}
              <div className="flex items-center gap-1">
                <span className="text-[8px] text-zinc-500 mr-1.5 uppercase font-bold tracking-wider">lens:</span>
                {([24, 50, 85] as const).map((len) => (
                  <button
                    key={len}
                    onClick={() => setFocalLength(len)}
                    className={`px-2 py-1 rounded text-[8px] font-bold tracking-wide transition-all duration-200 ${
                      focalLength === len
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_8px_rgba(34,211,238,0.25)]'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40 border border-transparent'
                    }`}
                  >
                    {len}mm
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Right side: time and 3D navigation widget */}
          <div className="flex items-center gap-4 bg-black/60 backdrop-blur-md border border-zinc-800 rounded-full px-3 py-1.5 pointer-events-auto">
            {/* Minimal XYZ Axis compass widget */}
            {currentStep === 1 && (
              <div className="flex gap-2 items-center text-[7px] border-r border-zinc-800 pr-3 font-mono opacity-80">
                <span className="text-rose-500 font-bold">X</span>
                <span className="text-emerald-500 font-bold">Y</span>
                <span className="text-blue-500 font-bold">Z</span>
                <div className="w-3 h-3 rounded-full border border-zinc-700 relative flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-cyan-400 absolute" style={{ top: '2px', left: '6px' }} />
                </div>
              </div>
            )}
            <div className="flex items-center gap-1 text-neon-cyan">
              <Disc className="w-3.5 h-3.5 animate-[spin_3s_linear_infinite]" />
              <span className="text-[9px] uppercase">REC [AR]</span>
            </div>
            <span className="text-zinc-400">{timestamp || '15:02:52'}</span>
          </div>
        </div>

        {/* HUD: Mobile Step 1 controls (visible on smaller screens) */}
        {currentStep === 1 && (
          <div className="md:hidden flex flex-col gap-2 mt-2 pointer-events-auto bg-black/80 backdrop-blur-md border border-zinc-800 p-2.5 rounded-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 mb-1">
              <span className="text-[8px] text-zinc-500 font-bold uppercase">Viewport Settings</span>
              <span className="text-[8px] text-cyan-400 font-bold font-mono">{focalLength}mm / {shadingMode.toUpperCase()}</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <div className="flex gap-1">
                {(['wireframe', 'solid', 'rendered'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setShadingMode(mode);
                      if (onboardingStep === 1) {
                        setOnboardingStep(2);
                      }
                    }}
                    className={`px-1.5 py-1 rounded text-[8px] font-bold uppercase transition-all ${
                      shadingMode === mode ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-zinc-500'
                    }`}
                  >
                    {mode === 'wireframe' ? 'Wire' : mode === 'solid' ? 'Solid' : 'Render'}
                  </button>
                ))}
              </div>
              <div className="flex gap-1">
                {[24, 50, 85].map((len) => (
                  <button
                    key={len}
                    onClick={() => setFocalLength(len)}
                    className={`px-1.5 py-1 rounded text-[8px] font-bold transition-all ${
                      focalLength === len ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-zinc-500'
                    }`}
                  >
                    {len}m
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* HUD: Target Corners */}
        <div className="absolute inset-x-8 inset-y-14 flex flex-col justify-between pointer-events-none opacity-40">
          <div className="flex justify-between">
            <div className="w-4 h-4 border-t-2 border-l-2 border-neon-cyan" />
            <div className="w-4 h-4 border-t-2 border-r-2 border-neon-cyan" />
          </div>
          <div className="flex justify-between">
            <div className="w-4 h-4 border-b-2 border-l-2 border-neon-cyan" />
            <div className="w-4 h-4 border-b-2 border-r-2 border-neon-cyan" />
          </div>
        </div>

        {/* MIDDLE: FLOATING AR ONBOARDING INSTRUCTIONS (Step 1 Calibration) */}
        {currentStep === 1 && (
          <div className="absolute inset-x-0 bottom-24 flex justify-center pointer-events-none z-30">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-black/85 backdrop-blur-xl border border-zinc-800/80 p-4 rounded-2xl w-[90%] max-w-sm text-left pointer-events-auto shadow-2xl relative overflow-hidden"
            >
              {/* Animated scanning laser on wizard header */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-1.5 text-cyan-400">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span className="text-[10px] font-bold tracking-widest uppercase">
                    Onboarding Calibration Wizard
                  </span>
                </div>
                <div className="text-[8px] bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded-md font-mono">
                  STAGE {onboardingStep + 1}/4
                </div>
              </div>

              {/* Step-specific wizard instruction cards */}
              <AnimatePresence mode="wait">
                {onboardingStep === 0 && (
                  <motion.div
                    key="onb-0"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: -10 }}
                    className="space-y-2.5"
                  >
                    <p className="text-[10px] text-zinc-300 leading-normal font-sans">
                      Welcome to Plated AR. Before scanning inventory, we must align your kitchen counter space with the virtual co-processor.
                    </p>
                    <button
                      onClick={() => setOnboardingStep(1)}
                      className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-sans font-extrabold text-xs py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                    >
                      INITIALIZE AR CALIBRATION
                    </button>
                  </motion.div>
                )}

                {onboardingStep === 1 && (
                  <motion.div
                    key="onb-1"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: -10 }}
                    className="space-y-2.5"
                  >
                    <p className="text-[10px] text-zinc-300 leading-normal font-sans">
                      Excellent. Let's configure your viewport shading. Select your preferred style (<span className="text-cyan-400">Wire</span>, <span className="text-cyan-400">Solid</span>, or <span className="text-cyan-400">Render</span>) in the top menu to calibrate optical sensors.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setShadingMode('rendered');
                          setOnboardingStep(2);
                        }}
                        className="flex-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-sans font-bold text-[10px] py-2 rounded-xl transition-all"
                      >
                        SKIP / DEFAULT RENDER
                      </button>
                    </div>
                  </motion.div>
                )}

                {onboardingStep === 2 && (
                  <motion.div
                    key="onb-2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: -10 }}
                    className="space-y-2.5"
                  >
                    <p className="text-[10px] text-zinc-300 leading-normal font-sans">
                      Sensors warmed up. Now, align your camera with the empty circular plate on the counter. <span className="text-cyan-400 font-bold animate-pulse">Tap the Plate directly</span> inside the viewport to lock depth mapping.
                    </p>
                    <div className="text-[8px] text-amber-500 font-bold uppercase animate-pulse flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                      Awaiting plate alignment click...
                    </div>
                  </motion.div>
                )}

                {onboardingStep === 3 && (
                  <motion.div
                    key="onb-3"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: -10 }}
                    className="space-y-2.5"
                  >
                    <p className="text-[10px] text-emerald-400 leading-normal font-sans font-bold">
                      ✓ Countertop space successfully calibrated! Watson terminal HIC-9801 linked.
                    </p>
                    <p className="text-[9px] text-zinc-400 font-sans">
                      You are now ready to lock your camera state. Select a cuisine category on the right panel to boot up the scanner.
                    </p>
                    <div className="text-[8px] text-cyan-400 border border-cyan-500/20 bg-cyan-950/30 px-2 py-1 rounded-lg">
                      LOCKED SYSTEM STATUS: ACTIVE // AWAITING CUISINE INPUT
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress Stepper indicators */}
              <div className="flex gap-1.5 mt-3 pt-2.5 border-t border-zinc-900 justify-center">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      onboardingStep === idx
                        ? 'w-6 bg-cyan-400'
                        : onboardingStep > idx
                        ? 'w-2.5 bg-emerald-500'
                        : 'w-2.5 bg-zinc-800'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* HUD: Side Metrics */}
        <div className="flex justify-between items-end">
          {/* Left corner logs */}
          <div className="space-y-1 bg-black/60 backdrop-blur-md border border-zinc-800 p-2.5 rounded-xl text-zinc-400 text-[8px] max-w-[200px]">
            <div className="text-neon-cyan font-bold uppercase text-[9px] tracking-wider mb-1 flex items-center gap-1">
              <Database className="w-3 h-3" /> system telemetry
            </div>
            <div className="flex justify-between gap-4">
              <span>FOV:</span>
              <span className="text-white font-bold">{currentStep === 1 ? `${focalLength}mm (AR)` : '84.2° (AR)'}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>CUISINE TARGET:</span>
              <span className="text-neon-cyan font-bold">{selectedCuisine || 'AWAITING'}</span>
            </div>
            {inputMode === 'real_upload' ? (
              <>
                <div className="flex justify-between gap-4">
                  <span>REAL FRIDGE:</span>
                  <span className={`${realFridgeItems.length > 0 ? 'text-neon-green' : 'text-amber-500'} font-bold`}>
                    {realFridgeItems.length > 0 ? `${realFridgeItems.length} DETECTED` : 'EMPTY'}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>REAL FREEZER:</span>
                  <span className={`${realFreezerItems.length > 0 ? 'text-neon-green' : 'text-amber-500'} font-bold`}>
                    {realFreezerItems.length > 0 ? `${realFreezerItems.length} DETECTED` : 'EMPTY'}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>REAL CABINET:</span>
                  <span className={`${realCabinetItems.length > 0 ? 'text-neon-green' : 'text-amber-500'} font-bold`}>
                    {realCabinetItems.length > 0 ? `${realCabinetItems.length} DETECTED` : 'EMPTY'}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between gap-4">
                  <span>FRIDGE SCAN:</span>
                  <span className={`${fridgeScanned ? 'text-neon-green' : 'text-amber-500'} font-bold`}>
                    {fridgeScanned ? `${scannedFridgeItems.length} ITEMS` : 'INACTIVE'}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>CABINET SCAN:</span>
                  <span className={`${cabinetScanned ? 'text-neon-green' : 'text-amber-500'} font-bold`}>
                    {cabinetScanned ? `${scannedPantryItems.length} ITEMS` : 'INACTIVE'}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Right corner interactive scan controls (only active in Scanning Steps 2 & 3) */}
          <div className="pointer-events-auto">
            {(currentStep === 2 || currentStep === 3) && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startScanAnimation}
                disabled={isScanning || (currentStep === 2 && fridgeScanned) || (currentStep === 3 && cabinetScanned)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-mono text-xs font-bold transition-all duration-300 pointer-events-auto ${
                  (currentStep === 2 && fridgeScanned) || (currentStep === 3 && cabinetScanned)
                    ? 'bg-zinc-900/90 border-neon-green/40 text-neon-green shadow-[0_0_15px_rgba(57,255,20,0.1)]'
                    : isScanning
                    ? 'bg-cyan-950/40 border-neon-cyan/40 text-neon-cyan animate-pulse'
                    : 'bg-black/80 border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                }`}
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>SCANNING {scanProgress}%</span>
                  </>
                ) : (currentStep === 2 && fridgeScanned) || (currentStep === 3 && cabinetScanned) ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>SCAN COMPLETED</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    <span>
                      {currentStep === 2 ? 'SCAN FRIDGE INTERIOR' : 'SCAN DRY STOCK CABINET'}
                    </span>
                  </>
                )}
              </motion.button>
            )}

            {currentStep === 5 && selectedRecipe && (
              <div className="bg-black/60 backdrop-blur-md border border-zinc-800 p-2.5 rounded-xl flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-neon-cyan animate-pulse" />
                <span className="text-[9px] font-mono text-zinc-300">
                  PROJECTING IN 1:1 REAL SCALE
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Holographic Guide Box */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 glass-cyan px-6 py-4 rounded-2xl flex flex-col items-center gap-3 w-72 pointer-events-none"
          >
            <Cpu className="w-8 h-8 text-neon-cyan animate-spin" />
            <div className="text-center">
              <div className="text-xs font-bold font-sans text-white">Neural Scan In Progress</div>
              <div className="text-[9px] font-mono text-neon-cyan mt-1">CROSS-REFERENCE IDENTITIES</div>
            </div>
            
            <div className="w-full bg-zinc-950/80 h-2.5 rounded-full border border-zinc-800 p-0.5">
              <div 
                className="bg-neon-cyan h-full rounded-full transition-all duration-100 ease-out shadow-[0_0_10px_rgba(0,240,255,1)]"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
            <div className="text-[8px] font-mono text-zinc-500">
              FRAME ANALYZED: {Math.floor(scanProgress * 4.2)} / 420
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
