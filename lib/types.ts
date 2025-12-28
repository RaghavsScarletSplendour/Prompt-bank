// Shared types for the application

export interface Prompt {
  id: string;
  name: string;
  tags: string | null;
  content: string;
  created_at: string;
}
