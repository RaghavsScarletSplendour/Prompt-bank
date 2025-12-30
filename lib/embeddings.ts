import OpenAI from "openai";

// Lazy-initialize OpenAI client to avoid build-time errors
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

// Generate embedding for text content
export async function generateEmbedding(text: string): Promise<number[]> {
  const client = getOpenAIClient();
  const response = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

// Combine prompt fields into single text for embedding
export function getEmbeddingText(
  name: string,
  content: string,
  useCases: string | null = null
): string {
  const parts = [name, content];
  if (useCases) parts.push(useCases);
  return parts.join(" ");
}
