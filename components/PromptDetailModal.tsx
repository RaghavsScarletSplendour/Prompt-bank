"use client";

import { useState, useEffect } from "react";
import { PROMPT_LIMITS, validatePromptInput } from "@/lib/validations";
import Modal from "./Modal";

interface Prompt {
  id: string;
  name: string;
  tags: string | null;
  content: string;
  created_at: string;
}

interface PromptDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: Prompt;
  onSave?: () => void;
}

export default function PromptDetailModal({ isOpen, onClose, prompt, onSave }: PromptDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(prompt.name);
  const [tagsInput, setTagsInput] = useState(prompt.tags || "");
  const [content, setContent] = useState(prompt.content);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset form when prompt changes or modal opens
  useEffect(() => {
    setName(prompt.name);
    setTagsInput(prompt.tags || "");
    setContent(prompt.content);
    setIsEditing(false);
    setError("");
  }, [prompt, isOpen]);

  const tags = prompt.tags ? prompt.tags.split(",").map((t) => t.trim()) : [];
  const createdDate = new Date(prompt.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleCancel = () => {
    setName(prompt.name);
    setTagsInput(prompt.tags || "");
    setContent(prompt.content);
    setIsEditing(false);
    setError("");
  };

  const handleSave = async () => {
    setError("");

    const validation = validatePromptInput({ name, content, tags: tagsInput });
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
          tags: tagsInput.trim(),
          content: content.trim(),
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
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isEditing ? (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="coding, writing, creative"
              maxLength={PROMPT_LIMITS.tags.maxLength}
            />
          </div>
        ) : (
          tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )
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
          <div className="flex gap-2">
            {isEditing ? (
              <>
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
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
