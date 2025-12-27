import PromptCard from "./PromptCard";

interface Prompt {
  id: string;
  name: string;
  tags: string | null;
  content: string;
  created_at: string;
}

interface PromptGalleryProps {
  prompts: Prompt[];
}

export default function PromptGallery({ prompts }: PromptGalleryProps) {
  if (prompts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No prompts yet. Add your first prompt!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {prompts.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} />
      ))}
    </div>
  );
}
