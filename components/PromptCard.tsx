"use client";

import { useState, useRef, useEffect } from "react";
import PromptDetailModal from "./PromptDetailModal";
import { Category } from "@/lib/types";
import { CategoryBadge } from "./ui/CategoryBadge";

interface Prompt {
  id: string;
  name: string;
  content: string;
  created_at: string;
  category_id: string | null;
  similarity?: number;
}

interface PromptCardProps {
  prompt: Prompt;
  onDelete: (id: string) => void;
  onEdit?: () => void;
  showSimilarity?: boolean;
  categories: Category[];
  categoryName?: string;
}

export default function PromptCard({ prompt, onDelete, onEdit, showSimilarity, categories, categoryName }: PromptCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [startInEditMode, setStartInEditMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div
        className="bg-gray-800 border border-white/5 rounded-2xl p-6 relative cursor-pointer"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 8px 24px rgba(0,0,0,0.04)' }}
        onClick={() => {
          setStartInEditMode(false);
          setDetailOpen(true);
        }}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0 mr-2">
            <div className="flex items-start gap-2">
              <h3 className="font-semibold text-lg text-gray-100">{prompt.name}</h3>
              {showSimilarity && prompt.similarity !== undefined && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded flex-shrink-0">
                  {Math.min(99, Math.round(prompt.similarity * 125))}% match
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-gray-200"
              title="Copy to clipboard"
            >
              {copied ? (
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
            <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-gray-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setStartInEditMode(true);
                    setDetailOpen(true);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(prompt.id);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                >
                  Delete
                </button>
              </div>
            )}
            </div>
          </div>
        </div>
        {categoryName && prompt.category_id && (
          <div className="flex flex-wrap gap-1 mb-3">
            <CategoryBadge categoryId={prompt.category_id} name={categoryName} />
          </div>
        )}
        <p className="text-gray-400 text-sm whitespace-pre-wrap line-clamp-4">
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
        categories={categories}
      />
    </>
  );
}
