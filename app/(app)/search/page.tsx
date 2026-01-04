"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import PromptGallery from "@/components/PromptGallery";
import { Category } from "@/lib/types";
import { PromptSearchBar } from "@/components/search/PromptSearchBar";
import { SearchEmptyState } from "@/components/search/SearchEmptyState";
import { SearchSkeletonGrid } from "@/components/search/SearchSkeletonGrid";
import { ToastContainer } from "@/components/ui/Toast";
import { useToast } from "@/lib/hooks/useToast";

interface Prompt {
  id: string;
  name: string;
  content: string;
  created_at: string;
  category_id: string | null;
  similarity?: number;
}

export default function SearchPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState<"text" | "semantic">("text");
  const [searchResults, setSearchResults] = useState<Prompt[]>([]);
  const [hasSearchedSemantic, setHasSearchedSemantic] = useState(false);
  const { toasts, showToast, dismissToast } = useToast();

  // Text search: filter locally
  const filteredPrompts = prompts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchPrompts = async () => {
    setLoading(true);
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

  // Semantic search: call API
  const semanticSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch("/api/prompts/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });
        const data = await res.json();

        if (!res.ok) {
          showToast(data.error || "Semantic search failed", "error");
          setSearchResults([]);
          return;
        }

        setSearchResults(data.prompts || []);
      } catch (err) {
        console.error("Semantic search error:", err);
        showToast("Failed to connect to search service", "error");
        setSearchResults([]);
      } finally {
        setLoading(false);
        setHasSearchedSemantic(true);
      }
    },
    [showToast]
  );

  // Debounce semantic search
  useEffect(() => {
    if (searchMode !== "semantic") return;

    const timer = setTimeout(() => {
      semanticSearch(searchQuery);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchQuery, searchMode, semanticSearch]);

  useEffect(() => {
    fetchPrompts();
    fetchCategories();
  }, []);

  const displayPrompts =
    searchMode === "semantic" ? searchResults : filteredPrompts;

  const hasQuery = searchQuery.trim().length > 0;

  const handleModeChange = (mode: "text" | "semantic") => {
    setSearchMode(mode);
    setSearchResults([]);
    setHasSearchedSemantic(false);
  };

  return (
    <div className="min-h-[70vh]">
      {/* Animated Search Container */}
      <motion.div
        className="flex flex-col items-center w-full"
        initial={false}
        animate={{
          paddingTop: hasQuery ? "0rem" : "15vh",
        }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        <PromptSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          mode={searchMode}
          onModeChange={handleModeChange}
          isSearching={loading && searchMode === "semantic"}
        />
      </motion.div>

      {/* Results Section */}
      <motion.div
        className="mt-8 max-w-[1200px] mx-auto"
        initial={false}
        animate={{ opacity: hasQuery ? 1 : 0.9 }}
      >
        {loading ? (
          <SearchSkeletonGrid count={6} />
        ) : !hasQuery ? (
          <SearchEmptyState
            mode={searchMode}
            onSuggestionClick={(suggestion) => setSearchQuery(suggestion)}
          />
        ) : displayPrompts.length === 0 && (searchMode === "text" || hasSearchedSemantic) ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <p className="text-gray-400">
              No prompts found matching "{searchQuery}"
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Try a different search term or switch to{" "}
              {searchMode === "text" ? "Semantic" : "Text"} mode
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <PromptGallery
              prompts={displayPrompts}
              onRefresh={fetchPrompts}
              showSimilarity={searchMode === "semantic"}
              categories={categories}
            />
          </motion.div>
        )}
      </motion.div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
