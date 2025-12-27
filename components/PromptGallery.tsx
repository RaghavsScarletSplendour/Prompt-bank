"use client";

import { useState } from "react";
import PromptCard from "./PromptCard";
import ConfirmDialog from "./ConfirmDialog";

interface Prompt {
  id: string;
  name: string;
  tags: string | null;
  content: string;
  created_at: string;
}

interface PromptGalleryProps {
  prompts: Prompt[];
  onRefresh: () => void;
}

export default function PromptGallery({ prompts, onRefresh }: PromptGalleryProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);
    try {
      const res = await fetch("/api/prompts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteId }),
      });

      if (res.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error("Failed to delete prompt:", error);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteId(null);
  };

  if (prompts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No prompts yet. Add your first prompt!
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prompts.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} onDelete={handleDeleteClick} />
        ))}
      </div>
      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Prompt"
        message="Are you sure you want to delete this prompt? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={deleting}
      />
    </>
  );
}
