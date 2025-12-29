"use client";

import { useState, useRef, useEffect } from "react";
import PromptDetailModal from "./PromptDetailModal";

interface Prompt {
  id: string;
  name: string;
  tags: string | null;
  content: string;
  created_at: string;
  similarity?: number;
}

interface PromptCardProps {
  prompt: Prompt;
  onDelete: (id: string) => void;
  onEdit?: () => void;
  showSimilarity?: boolean;
}

export default function PromptCard({ prompt, onDelete, onEdit, showSimilarity }: PromptCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [startInEditMode, setStartInEditMode] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const tags = prompt.tags ? prompt.tags.split(",").map((t) => t.trim()) : [];

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div
        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow relative cursor-pointer"
        onClick={() => {
          setStartInEditMode(false);
          setDetailOpen(true);
        }}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg text-gray-900">{prompt.name}</h3>
            {showSimilarity && prompt.similarity !== undefined && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                {Math.min(99, Math.round(prompt.similarity * 125))}% match
              </span>
            )}
          </div>
          <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setStartInEditMode(true);
                    setDetailOpen(true);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(prompt.id);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <p className="text-gray-600 text-sm whitespace-pre-wrap line-clamp-4">
          {prompt.content}
        </p>
      </div>
      <PromptDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        prompt={prompt}
        onSave={onEdit}
        onDelete={() => onDelete(prompt.id)}
        initialEditMode={startInEditMode}
      />
    </>
  );
}
