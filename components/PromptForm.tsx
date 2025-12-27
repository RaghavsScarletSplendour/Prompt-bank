"use client";

import { useState } from "react";
import { PROMPT_LIMITS, validatePromptInput } from "@/lib/validations";
import Modal from "./Modal";

interface PromptFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PromptForm({ isOpen, onClose, onSuccess }: PromptFormProps) {
  const [name, setName] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validation using shared logic
    const validation = validatePromptInput({ name, content, tags });
    if (!validation.success) {
      setError(validation.error);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), tags: tags.trim(), content: content.trim() }),
      });

      if (res.ok) {
        setName("");
        setTags("");
        setContent("");
        setError("");
        onSuccess();
        onClose();
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to save prompt");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-semibold mb-4">Add New Prompt</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="My awesome prompt"
            maxLength={PROMPT_LIMITS.name.maxLength}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="coding, writing, creative"
            maxLength={PROMPT_LIMITS.tags.maxLength}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prompt
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={5}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your prompt here..."
            maxLength={PROMPT_LIMITS.content.maxLength}
          />
        </div>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Prompt"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
