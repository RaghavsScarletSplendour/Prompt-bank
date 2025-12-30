// Validation constants - single source of truth
export const PROMPT_LIMITS = {
  name: { maxLength: 100 },
  content: { maxLength: 10000 },
} as const;

// Types
export type ValidationResult =
  | { success: true; data: { name: string; content: string } }
  | { success: false; error: string };

// Sanitize string: trim and strip control characters
function sanitizeString(str: string, allowNewlines = false): string {
  let result = str.trim();
  if (allowNewlines) {
    // Remove control chars except newline (\n) and carriage return (\r)
    result = result.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, '');
  } else {
    // Remove all control characters
    result = result.replace(/[\x00-\x1F\x7F]/g, '');
  }
  return result;
}

// Main validation function
export function validatePromptInput(input: unknown): ValidationResult {
  if (!input || typeof input !== 'object') {
    return { success: false, error: 'Invalid request body' };
  }

  const { name, content } = input as Record<string, unknown>;

  // Name validation
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return { success: false, error: 'Name is required' };
  }
  if (name.length > PROMPT_LIMITS.name.maxLength) {
    return { success: false, error: `Name too long (max ${PROMPT_LIMITS.name.maxLength} characters)` };
  }

  // Content validation
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return { success: false, error: 'Content is required' };
  }
  if (content.length > PROMPT_LIMITS.content.maxLength) {
    return { success: false, error: `Content too long (max ${PROMPT_LIMITS.content.maxLength.toLocaleString()} characters)` };
  }

  // Return sanitized data
  return {
    success: true,
    data: {
      name: sanitizeString(name as string),
      content: sanitizeString(content as string, true),
    },
  };
}
