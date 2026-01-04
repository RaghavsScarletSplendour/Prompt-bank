# Promptr Implementation

## Completed Tasks
- [x] Initialize Next.js project with TypeScript + Tailwind
- [x] Install @clerk/nextjs and @supabase/supabase-js
- [x] Create .env.local template
- [x] Create middleware.ts for Clerk route protection
- [x] Update app/layout.tsx with ClerkProvider
- [x] Create sign-in page
- [x] Create lib/supabase.ts client
- [x] Create API route for prompts (GET/POST)
- [x] Create UserMenu component
- [x] Create PromptCard component
- [x] Create PromptGallery component
- [x] Create PromptForm component
- [x] Build home page with all components
- [x] Add clickable prompt cards with detail modal

## Review

### Summary of Changes
Built a simple Promptr application with the following structure:

**Authentication (Clerk)**
- `middleware.ts` - Protects all routes except /sign-in
- `app/sign-in/[[...sign-in]]/page.tsx` - Clerk sign-in page
- `components/UserMenu.tsx` - User avatar with logout

**Database (Supabase)**
- `lib/supabase.ts` - Supabase client using service role key
- `app/api/prompts/route.ts` - GET/POST endpoints filtered by user_id

**UI Components**
- `components/PromptForm.tsx` - Modal form with name, tags, content fields
- `components/PromptCard.tsx` - Card displaying prompt with tags as badges
- `components/PromptGallery.tsx` - Grid layout of prompt cards
- `app/page.tsx` - Home page combining all components

### Files Created/Modified
```
app/
  layout.tsx (modified - added ClerkProvider)
  page.tsx (replaced - home page)
  sign-in/[[...sign-in]]/page.tsx (new)
  api/prompts/route.ts (new)
components/
  UserMenu.tsx (new)
  PromptCard.tsx (new)
  PromptGallery.tsx (new)
  PromptForm.tsx (new)
lib/
  supabase.ts (new)
middleware.ts (new)
.env.local (new - template)
```

### Before Running
1. Set up Clerk account and add keys to `.env.local`
2. Set up Supabase project and add connection details to `.env.local`
3. Create the `prompts` table in Supabase:
```sql
CREATE TABLE prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  tags TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_prompts_user_id ON prompts(user_id);
```

### Running the App
```bash
npm run dev
```

---

## Clickable Prompt Cards Feature (Latest)

### Summary
Added clickable prompt cards that open a centered modal showing full prompt content and metadata.

### Changes Made
1. **Created `components/Modal.tsx`** - Reusable modal base component (DRY principle)
2. **Created `components/PromptDetailModal.tsx`** - Displays full prompt with name, tags, content, and created date
3. **Refactored `components/PromptForm.tsx`** - Now uses Modal base component
4. **Updated `components/PromptCard.tsx`** - Cards are now clickable, open detail modal

### Features
- Click any prompt card to view full content
- Scrollable modal for long prompts
- Shows: name, tags, full content, created date
- Click outside or X button to close
- Menu button (delete) still works independently

---

---

## Edit Prompts Feature

### Plan
- [x] Add PUT endpoint to `app/api/prompts/route.ts` (reuse existing validation)
- [x] Add edit mode to `PromptDetailModal.tsx` (same modal, editable fields)
- [x] Add `onEdit` callback to `PromptCard.tsx` for refresh after save
- [x] Test the full edit flow

### Approach
- **DRY**: Edit inside existing PromptDetailModal (toggle view/edit mode)
- **Minimal changes**: Only 3 files modified
- **Backend sync**: PUT endpoint validates and updates in Supabase

### Review

**Files Modified:**
- `app/api/prompts/route.ts` - Added PUT endpoint (reuses existing validation)
- `components/PromptDetailModal.tsx` - Added edit mode with toggle, editable inputs, save/cancel buttons
- `components/PromptCard.tsx` - Added optional `onEdit` prop, passed to modal as `onSave`
- `components/PromptGallery.tsx` - Passes `onRefresh` to cards as `onEdit`

**How It Works:**
1. Click a prompt card → opens detail modal (view mode)
2. Click "Edit" button → fields become editable inputs
3. Edit name, tags, content → click "Save"
4. PUT request validates and updates Supabase
5. Gallery refreshes to show updated prompt

