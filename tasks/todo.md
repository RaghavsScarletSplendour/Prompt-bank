# Prompt Bank Implementation

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

## Review

### Summary of Changes
Built a simple Prompt Bank application with the following structure:

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
