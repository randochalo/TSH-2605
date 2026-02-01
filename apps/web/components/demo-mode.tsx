"use client";

import { useState, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  RotateCcw, 
  Info,
  X,
  Keyboard
} from "lucide-react";

// Demo mode indicator
export function DemoBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg">
        <Sparkles className="w-4 h-4" />
        <span className="text-sm font-medium">Demo Mode</span>
      </div>
    </motion.div>
  );
}

// Demo watermark
export function DemoWatermark() {
  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] rotate-[-30deg]">
        <span className="text-8xl font-bold text-slate-900 select-none">
          DEMO
        </span>
      </div>
    </div>
  );
}

// Sample data indicator
export function SampleDataBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded border border-amber-200">
      <Info className="w-3 h-3" />
      Sample Data
    </span>
  );
}

// Quick action button
interface QuickActionProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
}

export function QuickAction({ icon, label, onClick, variant = "primary" }: QuickActionProps) {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${variants[variant]}`}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
}

// Reset demo button
export function ResetDemoButton({ onReset }: { onReset: () => void }) {
  return (
    <QuickAction
      icon={<RotateCcw className="w-4 h-4" />}
      label="Reset Demo"
      onClick={onReset}
      variant="secondary"
    />
  );
}

// Demo tip tooltip
interface DemoTipProps {
  tip: string;
  position?: "top" | "bottom" | "left" | "right";
}

export function DemoTip({ tip, position = "top" }: DemoTipProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrows = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-purple-600",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-purple-600",
    left: "left-full top-1/2 -translate-y-1/2 border-l-purple-600",
    right: "right-full top-1/2 -translate-y-1/2 border-r-purple-600",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`absolute ${positions[position]} z-50`}
      >
        <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg shadow-lg max-w-xs">
          <div className={`absolute w-0 h-0 border-4 border-transparent ${arrows[position]}`} />
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{tip}</p>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white/70 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Keyboard shortcut help
export function KeyboardShortcuts({ shortcuts }: { shortcuts: { key: string; action: string }[] }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" && e.ctrlKey) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 w-10 h-10 bg-slate-800 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-slate-700 transition-colors z-50"
        title="Keyboard shortcuts (Ctrl + ?)"
      >
        <Keyboard className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 pointer-events-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-2">
                  {shortcuts.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <span className="text-slate-600">{shortcut.action}</span>
                      <kbd className="px-2 py-1 bg-slate-100 rounded text-sm font-mono text-slate-700">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