**Features:**
- Same modal for view and edit (consistent UX)
- Cancel button reverts changes
- Validation with error messages
- Loading state while saving

### Update: 3-Dot Menu Consolidation

Moved Edit/Delete to 3-dot menu in both card and expanded modal:

**Changes:**
- `PromptCard.tsx` - Added Edit to 3-dot menu, opens modal in edit mode
- `PromptDetailModal.tsx` - Added 3-dot menu (Edit/Delete), removed standalone Edit button

**Flow:**
- Card view: 3-dot menu → Edit or Delete
- Expanded modal: Same 3-dot menu → Edit or Delete
- Edit mode: Save/Cancel buttons appear at bottom

---

## Security Review (Dec 28, 2025)

### Status: SECURE

Performed a comprehensive security review. No critical vulnerabilities found.

### Security Checklist - All Passing

**Secrets & Sensitive Data**
- [x] `.env.local` properly ignored in `.gitignore`
- [x] No env files tracked in git
- [x] Service role key only used server-side
- [x] No hardcoded secrets in code

**Authentication & Authorization**
- [x] All routes protected by Clerk middleware
- [x] API endpoints verify `userId` before processing
- [x] Database queries filter by `user_id`

**Input Validation**
- [x] Server-side validation with sanitization
- [x] Control characters stripped from input
- [x] Max length limits enforced
- [x] UUID format validation on delete

**XSS Protection**
- [x] No `dangerouslySetInnerHTML`
- [x] No `innerHTML` or `eval()`
- [x] React auto-escapes output

**Security Headers (next.config.ts)**
- [x] X-Frame-Options: DENY
- [x] X-Content-Type-Options: nosniff
- [x] X-XSS-Protection enabled
- [x] Permissions-Policy configured

### Optional Recommendations
1. Add HSTS header for HTTPS enforcement
2. Consider Content Security Policy (requires testing)
3. Consider API rate limiting for abuse prevention

---

## Phase 2: Intent-Based Search - Use Case Metadata

### Problem
Phase 1 improved search with query expansion, but prompts still only contain their literal content in embeddings. Adding AI-generated use cases to each prompt will make matching even more accurate.

### Plan

- [ ] **1. Database: Add `use_cases` column**
  - Run SQL in Supabase: `ALTER TABLE prompts ADD COLUMN use_cases TEXT;`
  - Column stores comma-separated use cases generated by AI

- [ ] **2. Create `generateUseCases()` function in `lib/ai.ts`**
  - Use GPT-4o-mini to analyze prompt content
  - Generate 5-8 use cases describing when/why someone would use this prompt
  - Example output: "humanize AI text, make writing sound natural, avoid AI detection, college essays, blog posts"

- [ ] **3. Update `lib/embeddings.ts` - Include use_cases in embedding**
  - Modify `getEmbeddingText()` to accept and include use_cases
  - This ensures use cases are part of the semantic search vector

- [ ] **4. Update `app/api/prompts/route.ts` - POST endpoint**
  - Call `generateUseCases()` after validation
  - Save use_cases to database along with prompt
  - Include use_cases in embedding text

- [ ] **5. Update `app/api/prompts/route.ts` - PUT endpoint**
  - Regenerate use_cases when content changes
  - Update embedding with new use_cases

- [ ] **6. Create backfill endpoint `app/api/prompts/backfill/route.ts`**
  - One-time endpoint to update existing prompts
  - Fetches all user's prompts without use_cases
  - Generates use_cases and updates embeddings
  - Returns count of updated prompts

- [ ] **7. Test the full flow**
  - Create new prompt → verify use_cases generated
  - Edit prompt → verify use_cases regenerated
  - Search with intent → verify improved matching
  - Run backfill → verify existing prompts updated

### Files to Modify/Create
```
lib/ai.ts                              (modify - add generateUseCases)
lib/embeddings.ts                      (modify - include use_cases)
app/api/prompts/route.ts               (modify - POST/PUT)
app/api/prompts/backfill/route.ts      (new - one-time backfill)
```

