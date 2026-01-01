"use client";

import { useState } from "react";
import { PROMPT_LIMITS, validatePromptInput } from "@/lib/validations";
import Modal from "./Modal";
import { Category } from "@/lib/types";
import Button from "./ui/Button";
import { FormInput, FormTextarea, FormSelect } from "./ui/FormInput";
import ErrorAlert from "./ui/ErrorAlert";

interface PromptFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categories: Category[];
}

export default function PromptForm({ isOpen, onClose, onSuccess, categories }: PromptFormProps) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validation = validatePromptInput({ name, content });
    if (!validation.success) {
      setError(validation.error);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          content: content.trim(),
          category_id: categoryId || null,
        }),
      });

      if (res.ok) {
        setName("");
        setContent("");
        setCategoryId("");
        setError("");
        onSuccess();
        onClose();
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to save prompt");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Add New Prompt</h2>
      <ErrorAlert message={error} />
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="My awesome prompt"
          maxLength={PROMPT_LIMITS.name.maxLength}
        />
        <FormSelect
          label="Category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">No Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </FormSelect>
        <FormTextarea
          label="Prompt"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={5}
          placeholder="Enter your prompt here..."
          maxLength={PROMPT_LIMITS.content.maxLength}
        />
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="secondary" loading={loading}>
            Save Prompt
          </Button>
        </div>
      </form>
    </Modal>
  );
}
