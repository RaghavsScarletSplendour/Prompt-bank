"use client";

import { useState, useEffect } from "react";
import { PROMPT_LIMITS, validatePromptInput } from "@/lib/validations";
import Modal from "./Modal";
import { Category } from "@/lib/types";
import { CategoryBadge } from "./ui/CategoryBadge";
import Button from "./ui/Button";
import CopyButton from "./ui/CopyButton";
import Dropdown from "./ui/Dropdown";
import { FormSelect } from "./ui/FormInput";
import ErrorAlert from "./ui/ErrorAlert";

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
  const [name, setName] = useState(prompt.name);
  const [content, setContent] = useState(prompt.content);
  const [categoryId, setCategoryId] = useState(prompt.category_id || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset form when prompt changes or modal opens
  useEffect(() => {
    setName(prompt.name);
    setContent(prompt.content);
    setCategoryId(prompt.category_id || "");
    setIsEditing(initialEditMode);
    setError("");
  }, [prompt, isOpen, initialEditMode]);

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
        <ErrorAlert message={error} />

        <div className="flex justify-between items-start mb-4">
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-xl font-semibold text-gray-100 bg-gray-800 border border-gray-700 rounded px-2 py-1 flex-1 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={PROMPT_LIMITS.name.maxLength}
            />
          ) : (
            <h2 className="text-xl font-semibold text-gray-100">{prompt.name}</h2>
          )}
          <div className="flex items-center gap-1">
            {!isEditing && (
              <>
                <CopyButton text={prompt.content} />
                <Dropdown
                  items={[
                    { label: "Edit", onClick: () => setIsEditing(true) },
                    { label: "Delete", onClick: () => { onClose(); onDelete?.(); }, variant: "danger" },
                  ]}
                />
              </>
            )}
            <Button variant="icon" onClick={onClose}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        </div>

        {isEditing ? (
          <FormSelect
            label="Category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mb-4"
          >
            <option value="">No Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </FormSelect>
        ) : (
          <div className="flex flex-wrap gap-1 mb-4">
            {categoryName && prompt.category_id && (
              <CategoryBadge categoryId={prompt.category_id} name={categoryName} />
            )}
          </div>
        )}

        <div className="mb-4">
          {isEditing ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={PROMPT_LIMITS.content.maxLength}
            />
          ) : (
            <p className="text-gray-300 whitespace-pre-wrap">{prompt.content}</p>
          )}
        </div>

        <div className="flex justify-between items-center border-t border-gray-700 pt-3">
          <div className="text-sm text-gray-400">
            Created: {createdDate}
          </div>
          {isEditing && (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave} loading={loading}>
                Save
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
