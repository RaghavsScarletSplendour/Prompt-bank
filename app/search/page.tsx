"use client";

import { useState, useEffect, useCallback } from "react";
import PromptGallery from "@/components/PromptGallery";
import { Category } from "@/lib/types";
import Button from "@/components/ui/Button";

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
  const [error, setError] = useState<string | null>(null);

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
  const semanticSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/prompts/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();

    if (!res.ok) {
        setError(data.error || "Semantic search failed. Please try again.");
        setSearchResults([]);
        return;
      }

      setSearchResults(data.prompts || []);
    } catch (err) {
      console.error("Semantic search error:", err);
      setError("Failed to connect to search service. Check your API key and try again.");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

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

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-100 mb-6">
        Search Prompts
      </h2>

      {/* Search Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <Button
          size="sm"
          onClick={() => {
            setSearchMode("text");
            setError(null);
          }}
          className={searchMode === "text" ? "bg-gray-700 text-white" : ""}
        >
          Text Search
        </Button>
        <Button
          size="sm"
          onClick={() => {
            setSearchMode("semantic");
            setError(null);
          }}
          className={searchMode === "semantic" ? "bg-gray-700 text-white" : ""}
        >
          Semantic Search
        </Button>
      </div>

      <input
        type="text"
        placeholder={
          searchMode === "semantic"
            ? "Describe what you're looking for..."
            : "Search prompts by name..."
        }
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full max-w-md px-4 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent mb-6"
      />

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm text-red-800 font-medium">Semantic search error</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
            <Button
              variant="icon"
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">
          {searchMode === "semantic" ? "Searching..." : "Loading..."}
        </div>
      ) : searchQuery === "" ? (
        <div className="text-center py-12 text-gray-400">
          {searchMode === "semantic"
            ? "Describe your task in natural language to find the best matching prompts..."
            : "Type to search for prompts by name..."}
        </div>
      ) : displayPrompts.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No prompts found matching "{searchQuery}"
        </div>
      ) : (
        <PromptGallery
          prompts={displayPrompts}
          onRefresh={fetchPrompts}
          showSimilarity={searchMode === "semantic"}
          categories={categories}
        />
      )}
    </div>
  );
}