### Cost Estimate
- GPT-4o-mini for use case generation: ~200 tokens per prompt
- One-time backfill cost depends on existing prompt count
- Ongoing: ~$0.00003 per prompt creation/edit

### Example Flow
```
User creates prompt: "Make my text sound human and natural..."
→ AI generates: "humanize text, natural writing, avoid AI detection, academic essays, blog posts, professional emails"
→ Embedding includes: name + content + tags + use_cases
→ User searches "writing essay for college"
→ High match score because "academic essays" is in use_cases
```

---

## Categories Feature (Dec 30, 2025)

### Summary
Added user-assigned categories to organize prompts. Users can create, rename, and delete categories, assign prompts to categories, and filter by category in the gallery.

### Requirements
- One category per prompt (optional)
- Categories managed inline in gallery header
- Filter prompts by category

### Database Changes
```sql
-- New table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE UNIQUE INDEX categories_user_name_idx ON categories (user_id, name);

-- Add to prompts
ALTER TABLE prompts ADD COLUMN category_id UUID REFERENCES categories(id) ON DELETE SET NULL;
```

### Files Created
- `app/api/categories/route.ts` - Full CRUD API for categories
- `components/CategoryManager.tsx` - Dropdown filter + manage modal

### Files Modified
- `lib/types.ts` - Added Category interface, added category_id to Prompt
- `app/api/prompts/route.ts` - Accept category_id in POST/PUT
- `components/PromptForm.tsx` - Added category dropdown
- `components/PromptDetailModal.tsx` - Display/edit category
- `components/PromptCard.tsx` - Show category badge (purple)
- `components/PromptGallery.tsx` - Pass categories to cards
- `app/gallery/page.tsx` - Fetch categories, filter, integrate CategoryManager
- `app/search/page.tsx` - Pass categories to PromptGallery for compatibility

### How It Works
1. Gallery header shows: `[Your Prompts] [Category: All v] [+ Add Prompt]`
2. Category dropdown has: All | Uncategorized | <user categories> | Manage...
3. "Manage Categories" opens modal to create/rename/delete
4. When creating/editing prompts, user can select a category
5. Category shown as purple badge on cards (tags are blue)
6. Deleting a category sets prompts to uncategorized (ON DELETE SET NULL)

### UI Notes
- Categories shown as purple badges to distinguish from blue tag badges
- Filter is client-side for simplicity
- Category names max 50 characters

---

## DRY Design System Implementation (Dec 30, 2025)

### Summary
Centralized UI styles with design tokens and reusable base components (Button, Card) to ensure 100% consistency across the application.

### Completed Tasks
- [x] Add design tokens to globals.css (colors, shadows, radii, transitions)
- [x] Create universal Button component (`components/ui/Button.tsx`)
- [x] Create universal Card component (`components/ui/Card.tsx`)
- [x] Refactor PromptCard.tsx to use Card and Button components
- [x] Refactor PromptForm.tsx to use Button component
- [x] Refactor PromptDetailModal.tsx to use Button component
- [x] Refactor ConfirmDialog.tsx to use Modal and Button components
- [x] Refactor CategoryManager.tsx to use Button component
- [x] Refactor gallery/page.tsx to use Button component
- [x] Refactor search/page.tsx to use Button component
- [x] Refactor CopyButton.tsx to use Button component

### Files Created (2)
1. `components/ui/Button.tsx` - Universal button with 5 variants (primary, secondary, ghost, danger, icon) and 3 sizes (sm, md, lg)
2. `components/ui/Card.tsx` - Universal card with padding options and interactive state

### Files Modified (10)
1. `app/globals.css` - Added design tokens (semantic colors, surfaces, borders, shadows, radii, transitions)
2. `components/PromptCard.tsx` - Now uses Card and Button components
3. `components/PromptForm.tsx` - Now uses Button component
4. `components/PromptDetailModal.tsx` - Now uses Button component for all buttons
5. `components/ConfirmDialog.tsx` - Simplified to use Modal + Button, removing duplicated overlay markup
6. `components/CategoryManager.tsx` - Now uses Button component
7. `components/ui/CopyButton.tsx` - Now uses Button component internally
8. `app/gallery/page.tsx` - Add Prompt button now uses Button component
9. `app/search/page.tsx` - Toggle and close buttons now use Button component

