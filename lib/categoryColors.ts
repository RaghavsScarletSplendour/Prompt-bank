/**
 * Category color configuration
 *
 * To change the color scheme, edit the CATEGORY_COLORS array below.
 * Each entry needs a 'bg' (background) and 'text' (text color) Tailwind class.
 */

export interface CategoryColorScheme {
  bg: string;
  text: string;
}

// Curated aesthetic color palette using Tailwind classes
// Transparent backgrounds with colored text for a refined look
const CATEGORY_COLORS: CategoryColorScheme[] = [
  { bg: 'bg-rose-500/10', text: 'text-rose-400' },
  { bg: 'bg-orange-500/10', text: 'text-orange-400' },
  { bg: 'bg-amber-500/10', text: 'text-amber-400' },
  { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  { bg: 'bg-teal-500/10', text: 'text-teal-400' },
  { bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
  { bg: 'bg-sky-500/10', text: 'text-sky-400' },
  { bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
  { bg: 'bg-violet-500/10', text: 'text-violet-400' },
  { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-400' },
  { bg: 'bg-pink-500/10', text: 'text-pink-400' },
  { bg: 'bg-slate-500/10', text: 'text-slate-400' },
];

/**
 * Simple hash function to convert a string to a number
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Get a consistent color scheme for a category based on its ID
 * Same category ID always returns the same color
 */
export function getCategoryColor(categoryId: string): CategoryColorScheme {
  const index = hashString(categoryId) % CATEGORY_COLORS.length;
  return CATEGORY_COLORS[index];
}

/**
 * Get just the background color class for a category (useful for dots)
 */
export function getCategoryBgColor(categoryId: string): string {
  return getCategoryColor(categoryId).bg;
}
