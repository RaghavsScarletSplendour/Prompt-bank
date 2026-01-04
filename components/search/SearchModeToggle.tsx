"use client";

import { motion } from "framer-motion";

interface SearchModeToggleProps {
  mode: "text" | "semantic";
  onChange: (mode: "text" | "semantic") => void;
}

export function SearchModeToggle({ mode, onChange }: SearchModeToggleProps) {
  return (
    <div className="relative flex bg-zinc-800/60 rounded-full p-0.5 border border-white/10">
      {/* Animated background pill */}
      <motion.div
        className="absolute top-0.5 bottom-0.5 bg-cyan-600 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.3)]"
        initial={false}
        animate={{
          left: mode === "text" ? "2px" : "calc(42%)",
          width: mode === "text" ? "calc(40%)" : "calc(56%)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      <button
        onClick={() => onChange("text")}
        className={`relative z-10 px-3 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
          mode === "text" ? "text-white" : "text-gray-400 hover:text-gray-300"
        }`}
      >
        Text
      </button>

      <button
        onClick={() => onChange("semantic")}
        className={`relative z-10 px-3 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
          mode === "semantic" ? "text-white" : "text-gray-400 hover:text-gray-300"
        }`}
      >
        Semantic
      </button>
    </div>
  );
}

export default SearchModeToggle;