### Key Improvements
- **Single Source of Truth**: All button styles now come from one component
- **Eliminated Duplication**: ConfirmDialog no longer duplicates Modal markup
- **Consistent Shadows**: Card shadows now use CSS variable `--shadow-card`
- **Design Tokens**: Centralized color, spacing, and transition values in globals.css

### DRY Audit Checklist

Before adding new UI components, verify:

1. **Check for existing components** in `/components/ui/`
   - Use `Button` for all clickable actions
   - Use `Card` for card-like containers

2. **Use design tokens** from `globals.css`
   - `--shadow-card` for card shadows
   - `--color-*` for semantic colors
   - `--radius-*` for border radius

3. **Follow button variants**:
   | Variant | Use Case |
   |---------|----------|
   | `primary` | Main actions (Save, Submit) |
   | `secondary` | Secondary actions (Add, Create) |
   | `ghost` | Cancel, Close, low emphasis |
   | `danger` | Destructive actions (Delete) |
   | `icon` | Icon-only buttons |

---

## Supabase RLS Security Implementation (Dec 30, 2025)

### Summary
Implemented database-level Row Level Security (RLS) with Clerk JWT integration to replace application-level `user_id` filtering. This provides true defense-in-depth security.

### Problem
The app was using Supabase service role key (which bypasses RLS) and manually filtering by `user_id` in application code. This was error-prone - any missed filter could expose other users' data.

### Solution
Integrated Clerk JWTs with Supabase so that RLS policies enforce user isolation at the database level.

### Files Created (1)
- `lib/auth.ts` - Helper to get Clerk JWT token for Supabase (`requireSupabaseToken()`)

### Files Modified (5)
- `lib/supabase.ts` - Split into `getSupabaseClient(token)` (uses anon key + JWT, respects RLS) and `getSupabaseServiceClient()` (service role, bypasses RLS)
- `app/api/prompts/route.ts` - Uses RLS-aware client, removed `.eq("user_id", userId)` from queries
- `app/api/categories/route.ts` - Same pattern
- `app/api/prompts/search/route.ts` - Uses RLS-aware client, removed `match_user_id` param from RPC
- `app/api/prompts/backfill/route.ts` - Uses RLS-aware client, removed manual filters

### Manual Setup Required

**1. Clerk Dashboard - Create JWT Template:**
- Go to JWT Templates → Create "supabase" template
- Set signing key = Supabase JWT Secret
- Claims: `{"aud": "authenticated", "role": "authenticated", "user_id": "{{user.id}}"}`

**2. Add Environment Variable:**
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
```

**3. Supabase SQL - Enable RLS & Create Policies:**
```sql
-- Enable RLS
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Prompts policies
CREATE POLICY "Users can view their own prompts" ON prompts FOR SELECT
  USING (auth.jwt() ->> 'user_id' = user_id);
CREATE POLICY "Users can insert their own prompts" ON prompts FOR INSERT
  WITH CHECK (auth.jwt() ->> 'user_id' = user_id);
CREATE POLICY "Users can update their own prompts" ON prompts FOR UPDATE
  USING (auth.jwt() ->> 'user_id' = user_id)
  WITH CHECK (auth.jwt() ->> 'user_id' = user_id);
CREATE POLICY "Users can delete their own prompts" ON prompts FOR DELETE
  USING (auth.jwt() ->> 'user_id' = user_id);

-- Categories policies (same pattern)
CREATE POLICY "Users can view their own categories" ON categories FOR SELECT
  USING (auth.jwt() ->> 'user_id' = user_id);
CREATE POLICY "Users can insert their own categories" ON categories FOR INSERT
  WITH CHECK (auth.jwt() ->> 'user_id' = user_id);
CREATE POLICY "Users can update their own categories" ON categories FOR UPDATE
  USING (auth.jwt() ->> 'user_id' = user_id)
  WITH CHECK (auth.jwt() ->> 'user_id' = user_id);
CREATE POLICY "Users can delete their own categories" ON categories FOR DELETE
  USING (auth.jwt() ->> 'user_id' = user_id);
