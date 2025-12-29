"use client";

import { useState, useEffect } from "react";
import PromptGallery from "@/components/PromptGallery";
import PromptForm from "@/components/PromptForm";
import CategoryManager from "@/components/CategoryManager";
import { Category } from "@/lib/types";

interface Prompt {
  id: string;
  name: string;
  tags: string | null;
  content: string;
  created_at: string;
  category_id: string | null;
}

export default function GalleryPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPrompts = async () => {
    try {
      const res = await fetch("/api/prompts");
      const data = await res.json();
      setPrompts(data.prompts || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchPrompts();
    fetchCategories();
  }, []);

  // Filter prompts based on selected category
  const filteredPrompts = prompts.filter((prompt) => {
    if (selectedCategoryId === null) return true; // "All"
    if (selectedCategoryId === "uncategorized") return !prompt.category_id;
    return prompt.category_id === selectedCategoryId;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Your Prompts</h2>
        <div className="flex items-center gap-3">
          <CategoryManager
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
            onCategoriesChange={fetchCategories}
          />
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            + Add Prompt
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : (
        <PromptGallery prompts={filteredPrompts} onRefresh={fetchPrompts} categories={categories} />
      )}

      <PromptForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchPrompts}
        categories={categories}
      />
    </div>
  );
}
