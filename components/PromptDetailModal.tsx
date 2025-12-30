"use client";

import { useState, useEffect, useRef } from "react";
import { PROMPT_LIMITS, validatePromptInput } from "@/lib/validations";
import Modal from "./Modal";
import { Category } from "@/lib/types";

interface Prompt {
  id: string;
  name: string;
  content: string;
  created_at: string;
  category_id: string | null;
}

interface PromptDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: Prompt;
  onSave?: () => void;
  onDelete?: () => void;
  initialEditMode?: boolean;
  categories: Category[];
}

export default function PromptDetailModal({ isOpen, onClose, prompt, onSave, onDelete, initialEditMode = false, categories }: PromptDetailModalProps) {
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState(prompt.name);
  const [content, setContent] = useState(prompt.content);
  const [categoryId, setCategoryId] = useState(prompt.category_id || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  // Reset form when prompt changes or modal opens
  useEffect(() => {
    setName(prompt.name);
    setContent(prompt.content);
    setCategoryId(prompt.category_id || "");
    setIsEditing(initialEditMode);
    setError("");
    setMenuOpen(false);
  }, [prompt, isOpen, initialEditMode]);

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

  const categoryName = categories.find((c) => c.id === prompt.category_id)?.name;
  const createdDate = new Date(prompt.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleCancel = () => {
    setName(prompt.name);
    setContent(prompt.content);
    setCategoryId(prompt.category_id || "");
    setIsEditing(false);
    setError("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    setError("");

    const validation = validatePromptInput({ name, content });
    if (!validation.success) {
      setError(validation.error);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/prompts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: prompt.id,
          name: name.trim(),
          content: content.trim(),
          category_id: categoryId || null,
        }),
      });

      if (res.ok) {
        setIsEditing(false);
        setError("");
        onSave?.();
        onClose();
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to update prompt");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="max-h-[80vh] overflow-y-auto">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-between items-start mb-4">
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-xl font-semibold text-gray-900 border border-gray-300 rounded px-2 py-1 flex-1 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={PROMPT_LIMITS.name.maxLength}
            />
          ) : (
            <h2 className="text-xl font-semibold text-gray-900">{prompt.name}</h2>
          )}
          <div className="flex items-center gap-1">
            {!isEditing && (
              <>
                <button
                  onClick={handleCopy}
                  className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
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
                        setIsEditing(true);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onClose();
                        onDelete?.();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
                </div>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {isEditing ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <div className="flex flex-wrap gap-1 mb-4">
            {categoryName && (
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                {categoryName}
              </span>
            )}
          </div>
        )}

        <div className="mb-4">
          {isEditing ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={PROMPT_LIMITS.content.maxLength}
            />
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap">{prompt.content}</p>
          )}
        </div>

        <div className="flex justify-between items-center border-t pt-3">
          <div className="text-sm text-gray-500">
            Created: {createdDate}
          </div>
          {isEditing && (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
