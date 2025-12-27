"use client";

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
}

export default function PromptDetailModal({ isOpen, onClose, prompt }: PromptDetailModalProps) {
  const tags = prompt.tags ? prompt.tags.split(",").map((t) => t.trim()) : [];
  const createdDate = new Date(prompt.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{prompt.name}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {tags.length > 0 && (
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
        )}

        <div className="mb-4">
          <p className="text-gray-700 whitespace-pre-wrap">{prompt.content}</p>
        </div>

        <div className="text-sm text-gray-500 border-t pt-3">
          Created: {createdDate}
        </div>
      </div>
    </Modal>
  );
}
