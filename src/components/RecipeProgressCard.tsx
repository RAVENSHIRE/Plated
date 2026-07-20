import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Volume2, VolumeX, Play, Pause, RefreshCw, CheckCircle2, Award, Clock } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeProgressCardProps {
  recipe: Recipe;
  activeStep: number;
  voiceGuided: boolean;
  onSetStep: (step: number) => void;
  onToggleVoice: () => void;
  onReset: () => void;
}

export default function RecipeProgressCard({
  recipe,
  activeStep,
  voiceGuided,
  onSetStep,
  onToggleVoice,
  onReset,
}: RecipeProgressCardProps) {
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const currentInstruction = recipe.steps[activeStep];

  // Initialize or reset timer based on current step's duration
  useEffect(() => {
    setIsTimerRunning(false);
    if (currentInstruction?.duration) {
      // Parse duration like "8 mins" or "3 mins"
      const match = currentInstruction.duration.match(/\d+/);
      const minutes = match ? parseInt(match[0], 10) : 5;
      setTimerSeconds(minutes * 60); // 60s per minute
    } else {
      setTimerSeconds(0);
    }
  }, [activeStep, recipe, currentInstruction]);

  // Timer countdown simulation
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (activeStep < recipe.steps.length - 1) {
      onSetStep(activeStep + 1);
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      onSetStep(activeStep - 1);
    }
  };

  const isCompleted = activeStep === recipe.steps.length - 1;

  return (
    <div className="w-full backdrop-blur-xl bg-zinc-950/80 border border-cyan-900/50 rounded-3xl p-6 relative overflow-hidden">
      {/* Visual Accent */}
      <div 
        className="absolute top-0 left-0 w-full h-1"
        style={{ backgroundColor: recipe.hologramColor }}
      />

      {/* HEADER SPECS */}
      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            ACTIVE HUD PROJECTION
          </span>
          <h3 className="text-base font-sans font-bold text-white tracking-tight mt-0.5">
            {recipe.title}
          </h3>
        </div>

        <button
          onClick={onToggleVoice}
          className={`p-2 rounded-xl border transition-colors ${
            voiceGuided
              ? 'bg-neon-cyan/15 border-neon-cyan/40 text-neon-cyan'
              : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-white'
          }`}
          title={voiceGuided ? 'Mute AI Assistant voice' : 'Enable holographic AI voice guidance'}
        >
          {voiceGuided ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* PROGRESS TRACKER METRICS */}
      <div className="flex items-center gap-1.5 mb-5">
        {recipe.steps.map((_, idx) => (
          <button
            key={idx}
            onClick={() => onSetStep(idx)}
            className="flex-1 h-1.5 rounded-full transition-all duration-300"
            style={{
              backgroundColor: idx <= activeStep ? recipe.hologramColor : 'rgba(255, 255, 255, 0.08)',
              boxShadow: idx === activeStep ? `0 0 10px ${recipe.hologramColor}` : 'none'
            }}
          />
        ))}
      </div>

      {/* ACTIVE STEP DETAILS */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4 min-h-[140px] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-neon-cyan uppercase tracking-wider">
                INSTRUCTION NODE {activeStep + 1} OF {recipe.steps.length}
              </span>
              
              {currentInstruction.temp && (
                <span className="text-[10px] font-mono border border-zinc-800 bg-zinc-950 px-2 py-0.5 rounded text-zinc-400">
                  {currentInstruction.temp}
                </span>
              )}
            </div>

            <p className="text-sm text-zinc-200 font-sans leading-relaxed">
              {currentInstruction.text}
            </p>
          </div>

          {/* SIMULATED STEP TIMER CONTAINER */}
          {currentInstruction.duration && timerSeconds > 0 && (
            <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-zinc-500 shrink-0" />
                <div className="font-mono text-xs text-zinc-300">
                  Step Timer: <span className="text-white font-bold">{formatTimer(timerSeconds)}</span>
                </div>
              </div>

              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 font-mono text-[10px] text-white hover:text-neon-cyan transition-colors"
              >
                {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{isTimerRunning ? 'PAUSE' : 'START'}</span>
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* VOICE GUIDANCE NOTIFICATION */}
      <AnimatePresence>
        {voiceGuided && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="mt-4 p-3 bg-cyan-950/15 border border-neon-cyan/20 rounded-2xl flex items-start gap-2.5"
          >
            <Volume2 className="w-4 h-4 text-neon-cyan animate-pulse shrink-0 mt-0.5" />
            <div className="text-[10px] font-mono text-zinc-400 leading-relaxed">
              <span className="text-neon-cyan font-bold block uppercase tracking-wider mb-0.5">Holographic Guide:</span>
              "Go ahead and follow the instructions above, chef. The hologram overlays perfect alignment indicators directly on your plate."
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER NAV CONTROLS */}
      <div className="flex items-center justify-between gap-3 mt-6 border-t border-zinc-800/60 pt-4">
        <button
          onClick={handlePrev}
          disabled={activeStep === 0}
          className="flex items-center gap-1 px-3 py-2 border border-zinc-800 bg-zinc-950 text-xs font-semibold text-zinc-400 hover:text-white rounded-xl disabled:opacity-30 disabled:pointer-events-none transition-all font-sans"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {isCompleted ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-green text-black text-xs font-bold shadow-[0_0_15px_rgba(57,255,20,0.2)] hover:brightness-110 font-sans"
          >
            <Award className="w-4 h-4" />
            <span>Finish & Cook Again</span>
          </motion.button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-4 py-2 text-black text-xs font-bold rounded-xl hover:brightness-110 transition-all font-sans"
            style={{ backgroundColor: recipe.hologramColor, boxShadow: `0 0 12px ${recipe.hologramColor}30` }}
          >
            <span>Next Step</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* QUICK RESET / CHANGE RECIPE TRIGGER */}
      <div className="flex justify-center mt-4">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-[9px] font-mono uppercase"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Change Cuisine / Recipe</span>
        </button>
      </div>
    </div>
  );
}
