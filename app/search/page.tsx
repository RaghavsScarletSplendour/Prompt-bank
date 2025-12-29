"use client";

import { useState, useEffect, useCallback } from "react";
import PromptGallery from "@/components/PromptGallery";

interface Prompt {
  id: string;
  name: string;
  tags: string | null;
  content: string;
  created_at: string;
  similarity?: number;
}

export default function SearchPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
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
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, searchMode, semanticSearch]);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const displayPrompts =
    searchMode === "semantic" ? searchResults : filteredPrompts;

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Search Prompts
      </h2>

      {/* Search Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => {
            setSearchMode("text");
            setError(null);
          }}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            searchMode === "text"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Text Search
        </button>
        <button
          onClick={() => {
            setSearchMode("semantic");
            setError(null);
          }}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            searchMode === "semantic"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Semantic Search
        </button>
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
        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6"
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
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">
          {searchMode === "semantic" ? "Searching..." : "Loading..."}
        </div>
      ) : searchQuery === "" ? (
        <div className="text-center py-12 text-gray-500">
          {searchMode === "semantic"
            ? "Describe your task in natural language to find the best matching prompts..."
            : "Type to search for prompts by name..."}
        </div>
      ) : displayPrompts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No prompts found matching "{searchQuery}"
        </div>
      ) : (
        <PromptGallery
          prompts={displayPrompts}
          onRefresh={fetchPrompts}
          showSimilarity={searchMode === "semantic"}
        />
      )}
    </div>
  );
}