```

**4. Supabase SQL - Update `match_prompts` RPC:**
```sql
DROP FUNCTION IF EXISTS match_prompts(vector(1536), text, int, float);

CREATE OR REPLACE FUNCTION match_prompts(
  query_embedding vector(1536),
  match_count int DEFAULT 10,
  match_threshold float DEFAULT 0.5
)
RETURNS TABLE (
  id uuid, name text, content text, use_cases text,
  category_id uuid, created_at timestamptz, similarity float
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.name, p.content, p.use_cases, p.category_id, p.created_at,
         1 - (p.embedding <=> query_embedding) AS similarity
  FROM prompts p
  WHERE p.user_id = (auth.jwt() ->> 'user_id')
    AND p.embedding IS NOT NULL
    AND 1 - (p.embedding <=> query_embedding) > match_threshold
  ORDER BY p.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

### Security Improvement
| Before | After |
|--------|-------|
| Service role key (bypasses RLS) | Anon key + JWT (respects RLS) |
| Manual `.eq("user_id")` filters | Database enforces isolation |
| Bug = data leak | Bug = empty result (safe) |

### Rollback Plan
```sql
ALTER TABLE prompts DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
```
Then revert code to use `getSupabaseServiceClient()` with manual filters.

---

## Particles.js Background Implementation (Jan 1, 2026)

### Summary
Replaced the flat black background with an interactive particles.js system across all pages.

### Completed Tasks
- [x] Install @tsparticles/react and @tsparticles/slim dependencies
- [x] Create config/particles-config.json with user's configuration
- [x] Create components/ParticlesBackground.tsx component
- [x] Update app/layout.tsx to include ParticlesBackground
- [x] Test the implementation (build successful)

### Files Created (2)
1. `config/particles-config.json` - Particles configuration (user-provided settings)
2. `components/ParticlesBackground.tsx` - Client component with fixed full-screen positioning

### Files Modified (1)
1. `app/layout.tsx` - Added ParticlesBackground import and component, removed bg-black

### Features
- **227 white particles** with random sizes (1-8px)
- **Linked lines** between nearby particles (distance: 224px, opacity: 0.47)
- **Hover interaction**: Grab mode - lines connect to cursor
- **Click interaction**: Push mode - adds 4 new particles
- **Movement**: Speed 6, random directions, particles exit and re-enter screen
- **Retina detection**: Enabled for high-DPI displays

### Technical Notes
- Uses `@tsparticles/react` and `@tsparticles/slim` (modern successor to particles.js)
- Component uses "use client" directive (requires browser APIs)
- Full-screen mode with z-index: -1 (renders behind all content)
- Configuration converted from particles.js format to tsparticles format

---

## 8pt Grid System Implementation (Jan 1, 2026)

### Summary
Applied the 8pt grid system to create visual rhythm in the UI. All key spacing values now use multiples of 8 (8, 16, 24, 32, 48, 64px).

### Completed Tasks
- [x] Update Sidebar.tsx - Fixed width 240px, 8pt-compliant spacing
- [x] Update layout.tsx - Main container padding 64px

### Files Modified (2)
1. `components/Sidebar.tsx`
   - Changed expanded width: `w-fit pr-6` → `w-60` (240px fixed)
   - Changed nav gap: `gap-5` (20px) → `gap-6` (24px)
   - Changed link padding: `px-3` (12px) → `px-4` (16px)
   - Changed collapsed padding: `p-1.5` (6px) → `p-2` (8px)
   - Changed bottom padding: `px-3` → `px-4`

2. `app/layout.tsx`
   - Changed main padding: `p-8` (32px) → `p-16` (64px)

### 8pt Grid Values Applied
| Element | Old Value | New Value |
|---------|-----------|-----------|
| Sidebar width | variable | 240px (w-60) |
| Main padding | 32px | 64px |
| Nav gap | 20px | 24px |
| Link padding | 12px | 16px |
| Collapsed padding | 6px | 8px |

### Notes
- Grid gap (24px) was already 8pt compliant - no change needed
- Card padding (16px, 24px, 32px) was already compliant
