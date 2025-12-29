"use client";

import { useState, useRef, useEffect } from "react";
import Modal from "./Modal";
import { Category } from "@/lib/types";

interface CategoryManagerProps {
  categories: Category[];
  selectedCategoryId: string | null; // null = "All", "uncategorized" = no category
  onSelectCategory: (categoryId: string | null) => void;
  onCategoriesChange: () => void;
}

export default function CategoryManager({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onCategoriesChange,
}: CategoryManagerProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getSelectedLabel = () => {
    if (selectedCategoryId === null) return "All";
    if (selectedCategoryId === "uncategorized") return "Uncategorized";
    const category = categories.find((c) => c.id === selectedCategoryId);
    return category?.name || "All";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
      >
        <span className="text-gray-600">Category:</span>
        <span className="font-medium">{getSelectedLabel()}</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isDropdownOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <div className="py-1">
            <button
              onClick={() => {
                onSelectCategory(null);
                setIsDropdownOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                selectedCategoryId === null ? "bg-blue-50 text-blue-600" : "text-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                onSelectCategory("uncategorized");
                setIsDropdownOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                selectedCategoryId === "uncategorized" ? "bg-blue-50 text-blue-600" : "text-gray-700"
              }`}
            >
              Uncategorized
            </button>
            {categories.length > 0 && <div className="border-t border-gray-200 my-1" />}
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  onSelectCategory(category.id);
                  setIsDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  selectedCategoryId === category.id ? "bg-blue-50 text-blue-600" : "text-gray-700"
                }`}
              >
                {category.name}
              </button>
            ))}
            <div className="border-t border-gray-200 my-1" />
            <button
              onClick={() => {
                setIsManageOpen(true);
                setIsDropdownOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-100"
            >
              Manage Categories...
            </button>
          </div>
        </div>
      )}

      <ManageCategoriesModal
        isOpen={isManageOpen}
        onClose={() => setIsManageOpen(false)}
        categories={categories}
        onCategoriesChange={onCategoriesChange}
      />
    </div>
  );
}

interface ManageCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onCategoriesChange: () => void;
}

function ManageCategoriesModal({
  isOpen,
  onClose,
  categories,
  onCategoriesChange,
}: ManageCategoriesModalProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      if (res.ok) {
        setNewCategoryName("");
        onCategoriesChange();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create category");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name: editingName.trim() }),
      });

      if (res.ok) {
        setEditingId(null);
        setEditingName("");
        onCategoriesChange();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update category");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Prompts will become uncategorized.")) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        onCategoriesChange();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to delete category");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-semibold mb-4">Manage Categories</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Create new category */}
      <form onSubmit={handleCreate} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="New category name"
          maxLength={50}
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading || !newCategoryName.trim()}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Add
        </button>
      </form>

      {/* Category list */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {categories.length === 0 ? (
          <p className="text-gray-500 text-sm py-4 text-center">No categories yet</p>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center gap-2 p-2 border border-gray-200 rounded-md"
            >
              {editingId === category.id ? (
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    maxLength={50}
                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={() => handleUpdate(category.id)}
                    disabled={loading}
                    className="text-green-600 hover:text-green-700 text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm text-gray-700">{category.name}</span>
                  <button
                    onClick={() => startEditing(category)}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    disabled={loading}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
