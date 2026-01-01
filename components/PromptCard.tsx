"use client";

import { useState } from "react";
import PromptDetailModal from "./PromptDetailModal";
import { Category } from "@/lib/types";
import { CategoryBadge } from "./ui/CategoryBadge";
import { Card } from "./ui/Card";
import CopyButton from "./ui/CopyButton";
import Dropdown from "./ui/Dropdown";

interface Prompt {
  id: string;
  name: string;
  content: string;
  created_at: string;
  category_id: string | null;
  similarity?: number;
}

interface PromptCardProps {
  prompt: Prompt;
  onDelete: (id: string) => void;
  onEdit?: () => void;
  showSimilarity?: boolean;
  categories: Category[];
  categoryName?: string;
}

export default function PromptCard({ prompt, onDelete, onEdit, showSimilarity, categories, categoryName }: PromptCardProps) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [startInEditMode, setStartInEditMode] = useState(false);

  const dropdownItems = [
    {
      label: "Edit",
      onClick: () => {
        setStartInEditMode(true);
        setDetailOpen(true);
      },
    },
    {
      label: "Delete",
      onClick: () => onDelete(prompt.id),
      variant: "danger" as const,
    },
  ];

  return (
    <>
      <Card
        interactive
        className="relative"
        onClick={() => {
          setStartInEditMode(false);
          setDetailOpen(true);
        }}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0 mr-2">
            <div className="flex items-start gap-2">
              <h3 className="font-semibold text-lg text-gray-100">{prompt.name}</h3>
              {showSimilarity && prompt.similarity !== undefined && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded flex-shrink-0">
                  {Math.min(99, Math.round(prompt.similarity * 125))}% match
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            <CopyButton text={prompt.content} />
            <Dropdown items={dropdownItems} />
          </div>
        </div>
        {categoryName && prompt.category_id && (
          <div className="flex flex-wrap gap-1 mb-3">
            <CategoryBadge categoryId={prompt.category_id} name={categoryName} />
          </div>
        )}
        <p className="text-gray-400 text-sm whitespace-pre-wrap line-clamp-4">
          {prompt.content}
        </p>
      </Card>
      <PromptDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        prompt={prompt}
        onSave={onEdit}
        onDelete={() => onDelete(prompt.id)}
        initialEditMode={startInEditMode}
        categories={categories}
      />
    </>
  );
}
