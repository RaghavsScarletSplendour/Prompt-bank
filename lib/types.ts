// Shared types for the application

export interface Category {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
}

export interface Prompt {
  id: string;
  name: string;
  tags: string | null;
  content: string;
  created_at: string;
  category_id: string | null;
  similarity?: number; // Present in semantic search results
}
